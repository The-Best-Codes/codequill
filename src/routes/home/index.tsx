"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import DeleteDialog from "./DeleteDialog";
import Editor from "./Editor";
import Header from "./Header";
import SnippetSearchDialog from "./SnippetSearchDialog";
import SnippetSidebar from "./SnippetSidebar";
import { useSnippets } from "./useSnippets";

// Static Imports for Preview Components
import HTMLPreview from "./previews/html";
import MarkdownPreview from "./previews/markdown";

// Preview component map:
const previewComponents: { [key: string]: React.FC<{ code: string }> } = {
  html: HTMLPreview,
  markdown: MarkdownPreview,
};

interface PreviewComponentProps {
  code: string;
}

const PreviewComponent: React.FC<
  PreviewComponentProps & { languageId: string | undefined }
> = ({ code, languageId }) => {
  const Preview =
    previewComponents[languageId as keyof typeof previewComponents] ||
    (() => <div>No Preview Available</div>);

  return <Preview code={code} />;
};

const SIDEBAR_OPEN_KEY = "codequill_sidebar_open";

function Home() {
  const isMobile = useIsMobile();

  // Initialize showSidebar from session storage, defaulting to !isMobile
  const [showSidebar, setShowSidebar] = useState<boolean>(() => {
    if (typeof window === "undefined") return !isMobile;
    try {
      const storedState = sessionStorage.getItem(SIDEBAR_OPEN_KEY);
      return storedState ? JSON.parse(storedState) : !isMobile;
    } catch (error) {
      console.error("Error parsing session storage:", error);
      return !isMobile;
    }
  });

  const snippetHelpers = useSnippets();
  const {
    isDeleteOpen,
    setDeleteOpen,
    deleting,
    deleteCurrentSnippet,
    filteredSnippets,
    loadSnippetInEditor,
    isPreviewing,
    language,
    setDeletingSnippetId,
    createNewSnippet,
  } = snippetHelpers;

  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Update session storage whenever showSidebar changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SIDEBAR_OPEN_KEY, JSON.stringify(showSidebar));
    }
  }, [showSidebar]);

  return (
    <div className="h-screen w-full flex flex-row">
      <SnippetSidebar
        showSidebar={showSidebar}
        toggleSidebar={toggleSidebar}
        {...snippetHelpers}
        setIsSearchDialogOpen={setIsSearchDialogOpen}
        setDeletingSnippetId={setDeletingSnippetId}
      />
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <Header {...snippetHelpers} />
        <Editor
          {...snippetHelpers}
          setIsSearchDialogOpen={setIsSearchDialogOpen}
          isPreviewing={isPreviewing}
          toggleSidebar={toggleSidebar}
          createNewSnippet={createNewSnippet}
        />
        {isPreviewing && (
          <div className="h-1/2 w-full border-t">
            <PreviewComponent
              code={snippetHelpers.code}
              languageId={language?.id}
            />
          </div>
        )}
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
