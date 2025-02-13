import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar, // Import useSidebar
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { UseSnippetsReturn } from "@/routes/home/types";
import { Copy, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useRef } from "react";

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
  const { open, setOpen, isMobile } = useSidebar(); // Use useSidebar hook
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus the search input when the sidebar is opened and the search button is clicked.
  useEffect(() => {
    if (showSidebar && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSidebar]);

  const handleNewSnippetClick = () => {
    if (isMobile) {
      setOpen(false);
    }
    createNewSnippet();
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between p-2">
          <h1 className="text-lg font-semibold">CodeQuill</h1>
          <div className="flex gap-2">
            {/* Only show the trigger button when not in "icon" collapsible mode or when on mobile */}
            <SidebarTrigger onClick={toggleSidebar} />
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
          <SidebarInput
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchQuery(e.target.value);
            }}
            ref={searchInputRef}
            data-sidebar="input"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          <SidebarMenu>
            {loading && (
              <>
                <SidebarMenuItem>
                  <Skeleton className="h-8 w-full" />
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Skeleton className="h-8 w-full" />
                </SidebarMenuItem>
              </>
            )}
            {error && <div className="p-4 text-sm text-red-500">{error}</div>}
            {!loading &&
              !error &&
              filteredSnippets.map((snippet) => (
                <SidebarMenuItem key={snippet.id}>
                  <ContextMenu>
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
                          if (isMobile) {
                            setOpen(false);
                          }
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
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <p className="text-xs text-muted-foreground p-2">
          {snippets.length} Snippets
        </p>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SnippetSidebar;
