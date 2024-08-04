import { NextApiRequest, NextApiResponse } from "next";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import detectLanguage from "@/utils/detectLang";
import initDb from "@/utils/initDb";

// Helper function to escape HTML entities
function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await initDb();
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });
  if (req.method === "POST") {
    let { name, code } = req.body;
    let { language, overrideURI } = req.body;

    if (!name) {
      name = `Project ${new Date().toLocaleString()}`;
    }

    if (!code) {
      res.status(400).end();
    }

    try {
      code = decodeURIComponent(code);
    } catch (error: any) {
      if (overrideURI !== "true") {
        res.status(200).write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Error</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding-top: 50px; }
                .error-container { background-color: #f2f2f2; margin: auto; padding: 20px; border-radius: 10px; width: 50%; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); }
                h1 { color: #333; }
                .button { background-color: #4CAF50; color: white; padding: 14px 20px; margin: 8px 0; border: none; border-radius: 4px; cursor: pointer; }
                .button:hover { background-color: #45a049; }
                p, i { color: #555; }
              </style>
            </head>
            <body>
              <div class="error-container">
                <h1>Invalid URI</h1>
                <form action="${encodeURIComponent(
                  req.url || ""
                )}" method="post">
                  <input type="hidden" name="name" value="${escapeHtml(name)}">
                  <input type="hidden" name="code" value="${encodeURIComponent(
                    code
                  )}">
                  <input type="hidden" name="language" value="${escapeHtml(
                    language
                  )}">
                  <input type="hidden" name="overrideURI" value="true">
                  <button type="submit" class="button">Save anyway</button>
                </form>
                <p>Error: <b>${escapeHtml(error.toString())}</b></p>
                <i>Saving the code anyway may result in random characters throughout your code.</i>
              </div>
            </body>
          </html>
        `);
        res.end();
        return;
      }
    }

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
    res.status(405).write("Method not allowed");
    res.end();
  }
}
