import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Info, Check, Loader2, Play, Square, Trash2 } from "lucide-react";
import ScrollAreaWithShadows from "@/components/bc_ui/scroll-area";

interface ConsoleProps {
  code: string;
}

interface LogEntry {
  type: "log" | "error" | "warn" | "info" | "system";
  content: string;
  timestamp: string;
  id: number;
}

interface CopyStatus {
  id: number;
  status: "idle" | "copying" | "copied" | "error";
}

const JavaScriptConsole: React.FC<ConsoleProps> = ({ code }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [copyStatuses, setCopyStatuses] = useState<CopyStatus[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement | null | any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current?.scrollToBottom();
    }
  }, [logs]);

  useEffect(() => {
    if (isRunning) {
      stopExecution();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (!isRunning) return;

      const { type, args } = event.data;
      const timestamp = new Date().toLocaleString();
      const id = Number(
        `${new Date().getTime()}${Math.floor(Math.random() * 1000000)}`
      );
      setLogs((prevLogs) => [
        ...prevLogs,
        {
          type: type as LogEntry["type"],
          content: args
            ? args.map((arg: any) => formatArgument(arg)).join(" ")
            : "",
          timestamp,
          id,
        },
      ]);
    },
    [isRunning]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [handleMessage]);

  const runCode = () => {
    setIsRunning(true);
    const timestamp = new Date().toLocaleString();
    const id = Number(
      `${new Date().getTime()}${Math.floor(Math.random() * 1000000)}`
    );
    setLogs((prevLogs) => [
      ...prevLogs,
      {
        type: "system",
        content: `Execution started at ${timestamp}`,
        timestamp,
        id,
      },
    ]);

    const htmlContent = `
      <html>
        <body>
          <script>
            (function() {
              const originalConsole = window.console;
              const consoleProxy = new Proxy(originalConsole, {
                get(target, prop) {
                  if (['log', 'error', 'warn', 'info'].includes(prop)) {
                    return function(...args) {
                      window.parent.postMessage({ type: prop, args }, '*');
                      target[prop].apply(target, args);
                    };
                  }
                  return target[prop];
                }
              });
              window.console = consoleProxy;

              try {
                ${code}
              } catch (error) {
                console.error(error);
              }
            })();
          </script>
        </body>
      </html>
    `;

    if (iframeRef.current) {
      iframeRef.current.srcdoc = htmlContent;
    }
  };

  const stopExecution = () => {
    setIsRunning(false);
    if (iframeRef.current) {
      iframeRef.current.srcdoc = "";
    }
    const timestamp = new Date().toLocaleString();
    const id = Number(
      `${new Date().getTime()}${Math.floor(Math.random() * 1000000)}`
    );
    setLogs((prevLogs) => [
      ...prevLogs,
      {
        type: "system",
        content: `Execution stopped at ${timestamp}`,
        timestamp,
        id,
      },
    ]);
  };

  const formatArgument = (arg: any): string => {
    if (typeof arg === "string") {
      return arg;
    }
    try {
      return JSON.stringify(arg, null, 2);
    } catch (error) {
      return String(arg);
    }
  };

  const clearLogs = () => {
    const id = Number(
      `${new Date().getTime()}${Math.floor(Math.random() * 1000000)}`
    );
    setLogs([
      {
        type: "system",
        content: `Logs cleared at ${new Date().toLocaleString()}`,
        timestamp: new Date().toLocaleString(),
        id,
      },
    ]);
  };

  const updateCopyStatus = (id: number, status: CopyStatus["status"]) => {
    setCopyStatuses((prevCopyStatuses) => {
      const existingStatusIndex = prevCopyStatuses.findIndex(
        (cs) => cs.id === id
      );
      if (existingStatusIndex !== -1) {
        return prevCopyStatuses.map((cs) =>
          cs.id === id ? { ...cs, status } : cs
        );
      } else {
        return [...prevCopyStatuses, { id, status }];
      }
    });
  };

  const getCopyIcon = (id: number) => {
    const copyStatus = copyStatuses.find((copyStatus) => copyStatus.id === id);
    switch (copyStatus?.status) {
      case "copying":
        return <Loader2 className="animate-spin" />;
      case "copied":
        return <Check />;
      case "error":
        return <Info />;
      default:
        return <Copy />;
    }
  };

  const getIsCopyDisabled = (id: number) => {
    const copyStatus = copyStatuses.find((copyStatus) => copyStatus.id === id);
    return copyStatus?.status !== "idle" && copyStatus?.status !== undefined;
  };

  const copyToClipboard = async (log: LogEntry) => {
    updateCopyStatus(log.id, "copying");
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(log.content);
        updateCopyStatus(log.id, "copied");
        setTimeout(() => updateCopyStatus(log.id, "idle"), 1000);
      } else {
        throw new Error("Clipboard API not available");
      }
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      updateCopyStatus(log.id, "error");
      setTimeout(() => updateCopyStatus(log.id, "idle"), 1000);
    }
  };

  return (
    <div className="w-full h-1/2 max-h-[45vh] font-mono flex flex-col">
      <ScrollAreaWithShadows
        ref={scrollAreaRef}
        shadowSize={50}
        className="h-3/4 overflow-auto bg-gray-100 dark:bg-gray-900 p-4"
      >
        <div>
          {logs.map((log, index) =>
            log.type === "system" ? (
              <fieldset
                key={index}
                className="border-t border-gray-300 dark:border-gray-600 my-4"
              >
                <legend className="mx-auto px-2 text-sm text-gray-500 dark:text-gray-400">
                  {log.content}
                </legend>
              </fieldset>
            ) : (
              <div
                key={index}
                className={`mb-2 p-2 flex flex-row w-full items-center justify-between rounded ${getLogTypeClass(
                  log.type
                )}`}
              >
                <span className="text-sm flex-1">{log.content}</span>
                <div className="flex flex-row items-center w-fit space-x-2">
                  <span className="text-xs italic">{log.timestamp}</span>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={() => copyToClipboard(log)}
                    disabled={getIsCopyDisabled(log.id)}
                  >
                    {getCopyIcon(log.id)}
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      </ScrollAreaWithShadows>
      <div className="flex space-x-2 my-4 ml-4">
        <Button
          onClick={isRunning ? stopExecution : runCode}
          className={
            isRunning
              ? ""
              : "text-black dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700 w-fit"
          }
          variant={isRunning ? "destructive" : "secondary"}
        >
          {isRunning ? (
            <>
              <div className="flex flex-row items-center">
                <Square className="mr-2 h-4 w-4" /> Stop
              </div>
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" /> Run
            </>
          )}
        </Button>
        <Button
          onClick={clearLogs}
          className="text-black dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700 w-fit"
          variant="secondary"
        >
          <Trash2 className="mr-2 h-4 w-4" /> Clear Logs
        </Button>
      </div>
      <iframe ref={iframeRef} style={{ display: "none" }} />
    </div>
  );
};

function getLogTypeClass(type: LogEntry["type"]): string {
  switch (type) {
    case "error":
      return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
    case "warn":
      return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
    case "info":
      return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
    default:
      return "bg-white dark:bg-gray-700 text-black dark:text-white";
  }
}

export default JavaScriptConsole;
