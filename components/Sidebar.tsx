import { useState, useEffect } from "react";
import { Plus, Edit, Trash } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";

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

  useEffect(() => {
    axios.get("/api/projects").then((response) => {
      setProjects(response.data);
    });
  }, [refreshProjects]);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      axios.delete(`/api/projects/${id}`).then(() => {
        setSelectedProject(null);
        refreshProjects();
      });
    }
  };

  const handleEdit = (project: Project) => {
    const newName = prompt("Enter new name", project.name);
    if (newName) {
      axios
        .put(`/api/projects/${project.id}`, { ...project, name: newName })
        .then(() => {
          refreshProjects();
        });
    }
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
      <div className="mt-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`p-2 rounded cursor-pointer ${
              selectedProject?.id === project.id ? "bg-gray-700" : ""
            }`}
            onClick={() => setSelectedProject(project)}
          >
            <div className="flex justify-between items-center">
              <span>{project.name}</span>
              <div className="flex space-x-2">
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={() => handleEdit(project)}
                >
                  <Edit />
                </Button>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={() => handleDelete(project.id)}
                >
                  <Trash />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
