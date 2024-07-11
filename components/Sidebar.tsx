import { useState, useEffect } from "react";
import { Plus, Edit, Trash, Copy, Check, Info, Loader2 } from "lucide-react";
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [shareSuccess, setShareSuccess] = useState("default");
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    axios.get("/api/projects").then((response) => {
      setProjects(response.data);
      setIsLoading(false);
    });
  }, [refreshProjects]);

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

  const handleEdit = (project: Project) => {
    setCurrentProject(project);
    setNewName(project.name);
    setIsEditDialogOpen(true);
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

  const confirmEdit = () => {
    if (!currentProject) return;
    // Fetch the project code from the server
    axios
      .get(`/api/projects/${currentProject.id}`)
      .then((response) => {
        const project = response.data;
        if (currentProject && newName) {
          axios
            .put(`/api/projects/${currentProject.id}`, {
              ...currentProject,
              name: newName,
              code: project.code,
            })
            .then(() => {
              refreshProjects();
              setIsEditDialogOpen(false);
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching project code:", error);
      });
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-full p-4">
      <Button
        className="w-full"
        variant={"secondary"}
        onClick={() => setSelectedProject(null)}
      >
        <Plus className="mr-2" /> New Project
      </Button>
      {!isLoading ? (
        <div className="mt-4">
          {projects.map((project) => (
            <ContextMenu>
              <ContextMenuTrigger>
                <div
                  key={project.id}
                  className={`p-2 rounded cursor-pointer ${
                    selectedProject?.id === project.id ? "bg-gray-700" : ""
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
                          handleEdit(project);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
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
        <div className="flex justify-center items-center h-full">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <Input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
