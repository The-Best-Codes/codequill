import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UseSnippetsReturn } from "@/routes/home/types";
import { Save } from "lucide-react";
import React from "react";
import LanguageSelector from "./LanguageSelector";

interface HeaderProps
  extends Pick<
    UseSnippetsReturn,
    | "filename"
    | "setFilename"
    | "language"
    | "setLanguage"
    | "saving"
    | "saveCurrentSnippet"
  > {
  toggleSidebar: () => void;
  showSidebar: boolean;
}

const Header: React.FC<HeaderProps> = ({
  filename,
  setFilename,
  language,
  setLanguage,
  saving,
  saveCurrentSnippet,
}) => {
  return (
    <div className="flex w-full gap-4 p-4 items-center justify-between border-b">
      <div className="flex flex-row gap-2">
        <Input
          type="text"
          placeholder="Filename"
          className="flex-grow max-w-md"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
        />

        <LanguageSelector language={language} setLanguage={setLanguage} />
      </div>

      <Button onClick={saveCurrentSnippet} disabled={saving}>
        <Save className={cn("h-4 w-4", saving && "animate-spin")} />
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
};

export default Header;
