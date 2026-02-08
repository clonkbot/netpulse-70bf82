import { useState } from 'react';
import { Device } from '../App';

interface AddDeviceModalProps {
  onClose: () => void;
  onAdd: (device: Omit<Device, 'id' | 'lastSeen' | 'bandwidth'>) => void;
}

export function AddDeviceModal({ onClose, onAdd }: AddDeviceModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<Device['type']>('laptop');
  const [ip, setIp] = useState('192.168.1.');
  const [mac, setMac] = useState('');
  const [status, setStatus] = useState<Device['status']>('online');
  const [signalStrength, setSignalStrength] = useState(80);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !ip || !mac) return;

    onAdd({
      name,
      type,
      ip,
      mac: mac.toUpperCase(),
      status,
      signalStrength,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add New Device</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Device Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Living Room Speaker"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Device Type</label>
              <select
                className="form-select"
                value={type}
                onChange={e => setType(e.target.value as Device['type'])}
              >
                <option value="laptop">Laptop</option>
                <option value="desktop">Desktop</option>
                <option value="phone">Phone</option>
                <option value="tablet">Tablet</option>
                <option value="smart-tv">Smart TV</option>
                <option value="iot">IoT Device</option>
                <option value="server">Server</option>
                <option value="router">Router</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">IP Address</label>
              <input
                type="text"
                className="form-input"
                placeholder="192.168.1.xxx"
                value={ip}
                onChange={e => setIp(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">MAC Address</label>
              <input
                type="text"
                className="form-input"
                placeholder="AA:BB:CC:DD:EE:FF"
                value={mac}
                onChange={e => setMac(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={status}
                onChange={e => setStatus(e.target.value as Device['status'])}
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="warning">Warning</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Signal Strength ({signalStrength}%)</label>
              <input
                type="range"
                className="form-input"
                min="0"
                max="100"
                value={signalStrength}
                onChange={e => setSignalStrength(Number(e.target.value))}
                style={{ padding: '0.5rem' }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
