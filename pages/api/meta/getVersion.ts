import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const filePath = path.join(process.cwd(), "package.json");
  const fileContent = fs.readFileSync(filePath, "utf8");
  const packageJson = JSON.parse(fileContent);
  res.status(200).json(packageJson.version);
}
