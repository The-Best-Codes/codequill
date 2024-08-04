import { NextApiRequest, NextApiResponse } from "next";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import initDb from "@/utils/initDb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await initDb();
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });

  if (req.method === "GET") {
    const { sort } = req.query;

    let projects = await db.all(
      "SELECT *, metadata as json_metadata FROM projects"
    );

    // Sort projects based on the sort parameter
    if (sort) {
      projects.sort((a, b) => {
        let compareValue = 0;

        // For sorting by name, which is not inside metadata
        if (sort === "name") {
          compareValue = a.name.localeCompare(b.name);
        } else {
          const metadataA = JSON.parse(a.json_metadata || "{}");
          const metadataB = JSON.parse(b.json_metadata || "{}");

          // For sorting by created date
          if (sort === "date_created") {
            compareValue =
              (new Date(metadataA.created) as any) -
              (new Date(metadataB.created) as any);
          }

          // For sorting by updated date
          if (sort === "date_modified") {
            compareValue =
              (new Date(metadataA.updated) as any) -
              (new Date(metadataB.updated) as any);
          }
        }

        return compareValue;
      });
    }

    projects = projects.map((project) => ({
      ...project,
      code: "",
      metadata: JSON.parse(project.json_metadata),
    }));

    res.json(projects);
  } else if (req.method === "POST") {
    const { name, code, language, metadataSet } = req.body;
    let metadata = {};
    if (metadataSet) {
      metadata = JSON.parse(metadataSet);
    } else {
      const date = new Date().getTime();
      metadata = { created: date, updated: date };
    }

    const result = await db.run(
      "INSERT INTO projects (name, code, language, metadata) VALUES (?, ?, ?, ?)",
      [name, code, language, JSON.stringify(metadata)]
    );
    res.json({ id: result.lastID });
  } else {
    res.status(405).end();
  }
}
