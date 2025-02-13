"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import {
  deleteSnippet,
  getAllSnippets,
  getSnippet,
  saveSnippet,
  Snippet,
} from "@/utils/database";
import { Copy, List, Plus, Save, Search, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import MonacoEditor, { EditorDidMount } from "react-monaco-editor";
import { v4 as uuidv4 } from "uuid";

import supportedLanguages from "@/assets/supportedLanguages.json";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

interface Language {
  id: string;
  name: string;
  shortName: string;
  files: string[];
}

function Home() {
  const [filename, setFilename] = useState<string>("Untitled");
  const [language, setLanguage] = useState<Language | null>(
    supportedLanguages[0] as Language,
  );
  const [code, setCode] = useState<string>("");
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSnippetId, setSelectedSnippetId] = useState<string | null>(
    null,
  );
  const editorRef = useRef<any>(null);
  const { toast } = useToast();
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [value, setValue] = React.useState(language?.id || "");
  const [showSidebar, setShowSidebar] = useState(true);

  const filteredSnippets = snippets.filter(
    (snippet) =>
      snippet.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.language.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const LanguageCombobox = () => {
    const [open, setOpen] = React.useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-60 justify-between"
          >
            {value
              ? supportedLanguages.find((l) => l.id === value)?.name
              : "Select language..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-0">
          <Command>
            <CommandInput placeholder="Search language..." className="h-9" />
            <CommandList>
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup>
                {supportedLanguages.map((l) => (
                  <CommandItem
                    key={l.id}
                    value={l.id}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                      setLanguage(l as Language);
                    }}
                  >
                    {l.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === l.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  useEffect(() => {
    loadSnippets();
  }, []);

  const loadSnippets = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedSnippets = getAllSnippets();
      setSnippets(loadedSnippets);

      if (loadedSnippets.length > 0) {
        loadSnippetInEditor(loadedSnippets[0].id);
      }
    } catch (e: any) {
      setError(e.message || "Failed to load snippets.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditorDidMount: EditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value) {
      setCode(value);
    }
  };

  const createNewSnippet = () => {
    setFilename("Untitled");
    setLanguage(supportedLanguages[0] as Language);
    setCode("");
    setSelectedSnippetId(null);
    setShowSidebar(true);
  };

  const loadSnippetInEditor = (id: string) => {
    const snippet = getSnippet(id);
    if (snippet) {
      setFilename(snippet.filename);
      setLanguage(
        supportedLanguages.find((l) => l.id === snippet.language) as Language,
      );
      setCode(snippet.code);
      setSelectedSnippetId(snippet.id);
    }
  };

  const saveCurrentSnippet = async () => {
    try {
      setSaving(true);
      if (!language) {
        toast({
          title: "Error",
          description: "Please select a language",
        });
        return;
      }

      const snippetToSave: Snippet = {
        id: selectedSnippetId || uuidv4(),
        filename,
        language: language.id,
        code,
      };

      saveSnippet(snippetToSave);
      await loadSnippets();
      setSelectedSnippetId(snippetToSave.id);
      toast({
        title: "Success",
        description: "Snippet saved",
      });
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message || "Failed to save snippet.",
      });
    } finally {
      setSaving(false);
    }
  };

  const copySnippet = async (snippetId: string) => {
    const snippet = getSnippet(snippetId);
    if (snippet) {
      try {
        await navigator.clipboard.writeText(snippet.code);
        toast({
          title: "Success",
          description: "Snippet copied to clipboard",
        });
      } catch (e: any) {
        toast({
          title: "Error",
          description: e.message || "Failed to copy snippet.",
        });
      }
    }
  };

  const deleteCurrentSnippet = async () => {
    try {
      setDeleting(true);
      if (selectedSnippetId) {
        deleteSnippet(selectedSnippetId);
        setDeleteOpen(false);
        await loadSnippets();
        if (snippets.length === 1) {
          createNewSnippet();
        } else {
          if (snippets.length > 1) {
            loadSnippetInEditor(snippets[0].id);
          } else {
            createNewSnippet();
          }
        }
        toast({
          title: "Success",
          description: "Snippet deleted",
        });
      }
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message || "Failed to delete snippet.",
      });
    } finally {
      setDeleting(false);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleSearchFocus = () => {
    setShowSidebar(true);
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row">
      {showSidebar ? (
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-between p-2">
              <h1 className="text-lg font-semibold">CodeQuill</h1>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={createNewSnippet}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <SidebarTrigger onClick={toggleSidebar} />
              </div>
            </div>
            <div className="px-2">
              <SidebarInput
                placeholder="Search snippets..."
                value={searchQuery}
                onChange={(e) => {
                  setSearching(true);
                  setSearchQuery(e.target.value);
                  setTimeout(() => setSearching(false), 300);
                }}
                onFocus={handleSearchFocus}
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
                {error && (
                  <div className="p-4 text-sm text-red-500">{error}</div>
                )}
                {!loading &&
                  !error &&
                  (searching ? (
                    <div className="p-4">
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : (
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
                              onClick={() => loadSnippetInEditor(snippet.id)}
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
                      </SidebarMenuItem>
                    ))
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
      ) : (
        <div className="border-r p-2 flex flex-col gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={createNewSnippet}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowSidebar(true);
              setTimeout(() => {
                const searchInput = document.querySelector(
                  '[data-sidebar="input"]',
                ) as HTMLInputElement;
                if (searchInput) searchInput.focus();
              }, 100);
            }}
            className="h-8 w-8 p-0"
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSidebar(true)}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex gap-4 p-4 items-center border-b">
          <Input
            type="text"
            placeholder="Filename"
            className="flex-grow max-w-md"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
          />

          <LanguageCombobox />

          <Button onClick={saveCurrentSnippet} disabled={saving}>
            <Save className={cn("h-4 w-4", saving && "animate-spin")} />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>

        <div className="flex-1 relative">
          <MonacoEditor
            width="100%"
            height="100%"
            language={language?.id || "plaintext"}
            theme="vs-dark"
            value={code}
            onChange={handleCodeChange}
            editorDidMount={handleEditorDidMount}
            options={{
              selectOnLineNumbers: true,
              automaticLayout: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              fontFamily: "JetBrains Mono, monospace",
            }}
          />
        </div>
      </div>

      <AlertDialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              snippet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteCurrentSnippet}
              className="bg-red-500 hover:bg-red-600"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Home;
