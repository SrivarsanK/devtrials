'use client';

import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { socket } from '@/lib/socket';

export function useSocket() {
  const setReserveHealth = useDashboardStore((s) => s.setReserveHealth);

  useEffect(() => {
    // Only connect if not active
    if (!socket.connected) {
      socket.connect();
    }

    // Listen for real-time health updates from backend
    socket.on('health-update', (data) => {
      console.log('⚡ Real-time health update received:', data);
      setReserveHealth(data);
    });

    // Handle connection status
    socket.on('connect', () => {
      console.log('✅ Connected to RideSuraksha Real-time Engine');
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from Real-time Engine');
    });

    // Initial mock data as fallback until backend emits
    // (Optional: fetch initial state via REST API here)

    return () => {
      socket.off('health-update');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [setReserveHealth]);
}
