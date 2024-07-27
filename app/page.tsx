"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import CodeEditor from "../components/Editor";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

const HomePage = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [refreshProjects, setRefreshProjects] = useState(false);

  // Check if there is a ?shareId parameter in the URL
  useEffect(() => {
    if (typeof window !== "undefined" && window?.location?.search) {
      const urlParams = new URLSearchParams(window?.location?.search);
      const shareId = urlParams.get("shareId");

      if (shareId) {
        axios
          .get(`/api/projects/${shareId}`)
          .then((response) => {
            if (response.data) {
              setSelectedProject(response.data);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }, []);

  const refreshProjectsList = () => {
    setRefreshProjects(!refreshProjects);
  };

  return (
    <div className="flex h-screen dark:bg-slate-800">
      {/* Show Sheet and Menu button on small screens */}
      <div className="sm:hidden">
        <Sheet>
          <SheetTrigger asChild className="w-12">
            <Button variant="ghost" className="dark:text-white" size={"icon"}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 gap-0 m-0 w-fit">
            <Sidebar
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
              refreshProjects={refreshProjectsList}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Show Sidebar directly on larger screens */}
      <div className="hidden sm:block">
        <Sidebar
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          refreshProjects={refreshProjectsList}
        />
      </div>

      <div className="flex-1">
        <CodeEditor
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          refreshProjects={refreshProjectsList}
        />
      </div>
    </div>
  );
};

export default HomePage;
