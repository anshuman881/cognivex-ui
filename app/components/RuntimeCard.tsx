'use client';

import React from 'react';

interface RuntimeData {
  uptime: number;
  vmName: string;
  vmVendor: string;
  vmVersion: string;
}

interface RuntimeCardProps {
  runtime: RuntimeData | null;
}

function formatUptime(millis: number): string {
  const seconds = Math.floor(millis / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

export default function RuntimeCard({ runtime }: RuntimeCardProps) {
  if (!runtime) {
    return (
      <div className="card">
        <div className="card-header">
          <span className="card-title">⚙️ Runtime</span>
        </div>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">⚙️ Runtime</span>
      </div>
      <div className="metric">
        <span className="metric-label">Uptime</span>
        <span className="metric-value uptime">{formatUptime(runtime.uptime)}</span>
      </div>
      <div className="metric">
        <span className="metric-label">VM Name</span>
        <span className="metric-value" style={{ fontSize: '0.85rem' }}>{runtime.vmName}</span>
      </div>
      <div className="metric">
        <span className="metric-label">VM Vendor</span>
        <span className="metric-value" style={{ fontSize: '0.85rem' }}>{runtime.vmVendor}</span>
      </div>
      <div className="metric">
        <span className="metric-label">VM Version</span>
        <span className="metric-value">{runtime.vmVersion}</span>
      </div>
      <div className="metric">
        <span className="metric-label">PID</span>
        <span className="metric-value">-</span>
      </div>
    </div>
  );
}
