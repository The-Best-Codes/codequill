"use client";

import previewLanguages from "@/assets/previewLanguages.json";
import { useIsMobile } from "@/hooks/use-mobile";
import { Loader2 } from "lucide-react";
import { lazy, Suspense, useState } from "react";
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
    isPreviewing,
    language,
  } = snippetHelpers;

  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const PreviewComponent = () => {
    if (!language) return null;
    const previewLanguage = previewLanguages.find((l) => l.id === language.id);

    if (!previewLanguage) return null;

    const filePath = `./previews/${previewLanguage.id}.tsx`;

    // Dynamically import the module
    const ComponentModule = lazy(() => import(filePath));

    // Render the component
    return (
      <Suspense
        fallback={
          <div className="w-full h-full flex flex-col justify-center items-center">
            <Loader2 className="w-16 h-16 text-black animate-spin" />
          </div>
        }
      >
        <ComponentModule code={snippetHelpers.code} />
      </Suspense>
    );
  };

  return (
    <div className="h-screen w-full flex flex-row">
      <SnippetSidebar
        showSidebar={showSidebar}
        toggleSidebar={toggleSidebar}
        {...snippetHelpers}
        setIsSearchDialogOpen={setIsSearchDialogOpen}
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
            <PreviewComponent />
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
