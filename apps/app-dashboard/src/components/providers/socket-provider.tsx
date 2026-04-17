"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "@/lib/socket";

type SocketContextType = {
  isConnected: boolean;
  socket: any;
};

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  socket: null,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) return;

    function onConnect() {
      setIsConnected(true);
      console.log("🟢 Insurer Socket Connected");
      // Use useUser session token in production; passing a dummy token for now to pass granular auth checks
      socket.emit("join-room", { role: "INSURER", token: "mock-insurer-token-12345" });
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("🔴 Insurer Socket Disconnected");
    }

    function onNewClaim(data: any) {
      import("sonner").then(({ toast }) => {
        toast.info(`📝 NEW CLAIM: ${data.id}`, {
          description: `${data.userName} submitted a ${data.type} claim for ${data.amount}.`,
          duration: 8000,
        });
      });
    }

    function onTriggerAlert(data: any) {
      import("sonner").then(({ toast }) => {
        toast.error(`⚠️ SYSTEM TRIGGER: ${data.message}`, {
          description: `${data.city} | ${data.severity} severity detection.`,
          duration: 10000,
        });
      });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("new-claim", onNewClaim);
    socket.on("trigger-alert", onTriggerAlert);

    // Connection logic
    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("new-claim", onNewClaim);
      socket.off("trigger-alert", onTriggerAlert);
      socket.disconnect();
    };

  }, []);

  return (
    <SocketContext.Provider value={{ isConnected, socket }}>
      {children}
    </SocketContext.Provider>
  );
};
