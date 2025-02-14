import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { UseSnippetsReturn } from "@/routes/home/types";
import { Copy, Menu, Plus, Search, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface SnippetSidebarProps extends UseSnippetsReturn {
  showSidebar: boolean;
  toggleSidebar: () => void;
}

const SnippetSidebar: React.FC<SnippetSidebarProps> = ({
  showSidebar,
  toggleSidebar,
  loading,
  error,
  searchQuery,
  setSearchQuery,
  filteredSnippets,
  selectedSnippetId,
  loadSnippetInEditor,
  copySnippet,
  setDeleteOpen,
  setSelectedSnippetId,
  createNewSnippet,
}) => {
  const isMobile = useIsMobile();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchExpanded, setSearchExpanded] = useState(false);

  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  const handleNewSnippetClick = () => {
    createNewSnippet();
    if (isMobile) toggleSidebar();
  };

  const handleSearchIconClick = () => {
    setSearchExpanded(!searchExpanded);
    toggleSidebar();
  };

  return (
    <>
      {/* Collapsed Sidebar (same for mobile and desktop) */}
      <div
        className={cn(
          "relative h-full w-12 border-r z-40 bg-background",
          showSidebar ? "hidden" : "block",
        )}
      >
        <div className="flex flex-col items-center justify-start p-2 gap-2 w-12">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
          <Button variant="default" size="icon" onClick={handleNewSnippetClick}>
            <Plus className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleSearchIconClick}>
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Expanded Content */}
      {isMobile ? (
        <Sheet open={showSidebar} onOpenChange={toggleSidebar}>
          <SheetContent
            aria-describedby="sidebar-header"
            side="left"
            className="pt-3 w-72"
          >
            <SheetHeader id="sidebar-header" className="mb-2">
              <h1 className="text-lg font-semibold">CodeQuill</h1>
            </SheetHeader>
            <div className="flex flex-col w-full gap-2">
              <Button variant="default" onClick={handleNewSnippetClick}>
                <Plus className="h-4 w-4" />
                New Snippet
              </Button>
              <Input
                placeholder="Search snippets..."
                className="mb-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                ref={searchInputRef}
              />
            </div>
            <ScrollArea className="h-[calc(100vh-180px)]">
              {loading && (
                <>
                  <Skeleton className="h-8 w-full m-2" />
                  <Skeleton className="h-8 w-full m-2" />
                </>
              )}
              {error && <div className="p-4 text-sm text-red-500">{error}</div>}
              {!loading &&
                !error &&
                filteredSnippets.map((snippet) => (
                  <ContextMenu key={snippet.id}>
                    <ContextMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start",
                          selectedSnippetId === snippet.id &&
                            "bg-accent text-accent-foreground",
                        )}
                        onClick={() => {
                          loadSnippetInEditor(snippet.id);
                          toggleSidebar();
                        }}
                      >
                        {snippet.filename}
                      </Button>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem onClick={() => copySnippet(snippet.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() => {
                          setSelectedSnippetId(snippet.id);
                          setDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
            </ScrollArea>
          </SheetContent>
        </Sheet>
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
              <Input
                placeholder="Search snippets..."
                className="mb-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                ref={searchInputRef}
              />
            </div>
            <ScrollArea className="h-[calc(100vh-200px)]">
              {loading && (
                <>
                  <Skeleton className="h-8 w-full m-2" />
                  <Skeleton className="h-8 w-full m-2" />
                </>
              )}
              {error && <div className="p-4 text-sm text-red-500">{error}</div>}
              {!loading &&
                !error &&
                filteredSnippets.map((snippet) => (
                  <ContextMenu key={snippet.id}>
                    <ContextMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start",
                          selectedSnippetId === snippet.id &&
                            "bg-accent text-accent-foreground",
                        )}
                        onClick={() => loadSnippetInEditor(snippet.id)}
                      >
                        {snippet.filename}
                      </Button>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem onClick={() => copySnippet(snippet.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() => {
                          setSelectedSnippetId(snippet.id);
                          setDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
            </ScrollArea>
          </div>
        )
      )}
    </>
  );
};

export default SnippetSidebar;
