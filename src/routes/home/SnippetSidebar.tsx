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
import {
  Copy,
  Inbox,
  Menu,
  Plus,
  Search,
  Settings,
  Trash2,
} from "lucide-react";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

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

  // Ref to the currently selected snippet element
  const selectedSnippetRef = useRef<HTMLDivElement>(null);

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
            No snippets found.
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
                  "bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-accent-foreground",
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
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </ContextMenuItem>
            <ContextMenuItem
              className="cursor-pointer"
              onClick={() => {
                setDeletingSnippetId(snippet.id);
                setDeleteOpen(true);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
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
              className="pt-3 w-72 h-full flex flex-col pb-2"
            >
              <SheetHeader id="sidebar-header" className="mb-2">
                <SheetTitle>CodeQuill</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col w-full gap-2">
                <Button variant="default" onClick={handleNewSnippetClick}>
                  <Plus className="h-4 w-4" />
                  New Snippet
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setIsSearchDialogOpen(true)}
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
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
                  Settings
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </>
      ) : (
        showSidebar && (
          <div className="w-64 border-r bg-background flex flex-col">
            <div className="flex items-center justify-between p-2">
              <h1 className="text-lg font-semibold">CodeQuill</h1>
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <Menu className="h-5 w-5" />
              </Button>
            </div>
            <div className="px-2 flex flex-col gap-2">
              <Button variant="default" onClick={handleNewSnippetClick}>
                <Plus className="h-4 w-4 mr-2" />
                New Snippet
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setIsSearchDialogOpen(true)}
              >
                <Search className="h-5 w-5 mr-2" />
                Search
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
                Settings
              </Button>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default SnippetSidebar;
