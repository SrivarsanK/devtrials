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
      console.log("🟢 Admin Socket Connected");
      // Use useUser session token in production; passing a dummy token for now to pass granular auth checks
      socket.emit("join-room", { role: "ADMIN", token: "mock-admin-token-supersecure" });
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("🔴 Admin Socket Disconnected");
    }

    function onNewClaim(data: any) {
      import("sonner").then(({ toast }) => {
        toast.info(`📝 CLAIM INBOUND: ${data.id}`, {
          description: `User ${data.userName} submitted a claim.`,
        });
      });
    }

    function onClaimUpdate(data: any) {
      import("sonner").then(({ toast }) => {
        toast.success(`⚡ CLAIM SYNC: ${data.id}`, {
          description: `Status changed to ${data.status}.`,
        });
      });
    }

    function onTriggerAlert(data: any) {
      import("sonner").then(({ toast }) => {
        toast.error(`⚠️ SYSTEM ALERT: ${data.message}`, {
          description: `Detection in ${data.city}.`,
        });
      });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("new-claim", onNewClaim);
    socket.on("claim-update", onClaimUpdate);
    socket.on("trigger-alert", onTriggerAlert);

    // Connection logic
    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("new-claim", onNewClaim);
      socket.off("claim-update", onClaimUpdate);
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
