import { useState, useEffect, use } from "react";
import {
  Plus,
  Edit,
  Trash,
  Copy,
  Check,
  Info,
  Loader2,
  SortAsc,
  SortDesc,
  Search,
  Settings,
  List,
  Sun,
  Moon,
} from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "next-i18next";

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
  const { t } = useTranslation("common");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [shareSuccess, setShareSuccess] = useState("default");
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [sortType, setSortType] = useState("date_modified");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [darkMode, setDarkMode] = useState(true);

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

  useEffect(() => {
    // Set dark mode based on system preference
    if (typeof window === "undefined") return;
    let prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (typeof localStorage !== "undefined") {
      prefersDarkMode = localStorage.getItem("darkMode") === "true";
    }
    setDarkMode(prefersDarkMode);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", darkMode);
    }
  }, [darkMode]);

  const updateDarkMode = () => {
    setDarkMode(!darkMode);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("darkMode", !darkMode ? "true" : "false");
    }
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

  const sidebarContent = (
    <div className="w-full bg-gray-200 text-black dark:bg-slate-800 dark:text-white h-full p-4 flex flex-col">
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
      <div className="flex-grow overflow-auto h-full max-w-full">
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
                          : ""
                      } group`}
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="flex justify-between max-h-24 max-w-full items-center overflow-auto">
                        <span>{project.name}</span>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100">
                          <Button
                            variant={"ghost"}
                            size={"icon"}
                            className="z-10 w-6 h-6"
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
      </div>
      <div className="mt-4 flex justify-center space-x-4">
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={updateDarkMode}>
          {darkMode ? (
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
            <Button onClick={confirmDelete}>{t("delete")}</Button>
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
