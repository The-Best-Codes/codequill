import Kbd from "@/components/cq/kbd";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { UseSnippetsReturn } from "@/routes/home/types";
import { Eye, EyeOff, Loader2, MoreHorizontal, Save } from "lucide-react";
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

      <div className="hidden gap-2 lg:flex">
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

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent>
              <Kbd keys={["P"]} />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild className="flex lg:hidden min-w-8">
          <Button variant="outline" className="h-8 w-8 p-0">
            <span className="sr-only">Open user menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={saveCurrentSnippet} disabled={saving}>
            <Save className="h-4 w-4" />
            <span>{saving ? "Saving..." : "Save"}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={togglePreview} disabled={!isPreviewable}>
            {isPreviewing ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span>
              {isPreviewable
                ? isPreviewing
                  ? "Hide Preview"
                  : "Show Preview"
                : "No Preview"}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Header;
