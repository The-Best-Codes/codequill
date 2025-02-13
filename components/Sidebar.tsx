/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash,
  Copy,
  Check,
  Info,
  SortAsc,
  SortDesc,
  Search,
  Settings,
  Sun,
  Moon,
  Languages,
  Code2,
  RotateCw,
} from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/bc_ui/combobox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { useTranslation } from "next-i18next";
import ScrollAreaWithShadows from "@/components/bc_ui/scroll-area";
import codeLangOptions from "@/utils/codeLangs";
import { useTheme } from "next-themes";

interface Project {
  id: number;
  name: string;
  code: string;
  language: string;
}

const Sidebar = ({
  selectedProject,
  setSelectedProject,
  refreshProjects,
}: any) => {
  const { t, i18n } = useTranslation("common");
  const { theme, setTheme } = useTheme();
  const [humanLanguage, setHumanLanguage] = useState<any>("en");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [humanLanguageOptions, setHumanLanguageOptions] = useState<any>([]);
  const [formattedHumanLanguageOptions, setFormattedHumanLanguageOptions] =
    useState<any>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [shareSuccess, setShareSuccess] = useState("default");
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [sortType, setSortType] = useState("date_modified");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [defaultCodeLanguage, setDefaultCodeLanguage] = useState("html");

  useEffect(() => {
    setDefaultCodeLanguage(getStoredDefaultCodeLanguage() || "javascript");
  }, []);

  useEffect(() => {
    const langAbbreviations: any = {
      en: "English",
      es: "Español",
      fr: "Français",
      af: "Afrikaans",
      ar: "العربية",
      ca: "Catalán",
      cs: "Česky",
      da: "Dansk",
      de: "Deutsch",
      el: "Ελληνικά",
      fi: "Suomi",
      he: "עברית",
      hu: "Magyar",
      it: "Italiano",
      ja: "日本語",
      ko: "한국어",
      nl: "Nederlands",
      no: "Norsk",
      pl: "Polski",
      pt: "Português",
      ro: "Română",
      ru: "Русский",
      sr: "Српски",
      sv: "Svenska",
      tr: "Türkçe",
      uk: "Українська",
      vi: "Tiếng Việt",
      zh: "中文",
    };

    // Set the language options from i18n
    if (typeof window !== "undefined") {
      const availableLanguages = Object.keys(i18n.options?.resources || {});
      setHumanLanguageOptions(availableLanguages);
      // Set the current language
      const currentLanguage = i18n.language;
      setHumanLanguage(currentLanguage);

      // Set the formatted human languages options
      const formattedHLO = availableLanguages.map((language) => {
        return { value: language, label: langAbbreviations[language] };
      });

      setFormattedHumanLanguageOptions(formattedHLO);
    }
  }, [i18n]);

  useEffect(() => {
    axios.get(`/api/projects?sort=${sortType}`).then((response) => {
      let projectsData = response.data;
      if (sortAsc) {
        projectsData = projectsData.reverse();
      }
      setProjects(projectsData);
      setFilteredProjects(projectsData);
      setIsLoading(false);
    });
  }, [refreshProjects, sortType, sortAsc]);

  const updateDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSearch = () => {
    const filtered = projects.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  const handleDelete = (id: number) => {
    setIsDeleteDialogOpen(true);
    setCurrentProject(projects.find((project) => project.id === id) || null);
  };

  const confirmDelete = () => {
    if (currentProject) {
      axios.delete(`/api/projects/${currentProject.id}`).then(() => {
        setSelectedProject(null);
        refreshProjects();
        setIsDeleteDialogOpen(false);
      });
    }
  };

  const handleFocus = (projectId: any) => {
    const url = new URL(window.location.href);
    url.searchParams.set("shareId", projectId.toString());
    window.location.href = url.toString();
  };

  const handleShare = (project: Project) => {
    const url = `${window.location.origin}/?shareId=${project.id}`;
    try {
      setShareLink(url);
      setIsShareDialogOpen(true);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const openSettings = () => {
    setIsSettingsDialogOpen(true);
  };

  const handleHumanLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("user_language", value);
    }
    setHumanLanguage(value);
  };

  const getStoredDefaultCodeLanguage = () => {
    if (
      typeof window === "undefined" ||
      !localStorage.getItem("defaultLanguage")
    )
      return "javascript";
    return localStorage.getItem("defaultLanguage") || "javascript";
  };

  const setStoredDefaultCodeLanguage = (language: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("defaultLanguage", language);
  };

  const handleDefaultCodeLanguageChange = (value: string) => {
    setStoredDefaultCodeLanguage(value);
    setDefaultCodeLanguage(value);
  };

  const sidebarContent = (
    <div className="w-full bg-gray-200 text-black dark:bg-slate-800 dark:text-white h-full p-4 flex flex-col max-h-screen overflow-auto">
      <Button
        className="w-full dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700 mb-4"
        variant={"secondary"}
        onClick={() => setSelectedProject(null)}
      >
        <Plus className="mr-2" /> {t("new-project")}
      </Button>
      <div className="flex flex-row justify-between space-x-2 mb-4">
        <Select
          onValueChange={(value) => setSortType(value)}
          value={sortType}
          defaultValue="date_modified"
        >
          <SelectTrigger className="text-black dark:text-white dark:border-gray-700 dark:bg-gray-800">
            <SelectValue placeholder={t("sort-by")} />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
            <SelectItem
              className="dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
              value="name"
            >
              {t("name")}
            </SelectItem>
            <SelectItem
              className="dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
              value="date_created"
            >
              {t("date-created")}
            </SelectItem>
            <SelectItem
              className="dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
              value="date_modified"
            >
              {t("date-modified")}
            </SelectItem>
          </SelectContent>
        </Select>

        <Button
          className="text-black dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700"
          variant={"secondary"}
          onClick={() => setSortAsc(!sortAsc)}
        >
          {sortAsc ? <SortAsc /> : <SortDesc />}
        </Button>
      </div>
      <div className="flex flex-row justify-between space-x-2 mb-4">
        <Input
          type="text"
          placeholder={t("search-projects")}
          value={searchTerm}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-black dark:text-white dark:bg-gray-800 dark:border-gray-700"
        />
        <Button
          className="text-black dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700"
          variant={"secondary"}
          onClick={handleSearch}
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>
      <ScrollAreaWithShadows
        className="grow rounded-lg h-full max-w-full"
        shadowSize={100}
      >
        {!isLoading ? (
          <div>
            {filteredProjects.length > 0 &&
              filteredProjects.map((project) => (
                <ContextMenu key={project.id}>
                  <ContextMenuTrigger>
                    <div
                      className={`p-2 rounded cursor-pointer max-w-full ${
                        selectedProject?.id === project.id
                          ? "bg-gray-300 text-black dark:bg-gray-700 dark:text-white"
                          : "hover:bg-gray-100 dark:hover:bg-gray-600"
                      } group my-1`}
                      onClick={() => setSelectedProject(project)}
                    >
                      <div
                        title={project.name}
                        className="flex justify-between max-h-24 max-w-full items-center relative"
                      >
                        <span className="max-w-48 group-hover:max-w-40 truncate">
                          {project.name}
                        </span>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 absolute right-0">
                          <Button
                            variant={"destructive"}
                            size={"icon"}
                            className="z-10 w-6 h-6 shadow-xl"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(project.id);
                            }}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem
                      onClick={() => setSelectedProject(project)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {t("edit")}
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => handleDelete(project.id)}>
                      <Trash className="w-4 h-4 mr-2" />
                      {t("delete")}
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => handleFocus(project.id)}>
                      <Info className="w-4 h-4 mr-2" />
                      {t("focus-project")}
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => handleShare(project)}>
                      <Copy className="w-4 h-4 mr-2" />
                      {t("share")}
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            {[...Array(10)].map((_, index) => (
              <Skeleton key={index} className="w-full h-10" />
            ))}
          </div>
        )}
      </ScrollAreaWithShadows>
      <div className="mt-4 flex justify-center space-x-4">
        <Button variant="ghost" size="icon" onClick={openSettings}>
          <Settings className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={updateDarkMode}>
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {sidebarContent}

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("delete-project")}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {t("delete-project-description")}
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog
        open={isSettingsDialogOpen}
        onOpenChange={setIsSettingsDialogOpen}
      >
        <DialogContent>
          <DialogHeader>{t("settings")}</DialogHeader>
          <DialogDescription>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2">
                <Label className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                  {theme === "dark" ? (
                    <Moon className="w-4 h-4 mr-2" />
                  ) : (
                    <Sun className="w-4 h-4 mr-2" />
                  )}{" "}
                  {t("theme")}
                </Label>
                <div className="flex items-center space-x-2">
                  <Select
                    value={theme}
                    onValueChange={(value) => {
                      setTheme(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("select-theme")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">{t("light-theme")}</SelectItem>
                      <SelectItem value="dark">{t("dark-theme")}</SelectItem>
                      <SelectItem value="system">{t("system")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="h-4" />
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2">
                <Label className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                  <Languages className="w-4 h-4 mr-2" /> {t("language")}
                </Label>
                <Combobox
                  value={humanLanguage}
                  onValueChange={(value) => handleHumanLanguageChange(value)}
                  disabled={isLoading}
                  placeholder="Language"
                  options={formattedHumanLanguageOptions}
                  className="w-fit text-black dark:text-white dark:border-gray-700 dark:bg-gray-800"
                  label="Language"
                />
              </div>
            </div>
            <div className="h-4" />
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2">
                <Label className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                  <Code2 className="w-4 h-4 mr-2" /> Default Editor{" "}
                  {t("language")}
                </Label>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <RotateCw className="w-3 h-3 mr-1" /> Requires reload
                </span>
                <Combobox
                  value={defaultCodeLanguage}
                  onValueChange={(value) =>
                    handleDefaultCodeLanguageChange(value)
                  }
                  disabled={isLoading}
                  placeholder="Language"
                  options={codeLangOptions}
                  className="w-fit text-black dark:text-white dark:border-gray-700 dark:bg-gray-800"
                  label="Language"
                />
              </div>
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => setIsSettingsDialogOpen(false)}>
              {t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("share-project")}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="flex flex-row items-center gap-2">
              <Input
                value={shareLink}
                disabled
                className="text-black disabled:opacity-80"
              ></Input>
              <Button
                variant="default"
                size={"sm"}
                disabled={shareSuccess !== "default"}
                onClick={() => {
                  try {
                    navigator.clipboard.writeText(shareLink);
                    setShareSuccess("true");
                    setTimeout(() => {
                      setShareSuccess("default");
                    }, 1000);
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  } catch (error) {
                    setShareSuccess("false");
                    setTimeout(() => {
                      setShareSuccess("default");
                    }, 1000);
                  }
                }}
              >
                {shareSuccess === "true" ? (
                  <Check className="w-4 h-4" />
                ) : shareSuccess === "false" ? (
                  <Info className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsShareDialogOpen(false)}
            >
              {t("close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Sidebar;
