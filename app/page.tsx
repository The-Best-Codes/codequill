"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import CodeEditor from "@/components/Editor";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useTranslation } from "next-i18next";

const HomePage = () => {
  const { t, i18n } = useTranslation("common");
  const [selectedProject, setSelectedProject] = useState(null);
  const [refreshProjects, setRefreshProjects] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let lang;

      if (typeof localStorage !== "undefined") {
        lang = localStorage.getItem("user_language");
      }

      if (!lang) {
        lang = navigator.language;
      }

      if (!lang) {
        lang = "en";
      }

      i18n.changeLanguage(lang);
    }
  }, [i18n]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (typeof window !== "undefined") {
          if (window.location.hostname.includes("localhost")) {
            const response = await axios.get(`/api/meta/getDeviceIp`);

            if (response.data.address !== "127.0.0.1") {
              const currentPort = window.location.port;
              const newUrl = `http://${response.data.address}:${currentPort}`;
              window.location.href = newUrl;
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

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
            <div className="w-64">
              <Sidebar
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
                refreshProjects={refreshProjectsList}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Show Sidebar directly on larger screens */}
      <div className="hidden sm:block h-full">
        <div className="w-64 h-full">
          <Sidebar
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            refreshProjects={refreshProjectsList}
          />
        </div>
      </div>

      <div className="w-full h-full max-h-screen">
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
