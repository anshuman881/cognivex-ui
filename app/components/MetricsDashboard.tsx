'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Icons as SVG components
const DashboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="9" />
    " rx="1<rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

const ServerIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="8" rx="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" />
    <circle cx="6" cy="6" r="1" fill="currentColor" />
    <circle cx="6" cy="18" r="1" fill="currentColor" />
  </svg>
);

const ActivityIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const BellIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const MenuIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const MemoryIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
  </svg>
);

const ThreadIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L12 22M2 12L22 12M7 7l10 10M17 7L7 17" strokeDasharray="3 3" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const GcIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const RuntimeIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

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

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws/metrics';

// Format bytes to human readable
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format uptime
function formatUptime(millis: number): string {
  const seconds = Math.floor(millis / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
  if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

// Get status color based on percentage
function getStatusColor(percent: number): string {
  if (percent < 50) return '#00e676';
  if (percent < 75) return '#ffab00';
  return '#ff5252';
}

// Sidebar navigation items
const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, href: '/' },
  { id: 'services', label: 'Services', icon: ServerIcon, href: '#' },
  { id: 'metrics', label: 'Metrics', icon: ActivityIcon, href: '#' },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, href: '#' },
];

// Mini Metric Card Component
function MiniMetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color = '#00d9ff' 
}: { 
  title: string; 
  value: string; 
  subtitle?: string; 
  icon: React.ComponentType<{ className?: string }>; 
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}) {
  return (
    <div className="metric-tile">
      <div className="metric-tile-header">
        <div className="metric-tile-icon" style={{ backgroundColor: `${color}20`, color }}>
          <Icon className="metric-tile-icon-svg" />
        </div>
        <div className="metric-tile-trend" data-trend={trend}>
          {trend === 'up' && <span>↑</span>}
          {trend === 'down' && <span>↓</span>}
        </div>
      </div>
      <div className="metric-tile-value" style={{ color }}>{value}</div>
      <div className="metric-tile-title">{title}</div>
      {subtitle && <div className="metric-tile-subtitle">{subtitle}</div>}
    </div>
  );
}

// Circular Gauge Component
function CircularGauge({ 
  value, 
  max, 
  label, 
  color,
  size = 120
}: { 
  value: number; 
  max: number; 
  label: string; 
  color: string;
  size?: number;
}) {
  const percent = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  const center = size / 2;

  return (
    <div className="gauge-container" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="gauge-svg">
        <circle
          cx={center}
          cy={center}
          r="45"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
        />
        <circle
          cx={center}
          cy={center}
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="gauge-value">
        <span className="gauge-number" style={{ color }}>{percent.toFixed(1)}%</span>
        <span className="gauge-label">{label}</span>
      </div>
    </div>
  );
}

// Memory Details Component
function MemoryDetails({ memory }: { memory: MetricsData['memory'] }) {
  if (!memory) return null;
  
  const heapPercent = memory.heapMax > 0 ? (memory.heapUsed / memory.heapMax * 100) : 0;
  
  return (
    <div className="detail-card">
      <div className="detail-card-header">
        <h3>Memory</h3>
        <span className="status-badge" data-status={heapPercent > 80 ? 'critical' : heapPercent > 60 ? 'warning' : 'healthy'}>
          {heapPercent > 80 ? 'Critical' : heapPercent > 60 ? 'Warning' : 'Healthy'}
        </span>
      </div>
      <div className="detail-metrics">
        <div className="detail-metric">
          <span className="detail-label">Heap Used</span>
          <span className="detail-value">{formatBytes(memory.heapUsed)}</span>
        </div>
        <div className="detail-metric">
          <span className="detail-label">Heap Max</span>
          <span className="detail-value">{formatBytes(memory.heapMax)}</span>
        </div>
        <div className="detail-metric">
          <span className="detail-label">Heap Committed</span>
          <span className="detail-value">{formatBytes(memory.heapCommitted)}</span>
        </div>
        <div className="detail-metric">
          <span className="detail-label">Non-Heap</span>
          <span className="detail-value">{formatBytes(memory.nonHeapUsed)}</span>
        </div>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ 
            width: `${heapPercent}%`,
            backgroundColor: getStatusColor(heapPercent)
          }} 
        />
      </div>
    </div>
  );
}

// Thread Details Component
function ThreadDetails({ threads }: { threads: MetricsData['threads'] }) {
  if (!threads) return null;
  
  return (
    <div className="detail-card">
      <div className="detail-card-header">
        <h3>Threads</h3>
        <span className="status-badge" data-status="healthy">Active</span>
      </div>
      <div className="detail-metrics">
        <div className="detail-metric">
          <span className="detail-label">Active</span>
          <span className="detail-value">{threads.count}</span>
        </div>
        <div className="detail-metric">
          <span className="detail-label">Peak</span>
          <span className="detail-value">{threads.peak}</span>
        </div>
        <div className="detail-metric">
          <span className="detail-label">Daemon</span>
          <span className="detail-value">{threads.daemon}</span>
        </div>
        <div className="detail-metric">
          <span className="detail-label">Total Started</span>
          <span className="detail-value">{threads.totalStarted}</span>
        </div>
      </div>
    </div>
  );
}

// Runtime Details Component
function RuntimeDetails({ runtime }: { runtime: MetricsData['runtime'] }) {
  if (!runtime) return null;
  
  return (
    <div className="detail-card">
      <div className="detail-card-header">
        <h3>Runtime</h3>
        <span className="status-badge" data-status="healthy">Running</span>
      </div>
      <div className="detail-metrics">
        <div className="detail-metric">
          <span className="detail-label">Uptime</span>
          <span className="detail-value highlight">{formatUptime(runtime.uptime)}</span>
        </div>
        <div className="detail-metric">
          <span className="detail-label">VM Name</span>
          <span className="detail-value">{runtime.vmName}</span>
        </div>
        <div className="detail-metric">
          <span className="detail-label">Vendor</span>
          <span className="detail-value">{runtime.vmVendor}</span>
        </div>
        <div className="detail-metric">
          <span className="detail-label">Version</span>
          <span className="detail-value">{runtime.vmVersion}</span>
        </div>
      </div>
    </div>
  );
}

// GC Details Component
function GcDetails({ gc }: { gc: MetricsData['gc'] }) {
  if (!gc) return null;
  
  const gcArray = Object.values(gc);
  const totalCollections = gcArray.reduce((sum, g) => sum + g.count, 0);
  const totalTime = gcArray.reduce((sum, g) => sum + g.time, 0);
  
  return (
    <div className="detail-card">
      <div className="detail-card-header">
        <h3>Garbage Collection</h3>
        <span className="status-badge" data-status="healthy">Active</span>
      </div>
      <div className="detail-metrics">
        <div className="detail-metric">
          <span className="detail-label">Total Collections</span>
          <span className="detail-value">{totalCollections}</span>
        </div>
        <div className="detail-metric">
          <span className="detail-label">Total Time</span>
          <span className="detail-value">{formatUptime(totalTime)}</span>
        </div>
      </div>
      <div className="gc-list">
        {gcArray.map((gcInfo, idx) => (
          <div key={idx} className="gc-item">
            <span className="gc-name">{gcInfo.name.replace('G1 ', '')}</span>
            <span className="gc-stats">{gcInfo.count} runs / {formatUptime(gcInfo.time)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [connected, setConnected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const wsRef = useRef<WebSocket | null>(null);
  const pathname = usePathname();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const connectWebSocket = useCallback(() => {
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
      setTimeout(() => {
        if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
          connectWebSocket();
        }
      }, 3000);
    };
  }, []);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  // Calculate derived values
  const heapPercent = metrics?.memory ? (metrics.memory.heapUsed / metrics.memory.heapMax * 100) : 0;
  const memoryColor = getStatusColor(heapPercent);

  if (!metrics) {
    return (
      <div className="dashboard-loading">
        <div className="loading-content">
          <div className="loading-logo">
            <div className="logo-pulse"></div>
            <span>Cognivex</span>
          </div>
          <div className="loading-spinner"></div>
          <p>Connecting to metrics stream...</p>
          <p className="loading-url">{WS_URL}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">C</div>
            {sidebarOpen && <span className="logo-text">Cognivex</span>}
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <MenuIcon />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
            >
              <item.icon className="nav-icon" />
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          {sidebarOpen && (
            <div className="connection-status">
              <span className={`status-indicator ${connected ? 'connected' : 'disconnected'}`}></span>
              <span>{connected ? 'Connected' : 'Disconnected'}</span>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            <h1>Application Overview</h1>
            <span className="header-subtitle">Real-time JVM metrics monitoring</span>
          </div>
          
          <div className="header-center">
            <div className="search-box">
              <SearchIcon className="search-icon" />
              <input type="text" placeholder="Search metrics, services..." />
            </div>
          </div>

          <div className="header-right">
            <button className="header-btn">
              <BellIcon />
              <span className="notification-dot"></span>
            </button>
            <div className="user-avatar">
              <span>A</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Status Bar */}
          <div className="status-bar">
            <div className="status-item">
              <span className={`live-indicator ${connected ? 'active' : ''}`}>
                <span className="live-dot"></span>
                {connected ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>
            <div className="status-item">
              <span className="status-label">Last updated:</span>
              <span className="status-value">{currentTime.toLocaleTimeString()}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Timestamp:</span>
              <span className="status-value mono">{metrics.timestamp}</span>
            </div>
          </div>

          {/* Mini Metric Tiles */}
          <div className="metrics-grid">
            <MiniMetricCard
              title="Heap Memory"
              value={formatBytes(metrics.memory?.heapUsed || 0)}
              subtitle={`of ${formatBytes(metrics.memory?.heapMax || 0)}`}
              icon={MemoryIcon}
              trend={heapPercent > 70 ? 'up' : 'neutral'}
              color={memoryColor}
            />
            <MiniMetricCard
              title="Active Threads"
              value={String(metrics.threads?.count || 0)}
              subtitle={`Peak: ${metrics.threads?.peak || 0}`}
              icon={ThreadIcon}
              color="#7c4dff"
            />
            <MiniMetricCard
              title="Uptime"
              value={formatUptime(metrics.runtime?.uptime || 0)}
              subtitle={metrics.runtime?.vmName}
              icon={RuntimeIcon}
              color="#ff9100"
            />
            <MiniMetricCard
              title="GC Collections"
              value={Object.values(metrics.gc || {}).reduce((sum, g) => sum + g.count, 0).toString()}
              subtitle="Total runs"
              icon={GcIcon}
              color="#00e676"
            />
          </div>

          {/* Gauges Section */}
          <div className="gauges-section">
            <div className="section-header">
              <h2>Resource Utilization</h2>
            </div>
            <div className="gauges-grid">
              <CircularGauge
                value={metrics.memory?.heapUsed || 0}
                max={metrics.memory?.heapMax || 1}
                label="Heap"
                color={memoryColor}
                size={140}
              />
              <CircularGauge
                value={metrics.threads?.count || 0}
                max={metrics.threads?.peak || 1}
                label="Threads"
                color="#7c4dff"
                size={140}
              />
              <CircularGauge
                value={metrics.memory?.nonHeapUsed || 0}
                max={(metrics.memory?.heapMax || 1) * 0.2}
                label="Non-Heap"
                color="#ff9100"
                size={140}
              />
            </div>
          </div>

          {/* Detailed Cards */}
          <div className="details-section">
            <div className="section-header">
              <h2>Detailed Metrics</h2>
            </div>
            <div className="details-grid">
              <MemoryDetails memory={metrics.memory} />
              <ThreadDetails threads={metrics.threads} />
              <RuntimeDetails runtime={metrics.runtime} />
              <GcDetails gc={metrics.gc} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
