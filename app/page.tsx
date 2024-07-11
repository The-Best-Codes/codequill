"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import CodeEditor from "../components/Editor";

const HomePage = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [refreshProjects, setRefreshProjects] = useState(false);

  const refreshProjectsList = () => {
    setRefreshProjects(!refreshProjects);
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        refreshProjects={refreshProjectsList}
      />
      <div className="flex-1">
        <CodeEditor
          selectedProject={selectedProject}
          refreshProjects={refreshProjectsList}
        />
      </div>
    </div>
  );
};

export default HomePage;
