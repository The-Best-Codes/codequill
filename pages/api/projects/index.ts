import { NextApiRequest, NextApiResponse } from "next";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });

  if (req.method === "GET") {
    const projects = await db.all("SELECT * FROM projects");
    res.json(projects);
  } else if (req.method === "POST") {
    const { name, code, language } = req.body;
    const result = await db.run(
      "INSERT INTO projects (name, code, language) VALUES (?, ?, ?)",
      [name, code, language]
    );
    res.json({ id: result.lastID });
  } else {
    res.status(405).end();
  }
}
