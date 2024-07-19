"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import CodeEditor from "../components/Editor";
import axios from "axios";

const HomePage = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [refreshProjects, setRefreshProjects] = useState(false);

  // Check if there is a ?shareId parameter in the URL
  useEffect(() => {
    if (!window) return;
    const urlParams = new URLSearchParams(window.location.search);
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
  }, []);

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
          setSelectedProject={setSelectedProject}
          refreshProjects={refreshProjectsList}
        />
      </div>
    </div>
  );
};

export default HomePage;
