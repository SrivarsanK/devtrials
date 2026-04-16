"use client";

import { io, Socket } from "socket.io-client";

// In development, the backend runs on 3001. In production, use env var.
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3005";

export const socket: Socket = typeof window !== "undefined"
  ? io(SOCKET_URL, {
      autoConnect: false,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })
  : ({} as Socket);
