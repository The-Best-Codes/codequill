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

  const { id } = req.query;

  if (req.method === "GET") {
    const project = await db.get("SELECT * FROM projects WHERE id = ?", [id]);
    res.json(project);
  } else if (req.method === "PUT") {
    const { name, code, language } = req.body;
    await db.run(
      "UPDATE projects SET name = ?, code = ?, language = ? WHERE id = ?",
      [name, code, language, id]
    );
    res.status(200).end();
  } else if (req.method === "DELETE") {
    await db.run("DELETE FROM projects WHERE id = ?", [id]);
    res.status(200).end();
  } else {
    res.status(405).end();
  }
}
