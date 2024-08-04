import fs from "fs";
import path from "path";

export default async function initDb() {
    if (!fs.existsSync(path.join(process.cwd(), "database.sqlite"))) {
        // Create the database file
        fs.writeFileSync(path.join(process.cwd(), "database.sqlite"), "");
    }
}