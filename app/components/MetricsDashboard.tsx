'use client';

import React, { useState, useEffect, useRef } from 'react';
import MemoryCard from './MemoryCard';
import ThreadCard from './ThreadCard';
import RuntimeCard from './RuntimeCard';
import GCCard from './GCCard';
import ThemeToggle from './ThemeToggle';

interface MetricsData {
  memory: {
    heapUsed: number;
    heapMax: number;
    heapCommitted: number;
    nonHeapUsed: number;
  } | null;
  threads: {
    count: number;
    peak: number;
    daemon: number;
    totalStarted: number;
  } | null;
  runtime: {
    uptime: number;
    vmName: string;
    vmVendor: string;
    vmVersion: string;
  } | null;
  gc: Record<string, {
    name: string;
    count: number;
    time: number;
  }> | null;
  timestamp: string;
}

// WebSocket server URL - configurable via environment or default to localhost:8080
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws/metrics';

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const connectWebSocket = () => {
    console.log('Connecting to:', WS_URL);

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMetrics(data);
      } catch (e) {
        console.error('Error parsing metrics:', e);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
      // Reconnect after 3 seconds
      setTimeout(() => {
        if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
          connectWebSocket();
        }
      }, 3000);
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  if (!metrics) {
    return (
      <div className="container">
        <header className="header">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
            <h1>🔍 Cognivex Metrics</h1>
            <ThemeToggle />
          </div>
          <div className="loading">
            <div className="spinner"></div>
            <p>Connecting to metrics stream...</p>
            <p style={{ fontSize: '0.85rem', marginTop: '8px', color: 'var(--text-muted)' }}>
              {WS_URL}
            </p>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <h1>🔍 Cognivex Metrics</h1>
          <ThemeToggle />
        </div>
        <div className={`status ${connected ? 'connected' : 'disconnected'}`}>
          <span className={`status-dot ${connected ? 'pulse' : ''}`}></span>
          {connected ? 'Live' : 'Disconnected'}
        </div>
        <div className="timestamp">
          Last update: {metrics.timestamp}
        </div>
      </header>

      <div className="grid">
        <MemoryCard memory={metrics.memory} />
        <ThreadCard threads={metrics.threads} />
        <RuntimeCard runtime={metrics.runtime} />
        <GCCard gc={metrics.gc} />
      </div>
    </div>
  );
}
