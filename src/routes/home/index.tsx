"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import DeleteDialog from "./DeleteDialog";
import Editor from "./Editor";
import Header from "./Header";
import SnippetSearchDialog from "./SnippetSearchDialog";
import SnippetSidebar from "./SnippetSidebar";
import { useSnippets } from "./useSnippets";

function Home() {
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState<boolean>(!isMobile);
  const snippetHelpers = useSnippets();
  const {
    isDeleteOpen,
    setDeleteOpen,
    deleting,
    deleteCurrentSnippet,
    filteredSnippets,
    loadSnippetInEditor,
  } = snippetHelpers;

  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        setIsSearchDialogOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="h-screen w-full flex flex-row">
      <SnippetSidebar
        showSidebar={showSidebar}
        toggleSidebar={toggleSidebar}
        {...snippetHelpers}
      />
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <Header {...snippetHelpers} />
        <Editor {...snippetHelpers} />
      </div>

      <DeleteDialog
        isOpen={isDeleteOpen}
        setOpen={setDeleteOpen}
        isDeleting={deleting}
        onDelete={deleteCurrentSnippet}
      />
      <SnippetSearchDialog
        open={isSearchDialogOpen}
        setOpen={setIsSearchDialogOpen}
        filteredSnippets={filteredSnippets}
        loadSnippetInEditor={loadSnippetInEditor}
      />
    </div>
  );
}

export default Home;
