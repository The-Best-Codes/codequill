import Kbd from "@/components/cq/kbd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { UseSnippetsReturn } from "@/routes/home/types";
import { Eye, EyeOff, Loader2, Save } from "lucide-react";
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
    | "isPreviewable"
    | "isPreviewing"
    | "togglePreview"
  > {}

const Header: React.FC<HeaderProps> = ({
  filename,
  setFilename,
  language,
  setLanguage,
  saving,
  saveCurrentSnippet,
  isPreviewable,
  isPreviewing,
  togglePreview,
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

      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={saveCurrentSnippet}
                disabled={saving}
                className="flex items-center w-fit"
              >
                {saving ? (
                  <Loader2 className={cn("h-5 w-5 animate-spin")} />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                <span className="sr-only sm:not-sr-only">
                  {saving ? "Saving..." : "Save"}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <Kbd keys={["S"]} />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button
          onClick={togglePreview}
          disabled={!isPreviewable}
          variant="default"
          className="flex items-center w-fit"
        >
          {isPreviewing ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
          <span className="sr-only sm:not-sr-only">
            {isPreviewable
              ? isPreviewing
                ? "Hide Preview"
                : "Show Preview"
              : "No Preview"}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default Header;
