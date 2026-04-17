"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

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
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!socket) return;

    function onConnect() {
      setIsConnected(true);
      console.log("🟢 Socket.IO Connected");
      
      // Join general USER room
      socket.emit("join-room", "USER");
      
      // Join personal user room if authenticated
      if (user?.id) {
        socket.emit("join-room", `user-${user.id}`);
      }
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("🔴 Socket.IO Disconnected");
    }

    function onTriggerAlert(data: any) {
      toast.error(`⚠️ EMERGENCY ALERT: ${data.message}`, {
        description: `${data.city} | ${data.severity} severity disruption detected.`,
        duration: 10000,
      });
    }

    function onClaimUpdate(data: any) {
      toast.success(`⚡ CLAIM UPDATE: ${data.status}`, {
        description: `Your claim #${data.id} has been updated to ${data.status}.`,
      });
    }

    function onAnnouncement(data: any) {
      toast.info(`📢 ANNOUNCEMENT: ${data.title}`, {
        description: data.message,
      });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("trigger-alert", onTriggerAlert);
    socket.on("claim-update", onClaimUpdate);
    socket.on("announcement", onAnnouncement);

    // Initial connect
    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("trigger-alert", onTriggerAlert);
      socket.off("claim-update", onClaimUpdate);
      socket.off("announcement", onAnnouncement);
      socket.disconnect();
    };
  }, [user, isLoaded]);

  return (
    <SocketContext.Provider value={{ isConnected, socket }}>
      {children}
    </SocketContext.Provider>
  );
};
