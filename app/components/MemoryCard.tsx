'use client';

import React from 'react';

interface MemoryData {
  heapUsed: number;
  heapMax: number;
  heapCommitted: number;
  nonHeapUsed: number;
}

interface MemoryCardProps {
  memory: MemoryData | null;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function MemoryCard({ memory }: MemoryCardProps) {
  if (!memory) {
    return (
      <div className="card">
        <div className="card-header">
          <span className="card-title">🧠 Memory</span>
        </div>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const heapUsedPercent = memory.heapMax > 0 ? (memory.heapUsed / memory.heapMax * 100) : 0;

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">🧠 Memory</span>
      </div>
      <div className="metric">
        <span className="metric-label">Heap Used</span>
        <span className="metric-value">{formatBytes(memory.heapUsed)}</span>
      </div>
      <div className="metric">
        <span className="metric-label">Heap Max</span>
        <span className="metric-value">{formatBytes(memory.heapMax)}</span>
      </div>
      <div className="metric">
        <span className="metric-label">Heap Committed</span>
        <span className="metric-value">{formatBytes(memory.heapCommitted)}</span>
      </div>
      <div className="metric">
        <span className="metric-label">Non-Heap Used</span>
        <span className="metric-value">{formatBytes(memory.nonHeapUsed)}</span>
      </div>
      <div className="memory-bar">
        <div 
          className="fill heap" 
          style={{ width: `${heapUsedPercent}%` }}
        />
      </div>
      <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        {heapUsedPercent.toFixed(1)}% used
      </div>
    </div>
  );
}
