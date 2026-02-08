interface StatsPanelProps {
  stats: {
    totalDevices: number;
    online: number;
    offline: number;
    warning: number;
    totalDownload: number;
    totalUpload: number;
  };
}

export function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <div className="stats-panel">
      <div className="stat-card">
        <div className="stat-label">Total Devices</div>
        <div className="stat-value">{stats.totalDevices}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Online</div>
        <div className="stat-value">{stats.online}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Offline</div>
        <div className="stat-value">{stats.offline}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Warning</div>
        <div className="stat-value">{stats.warning}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Download</div>
        <div className="stat-value">
          {stats.totalDownload.toFixed(0)}
          <span className="stat-unit">Mbps</span>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Upload</div>
        <div className="stat-value">
          {stats.totalUpload.toFixed(0)}
          <span className="stat-unit">Mbps</span>
        </div>
      </div>
    </div>
  );
}
