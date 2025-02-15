"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
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
    isPreviewing,
    language,
    setDeletingSnippetId,
  } = snippetHelpers;

  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

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
        />
        {isPreviewing && (
          <div className="h-1/2 w-full">
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
