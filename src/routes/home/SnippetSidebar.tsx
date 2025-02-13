import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input"; // Import Input
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"; // Import Sheet components
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile"; // Import useIsMobile
import { cn } from "@/lib/utils";
import { UseSnippetsReturn } from "@/routes/home/types";
import { Copy, Menu, Plus, Search, Trash2 } from "lucide-react"; // Import icons
import React, { useEffect, useRef, useState } from "react";

interface SnippetSidebarProps extends UseSnippetsReturn {
  showSidebar: boolean;
  toggleSidebar: () => void;
}

const SnippetSidebar: React.FC<SnippetSidebarProps> = ({
  showSidebar,
  toggleSidebar,
  snippets,
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
  const isMobile = useIsMobile(); // Use the custom hook
  const [sheetOpen, setSheetOpen] = useState(false); // Control Sheet's open state
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchExpanded, setSearchExpanded] = useState(false); // State for search icon expansion

  // Focus the search input when the sidebar is opened and the search button is clicked.
  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  useEffect(() => {
    if (!isMobile) {
      setSheetOpen(showSidebar); // Sync sheet open state with showSidebar on desktop
    }
  }, [isMobile, showSidebar]);

  const handleNewSnippetClick = () => {
    if (isMobile) {
      setSheetOpen(false);
    }
    createNewSnippet();
  };

  const handleSearchIconClick = () => {
    setSearchExpanded(!searchExpanded);
    if (!showSidebar) {
      toggleSidebar();
    }
  };

  return (
    <>
      {isMobile ? (
        // Mobile View: Collapsed bar and Sheet
        <>
          <div className="fixed top-0 left-0 z-40 flex h-12 w-full items-center justify-between bg-secondary px-2">
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSheetOpen(true);
                }}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <Button variant="ghost" size="icon" onClick={handleNewSnippetClick}>
              <Plus className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                handleSearchIconClick();
                setSheetOpen(true);
              }}
            >
              <Search className="h-5 w-5" />
            </Button>
            {searchExpanded && (
              <Input
                placeholder="Search snippets..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchQuery(e.target.value);
                }}
                ref={searchInputRef}
                className="absolute left-1/2 top-1/2 z-50 w-64 -translate-x-1/2 -translate-y-1/2"
              />
            )}
          </div>

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetContent side="left" className="pt-12">
              <SheetHeader>
                <h1 className="text-lg font-semibold">CodeQuill</h1>
              </SheetHeader>
              <div className="px-2 flex flex-col w-full gap-2">
                <Button
                  variant="default"
                  onClick={handleNewSnippetClick}
                  className=""
                >
                  <Plus className="h-4 w-4" />
                  <span>New Snippet</span>
                </Button>
                <Input
                  placeholder="Search snippets..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchQuery(e.target.value);
                  }}
                  ref={searchInputRef}
                />
              </div>
              <ScrollArea className="h-[calc(100vh - 200px)]">
                {/* Adjust height calculation as needed */}
                {loading && (
                  <>
                    <Skeleton className="h-8 w-full m-2" />
                    <Skeleton className="h-8 w-full m-2" />
                  </>
                )}
                {error && (
                  <div className="p-4 text-sm text-red-500">{error}</div>
                )}
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
                            setSheetOpen(false); // Close sheet after selection
                          }}
                        >
                          {snippet.filename}
                        </Button>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem
                          onClick={() => copySnippet(snippet.id)}
                        >
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
        </>
      ) : (
        // Desktop View: Original Sidebar
        <div className="md:flex md:flex-col">
          <div
            className={` ${showSidebar ? "w-64" : "w-12"} overflow-hidden flex flex-col`}
          >
            {/* Thin Bar for Collapsed State */}
            <div
              className={`flex flex-col items-center justify-start p-2 ${
                showSidebar ? "hidden" : "flex"
              } gap-2`}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  toggleSidebar();
                  if (searchInputRef.current) {
                    searchInputRef.current.focus();
                  }
                }}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Button
                variant="default"
                size="icon"
                onClick={handleNewSnippetClick}
              >
                <Plus className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleSearchIconClick}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>

            {/* Expanded Sidebar Content */}
            <div className={`${showSidebar ? "block" : "hidden"}`}>
              <div className="flex items-center justify-between p-2">
                <h1 className="text-lg font-semibold">CodeQuill</h1>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      toggleSidebar();
                      setSearchExpanded(false);
                    }}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="px-2 flex flex-col w-full gap-2">
                <Button
                  variant="default"
                  onClick={handleNewSnippetClick}
                  className=""
                >
                  <Plus className="h-4 w-4" />
                  <span>New Snippet</span>
                </Button>
                <Input
                  className="mb-2"
                  placeholder="Search snippets..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchQuery(e.target.value);
                  }}
                  ref={searchInputRef}
                />
              </div>
              <ScrollArea className="h-[calc(100vh - 200px)]">
                {/* Adjust height calculation as needed */}
                {loading && (
                  <>
                    <Skeleton className="h-8 w-full m-2" />
                    <Skeleton className="h-8 w-full m-2" />
                  </>
                )}
                {error && (
                  <div className="p-4 text-sm text-red-500">{error}</div>
                )}
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
                          }}
                        >
                          {snippet.filename}
                        </Button>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem
                          onClick={() => copySnippet(snippet.id)}
                        >
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
          </div>
        </div>
      )}
    </>
  );
};

export default SnippetSidebar;
