import { useState, useEffect } from "react";
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

  return (
    <div className="w-64 bg-gray-200 text-black dark:bg-gray-800 dark:text-white h-full p-4 max-h-full overflow-auto">
      <Button
        className="w-full"
        variant={"secondary"}
        onClick={() => setSelectedProject(null)}
      >
        <Plus className="mr-2" /> New Project
      </Button>
      <div className="mt-4 flex flex-row justify-between space-x-2">
        <Select
          onValueChange={(value) => setSortType(value)}
          value={sortType}
          defaultValue="date_modified"
        >
          <SelectTrigger className="text-black">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="date_created">Date Created</SelectItem>
            <SelectItem value="date_modified">Date Modified</SelectItem>
          </SelectContent>
        </Select>

        <Button variant={"secondary"} onClick={() => setSortAsc(!sortAsc)}>
          {sortAsc ? <SortAsc /> : <SortDesc />}
        </Button>
      </div>
      <div className="mt-4 flex flex-row justify-between space-x-2">
        <Input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-black"
        />
        <Button variant={"secondary"} onClick={handleSearch}>
          <Search className="w-4 h-4" />
        </Button>
      </div>
      {!isLoading ? (
        <div className="mt-4">
          {filteredProjects.length > 0 &&
            filteredProjects.map((project) => (
              <ContextMenu key={project.id}>
                <ContextMenuTrigger>
                  <div
                    className={`p-2 rounded cursor-pointer ${
                      selectedProject?.id === project.id
                        ? "bg-gray-300 text-black dark:bg-gray-700 text-white"
                        : ""
                    } group`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="flex justify-between max-h-24 overflow-auto">
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
                  <ContextMenuItem onClick={() => setSelectedProject(project)}>
                    Edit
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleDelete(project.id)}>
                    Delete
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleFocus(project.id)}>
                    Focus Project
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleShare(project)}>
                    Share
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
        </div>
      ) : (
        <div className="flex flex-col space-y-2 mt-4">
          {[...Array(10)].map((_, index) => (
            <Skeleton key={index} className="w-full h-10" />
          ))}
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this project?
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Project</DialogTitle>
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
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sidebar;
