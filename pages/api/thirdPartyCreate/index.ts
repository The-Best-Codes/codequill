import { NextApiRequest, NextApiResponse } from "next";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import detectLanguage from "@/utils/detectLang";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });
  if (req.method === "POST") {
    let { name, code } = req.body;
    let { language } = req.body;

    if (!name) {
      name = `Project ${new Date().toLocaleString()}`;
    }

    if (!code) {
      res.status(400).end();
    }

    code = decodeURIComponent(code);

    const allowedLanguages = [
      "html",
      "javascript",
      "typescript",
      "python",
      "java",
      "c",
      "php",
      "css",
    ];

    if (!language) {
      let detectedLanguage = detectLanguage(code);
      language = detectedLanguage ? detectedLanguage : "auto";
    }

    if (!allowedLanguages.includes(language)) {
      language = "auto";
    }

    const metadata = {
      created: new Date().getTime(),
      updated: new Date().getTime(),
    };

    const result = await db.run(
      "INSERT INTO projects (name, code, language, metadata) VALUES (?, ?, ?, ?)",
      [name, code, language, JSON.stringify(metadata)]
    );
    res.writeHead(302, { Location: `/?shareId=${result.lastID}` });
    res.end();
  } else {
    res.status(405).end();
  }
}
