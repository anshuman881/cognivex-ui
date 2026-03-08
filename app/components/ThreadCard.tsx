'use client';

import React from 'react';

interface ThreadData {
  count: number;
  peak: number;
  daemon: number;
  totalStarted: number;
}

interface ThreadCardProps {
  threads: ThreadData | null;
}

export default function ThreadCard({ threads }: ThreadCardProps) {
  if (!threads) {
    return (
      <div className="card">
        <div className="card-header">
          <span className="card-title">🧵 Threads</span>
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
        <span className="card-title">🧵 Threads</span>
      </div>
      <div className="thread-count">{threads.count}</div>
      <div className="thread-label">Active Threads</div>
      <div className="metric" style={{ marginTop: '20px' }}>
        <span className="metric-label">Peak</span>
        <span className="metric-value">{threads.peak}</span>
      </div>
      <div className="metric">
        <span className="metric-label">Daemon</span>
        <span className="metric-value">{threads.daemon}</span>
      </div>
      <div className="metric">
        <span className="metric-label">Total Started</span>
        <span className="metric-value">{threads.totalStarted}</span>
      </div>
    </div>
  );
}
