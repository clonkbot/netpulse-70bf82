import { Device } from '../App';

interface DeviceCardProps {
  device: Device;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  delay: number;
}

const deviceIcons: Record<Device['type'], JSX.Element> = {
  router: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="8" width="20" height="8" rx="2" />
      <circle cx="6" cy="12" r="1" fill="currentColor" />
      <circle cx="10" cy="12" r="1" fill="currentColor" />
      <line x1="18" y1="10" x2="18" y2="14" />
      <line x1="15" y1="10" x2="15" y2="14" />
      <path d="M8 8V6a4 4 0 018 0v2" />
    </svg>
  ),
  laptop: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M2 20h20" />
      <path d="M7 16v4" />
      <path d="M17 16v4" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <line x1="10" y1="18" x2="14" y2="18" />
    </svg>
  ),
  tablet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <circle cx="12" cy="18" r="1" fill="currentColor" />
    </svg>
  ),
  'smart-tv': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="14" rx="2" />
      <path d="M8 21l4-3 4 3" />
    </svg>
  ),
  iot: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 5v2" />
      <path d="M12 17v2" />
      <path d="M5 12h2" />
      <path d="M17 12h2" />
      <path d="M7.05 7.05l1.41 1.41" />
      <path d="M15.54 15.54l1.41 1.41" />
      <path d="M7.05 16.95l1.41-1.41" />
      <path d="M15.54 8.46l1.41-1.41" />
    </svg>
  ),
  server: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="6" rx="1" />
      <rect x="3" y="15" width="18" height="6" rx="1" />
      <circle cx="7" cy="6" r="1" fill="currentColor" />
      <circle cx="7" cy="18" r="1" fill="currentColor" />
      <line x1="17" y1="6" x2="14" y2="6" />
      <line x1="17" y1="18" x2="14" y2="18" />
    </svg>
  ),
  desktop: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
};

export function DeviceCard({ device, isSelected, onClick, onDelete, onToggleStatus, delay }: DeviceCardProps) {
  return (
    <div
      className={`device-card ${device.status} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="device-header">
        <div className="device-icon-wrapper">
          {deviceIcons[device.type]}
        </div>
        <div className={`device-status ${device.status}`}>
          <span className="dot" />
          <span>{device.status}</span>
        </div>
      </div>

      <div className="device-name">{device.name}</div>
      <div className="device-ip">{device.ip}</div>

      <div className="device-stats">
        <div className="device-stat">
          <span className="device-stat-label">Download</span>
          <span className="device-stat-value download">
            {device.bandwidth.download.toFixed(1)} Mbps
          </span>
        </div>
        <div className="device-stat">
          <span className="device-stat-label">Upload</span>
          <span className="device-stat-value upload">
            {device.bandwidth.upload.toFixed(1)} Mbps
          </span>
        </div>
      </div>

      <div className="device-actions">
        <button
          className="device-action-btn"
          onClick={(e) => { e.stopPropagation(); onToggleStatus(); }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18.36 6.64A9 9 0 1 1 12 3v9" />
          </svg>
          {device.status === 'online' ? 'Disconnect' : 'Connect'}
        </button>
        <button
          className="device-action-btn danger"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
          </svg>
          Remove
        </button>
      </div>
    </div>
  );
}
