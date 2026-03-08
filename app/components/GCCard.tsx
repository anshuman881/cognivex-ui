'use client';

import React from 'react';

interface GCInfo {
  name: string;
  count: number;
  time: number;
}

interface GCCardProps {
  gc: Record<string, GCInfo> | null;
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

function simplifyGCName(name: string): string {
  return name
    .replace('G1 ', '')
    .replace('Young ', 'Y ')
    .replace('Old ', 'O ')
    .replace('Full ', 'F ');
}

export default function GCCard({ gc }: GCCardProps) {
  if (!gc) {
    return (
      <div className="card">
        <div className="card-header">
          <span className="card-title">♻️ Garbage Collection</span>
        </div>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const gcArray = Object.values(gc);

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">♻️ Garbage Collection</span>
      </div>
      {gcArray.map((gcInfo, index) => (
        <div key={index} className="metric">
          <span className="metric-label" title={gcInfo.name}>
            {simplifyGCName(gcInfo.name)}
          </span>
          <span className="metric-value">
            {gcInfo.count} / {formatUptime(gcInfo.time)}
          </span>
        </div>
      ))}
    </div>
  );
}
