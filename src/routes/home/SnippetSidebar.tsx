import Kbd from "@/components/cq/kbd";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { UseSnippetsReturn } from "@/routes/home/types";
import { Snippet } from "@/utils/database";
import Copy from "lucide-react/dist/esm/icons/copy";
import Inbox from "lucide-react/dist/esm/icons/inbox";
import Info from "lucide-react/dist/esm/icons/info";
import Menu from "lucide-react/dist/esm/icons/menu";
import Plus from "lucide-react/dist/esm/icons/plus";
import Search from "lucide-react/dist/esm/icons/search";
import Settings from "lucide-react/dist/esm/icons/settings";
import Trash2 from "lucide-react/dist/esm/icons/trash-2";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import SnippetInfoDialog from "./SnippetInfoDialog";

interface SnippetSidebarProps
  extends Omit<UseSnippetsReturn, "searchQuery" | "setSearchQuery"> {
  showSidebar: boolean;
  toggleSidebar: () => void;
  setIsSearchDialogOpen: (open: boolean) => void;
}

const SnippetSidebar: React.FC<SnippetSidebarProps> = ({
  showSidebar,
  toggleSidebar,
  loading,
  error,
  filteredSnippets,
  selectedSnippetId,
  loadSnippetInEditor,
  copySnippet,
  setDeleteOpen,
  createNewSnippet,
  setIsSearchDialogOpen,
  setDeletingSnippetId,
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Ref to the currently selected snippet element
  const selectedSnippetRef = useRef<HTMLDivElement>(null);

  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [currentSnippetForInfo, setCurrentSnippetForInfo] =
    useState<Snippet | null>(null);

  const handleNewSnippetClick = () => {
    createNewSnippet();
    if (isMobile) toggleSidebar();
  };

  const handleSearchIconClick = () => {
    setIsSearchDialogOpen(true);
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  const handleInfoClick = (snippet: Snippet) => {
    setCurrentSnippetForInfo(snippet);
    setIsInfoDialogOpen(true);
  };

  // Effect to scroll to the selected snippet
  useEffect(() => {
    if (selectedSnippetRef.current) {
      try {
        selectedSnippetRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } catch (error) {
        console.error("Error scrolling to selected snippet:", error);
      }
    }
  }, [selectedSnippetId, showSidebar]);

  const renderSnippetList = () => {
    if (loading) {
      return (
        <>
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full mb-2" />
        </>
      );
    }

    if (error) {
      return <div className="p-4 text-sm text-red-500">{error}</div>;
    }

    if (filteredSnippets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center mt-8 h-full">
          <Inbox className="w-10 h-10 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {t("noSnippetsFound")}
          </span>
        </div>
      );
    }

    return filteredSnippets.map((snippet) => (
      <div
        key={snippet.id}
        className="mb-0.5"
        ref={selectedSnippetId === snippet.id ? selectedSnippetRef : null}
      >
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                selectedSnippetId === snippet.id &&
                  "bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-600 dim:bg-neutral-700 dim:hover:bg-neutral-600 text-accent-foreground",
              )}
              onClick={() => loadSnippetInEditor(snippet.id)}
            >
              {snippet.filename}
            </Button>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              className="cursor-pointer"
              onClick={() => copySnippet(snippet.id)}
            >
              <Copy className="size-4" />
              {t("copy")}
            </ContextMenuItem>
            <ContextMenuItem
              className="cursor-pointer"
              onClick={() => handleInfoClick(snippet)}
            >
              <Info className="size-4" />
              {t("info")}
            </ContextMenuItem>
            <ContextMenuItem
              className="cursor-pointer"
              onClick={() => {
                setDeletingSnippetId(snippet.id);
                setDeleteOpen(true);
              }}
              variant="destructive"
            >
              <Trash2 className="size-4" />
              {t("delete")}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    ));
  };

  return (
    <>
      {/* Collapsed Sidebar (same for mobile and desktop) */}
      <div
        className={cn(
          "relative h-full w-12 border-r z-40 bg-background",
          showSidebar ? "hidden" : "flex flex-col",
        )}
      >
        <div className="flex flex-col items-center justify-start p-2 gap-2 w-12">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                  <Menu className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <Kbd keys={["B"]} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  onClick={handleNewSnippetClick}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <Kbd keys={["N"]} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSearchIconClick}
                >
                  <Search className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <Kbd keys={["K"]} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="mt-auto flex items-center justify-center pb-2 w-12">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSettingsClick}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <Kbd keys={["Comma"]} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Expanded Content */}
      {isMobile ? (
        <>
          <div
            hidden={!showSidebar}
            className="flex flex-col items-center justify-start p-2 gap-2 w-12"
          ></div>
          <Sheet open={showSidebar} onOpenChange={toggleSidebar}>
            <SheetContent
              aria-describedby="sidebar-header"
              side="left"
              className="p-2 w-72 h-full flex flex-col"
            >
              <SheetHeader id="sidebar-header" className="mb-2 p-0 pt-1.5">
                <SheetTitle>{t("appTitle")}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col w-full gap-2">
                <Button variant="default" onClick={handleNewSnippetClick}>
                  <Plus className="h-4 w-4" />
                  {t("newSnippet")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setIsSearchDialogOpen(true)}
                >
                  <Search className="h-5 w-5 mr-2" />
                  {t("searchSnippets")}
                </Button>
              </div>
              <ScrollArea className="h-full mb-2">
                {renderSnippetList()}
              </ScrollArea>
              <div className="mt-auto">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleSettingsClick}
                >
                  <Settings className="h-5 w-5" />
                  {t("settings")}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </>
      ) : (
        showSidebar && (
          <div className="w-64 border-r bg-background flex flex-col">
            <div className="flex items-center justify-between p-2">
              <h1 className="text-lg font-semibold">{t("appTitle")}</h1>
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <Menu className="h-5 w-5" />
              </Button>
            </div>
            <div className="px-2 flex flex-col gap-2">
              <Button variant="default" onClick={handleNewSnippetClick}>
                <Plus className="h-4 w-4" />
                {t("newSnippet")}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setIsSearchDialogOpen(true)}
              >
                <Search className="h-5 w-5 mr-2" />
                {t("searchSnippets")}
              </Button>
            </div>
            <ScrollArea className="h-full mb-2 p-2">
              {renderSnippetList()}
            </ScrollArea>
            <div className="mt-auto p-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleSettingsClick}
              >
                <Settings className="h-5 w-5" />
                {t("settings")}
              </Button>
            </div>
          </div>
        )
      )}
      <SnippetInfoDialog
        isOpen={isInfoDialogOpen}
        setOpen={setIsInfoDialogOpen}
        snippet={currentSnippetForInfo}
      />
    </>
  );
};

export default SnippetSidebar;
