import { useState, useEffect } from 'react';
import { NetworkTopology } from './components/NetworkTopology';
import { DeviceCard } from './components/DeviceCard';
import { StatsPanel } from './components/StatsPanel';
import { AddDeviceModal } from './components/AddDeviceModal';
import './styles.css';

export interface Device {
  id: string;
  name: string;
  type: 'router' | 'laptop' | 'phone' | 'tablet' | 'smart-tv' | 'iot' | 'server' | 'desktop';
  ip: string;
  mac: string;
  status: 'online' | 'offline' | 'warning';
  bandwidth: { download: number; upload: number };
  lastSeen: Date;
  signalStrength?: number;
}

const initialDevices: Device[] = [
  { id: '1', name: 'Main Router', type: 'router', ip: '192.168.1.1', mac: 'AA:BB:CC:DD:EE:01', status: 'online', bandwidth: { download: 450, upload: 120 }, lastSeen: new Date(), signalStrength: 100 },
  { id: '2', name: 'MacBook Pro', type: 'laptop', ip: '192.168.1.42', mac: 'AA:BB:CC:DD:EE:02', status: 'online', bandwidth: { download: 85, upload: 12 }, lastSeen: new Date(), signalStrength: 92 },
  { id: '3', name: 'iPhone 15', type: 'phone', ip: '192.168.1.55', mac: 'AA:BB:CC:DD:EE:03', status: 'online', bandwidth: { download: 22, upload: 5 }, lastSeen: new Date(), signalStrength: 78 },
  { id: '4', name: 'Living Room TV', type: 'smart-tv', ip: '192.168.1.60', mac: 'AA:BB:CC:DD:EE:04', status: 'online', bandwidth: { download: 45, upload: 2 }, lastSeen: new Date(), signalStrength: 65 },
  { id: '5', name: 'Smart Thermostat', type: 'iot', ip: '192.168.1.71', mac: 'AA:BB:CC:DD:EE:05', status: 'warning', bandwidth: { download: 0.5, upload: 0.1 }, lastSeen: new Date(Date.now() - 300000), signalStrength: 45 },
  { id: '6', name: 'NAS Server', type: 'server', ip: '192.168.1.100', mac: 'AA:BB:CC:DD:EE:06', status: 'online', bandwidth: { download: 200, upload: 150 }, lastSeen: new Date(), signalStrength: 100 },
  { id: '7', name: 'iPad Pro', type: 'tablet', ip: '192.168.1.88', mac: 'AA:BB:CC:DD:EE:07', status: 'offline', bandwidth: { download: 0, upload: 0 }, lastSeen: new Date(Date.now() - 3600000), signalStrength: 0 },
  { id: '8', name: 'Gaming PC', type: 'desktop', ip: '192.168.1.33', mac: 'AA:BB:CC:DD:EE:08', status: 'online', bandwidth: { download: 120, upload: 35 }, lastSeen: new Date(), signalStrength: 95 },
];

function App() {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [view, setView] = useState<'grid' | 'topology'>('grid');
  const [filter, setFilter] = useState<'all' | 'online' | 'offline' | 'warning'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredDevices = devices.filter(d => {
    if (filter === 'all') return true;
    return d.status === filter;
  });

  const stats = {
    totalDevices: devices.length,
    online: devices.filter(d => d.status === 'online').length,
    offline: devices.filter(d => d.status === 'offline').length,
    warning: devices.filter(d => d.status === 'warning').length,
    totalDownload: devices.reduce((acc, d) => acc + d.bandwidth.download, 0),
    totalUpload: devices.reduce((acc, d) => acc + d.bandwidth.upload, 0),
  };

  const handleDeleteDevice = (id: string) => {
    setDevices(devices.filter(d => d.id !== id));
    if (selectedDevice?.id === id) setSelectedDevice(null);
  };

  const handleAddDevice = (device: Omit<Device, 'id' | 'lastSeen' | 'bandwidth'>) => {
    const newDevice: Device = {
      ...device,
      id: Date.now().toString(),
      lastSeen: new Date(),
      bandwidth: { download: 0, upload: 0 },
    };
    setDevices([...devices, newDevice]);
    setShowAddModal(false);
  };

  const handleToggleStatus = (id: string) => {
    setDevices(devices.map(d => {
      if (d.id === id) {
        const newStatus = d.status === 'online' ? 'offline' : 'online';
        return {
          ...d,
          status: newStatus,
          bandwidth: newStatus === 'offline' ? { download: 0, upload: 0 } : d.bandwidth,
          signalStrength: newStatus === 'offline' ? 0 : d.signalStrength
        };
      }
      return d;
    }));
  };

  // Simulate bandwidth fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prev => prev.map(d => {
        if (d.status !== 'online') return d;
        return {
          ...d,
          bandwidth: {
            download: Math.max(0, d.bandwidth.download + (Math.random() - 0.5) * 10),
            upload: Math.max(0, d.bandwidth.upload + (Math.random() - 0.5) * 3),
          }
        };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <div className="noise-overlay" />

      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="3" />
                <circle cx="12" cy="4" r="2" />
                <circle cx="20" cy="12" r="2" />
                <circle cx="12" cy="20" r="2" />
                <circle cx="4" cy="12" r="2" />
                <line x1="12" y1="7" x2="12" y2="9" />
                <line x1="15" y1="12" x2="18" y2="12" />
                <line x1="12" y1="15" x2="12" y2="18" />
                <line x1="6" y1="12" x2="9" y2="12" />
              </svg>
            </div>
            <span className="logo-text">NetPulse</span>
          </div>
          <div className="status-badge">
            <span className="pulse" />
            <span>LIVE</span>
          </div>
        </div>

        <button
          className="mobile-menu-btn md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <nav className={`header-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <button
            className={`nav-btn ${view === 'grid' ? 'active' : ''}`}
            onClick={() => { setView('grid'); setMobileMenuOpen(false); }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
            <span>Grid</span>
          </button>
          <button
            className={`nav-btn ${view === 'topology' ? 'active' : ''}`}
            onClick={() => { setView('topology'); setMobileMenuOpen(false); }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="5" r="3" />
              <circle cx="5" cy="19" r="3" />
              <circle cx="19" cy="19" r="3" />
              <line x1="12" y1="8" x2="5" y2="16" />
              <line x1="12" y1="8" x2="19" y2="16" />
            </svg>
            <span>Topology</span>
          </button>
          <button
            className="nav-btn add-btn"
            onClick={() => { setShowAddModal(true); setMobileMenuOpen(false); }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add Device</span>
          </button>
        </nav>
      </header>

      {/* Stats Panel */}
      <StatsPanel stats={stats} />

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-tabs">
          {(['all', 'online', 'offline', 'warning'] as const).map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''} ${f}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All Devices' : f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="count">
                {f === 'all' ? devices.length : devices.filter(d => d.status === f).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="main-content">
        {view === 'grid' ? (
          <div className="device-grid">
            {filteredDevices.map((device, index) => (
              <DeviceCard
                key={device.id}
                device={device}
                isSelected={selectedDevice?.id === device.id}
                onClick={() => setSelectedDevice(device)}
                onDelete={() => handleDeleteDevice(device.id)}
                onToggleStatus={() => handleToggleStatus(device.id)}
                delay={index * 0.05}
              />
            ))}
            {filteredDevices.length === 0 && (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <circle cx="12" cy="16" r="1" fill="currentColor" />
                </svg>
                <p>No devices match the current filter</p>
              </div>
            )}
          </div>
        ) : (
          <NetworkTopology
            devices={devices}
            selectedDevice={selectedDevice}
            onSelectDevice={setSelectedDevice}
          />
        )}
      </main>

      {/* Add Device Modal */}
      {showAddModal && (
        <AddDeviceModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddDevice}
        />
      )}

      {/* Footer */}
      <footer className="app-footer">
        <span>Requested by @WhaleTonyOVO · Built by @clonkbot</span>
      </footer>
    </div>
  );
}

export default App;
