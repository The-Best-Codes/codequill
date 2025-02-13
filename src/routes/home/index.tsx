"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import DeleteDialog from "./DeleteDialog";
import Editor from "./Editor";
import Header from "./Header";
import SnippetSidebar from "./SnippetSidebar";
import { useSnippets } from "./useSnippets";

function Home() {
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(!isMobile); // Start with sidebar visible on desktop
  const snippetHelpers = useSnippets();
  const { isDeleteOpen, setDeleteOpen, deleting, deleteCurrentSnippet } =
    snippetHelpers;

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row">
      <SnippetSidebar
        showSidebar={showSidebar}
        toggleSidebar={toggleSidebar}
        {...snippetHelpers}
      />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          toggleSidebar={toggleSidebar}
          showSidebar={showSidebar}
          {...snippetHelpers}
        />
        <Editor {...snippetHelpers} />
      </div>

      <DeleteDialog
        isOpen={isDeleteOpen}
        setOpen={setDeleteOpen}
        isDeleting={deleting}
        onDelete={deleteCurrentSnippet}
      />
    </div>
  );
}

export default Home;
