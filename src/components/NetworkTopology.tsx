import { useEffect, useState, useRef } from 'react';
import { Device } from '../App';

interface NetworkTopologyProps {
  devices: Device[];
  selectedDevice: Device | null;
  onSelectDevice: (device: Device) => void;
}

interface NodePosition {
  id: string;
  x: number;
  y: number;
}

export function NetworkTopology({ devices, selectedDevice, onSelectDevice }: NetworkTopologyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [nodePositions, setNodePositions] = useState<NodePosition[]>([]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    const router = devices.find(d => d.type === 'router');
    const otherDevices = devices.filter(d => d.type !== 'router');

    const positions: NodePosition[] = [];

    if (router) {
      positions.push({ id: router.id, x: centerX, y: centerY });
    }

    otherDevices.forEach((device, index) => {
      const angle = (2 * Math.PI * index) / otherDevices.length - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      positions.push({ id: device.id, x, y });
    });

    setNodePositions(positions);
  }, [devices, dimensions]);

  const getNodePosition = (id: string): NodePosition | undefined => {
    return nodePositions.find(p => p.id === id);
  };

  const router = devices.find(d => d.type === 'router');
  const routerPos = router ? getNodePosition(router.id) : undefined;

  return (
    <div className="topology-container" ref={containerRef}>
      <svg className="topology-svg" viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        {routerPos && devices.filter(d => d.type !== 'router').map(device => {
          const pos = getNodePosition(device.id);
          if (!pos) return null;
          return (
            <line
              key={`line-${device.id}`}
              className={`topology-link ${device.status === 'online' ? 'active' : ''}`}
              x1={routerPos.x}
              y1={routerPos.y}
              x2={pos.x}
              y2={pos.y}
            />
          );
        })}

        {/* Device nodes */}
        {devices.map(device => {
          const pos = getNodePosition(device.id);
          if (!pos) return null;

          const isRouter = device.type === 'router';
          const nodeRadius = isRouter ? 24 : 16;
          const isSelected = selectedDevice?.id === device.id;

          return (
            <g
              key={device.id}
              className="topology-node"
              transform={`translate(${pos.x}, ${pos.y})`}
              onClick={() => onSelectDevice(device)}
            >
              {/* Pulse ring for selected */}
              {isSelected && (
                <circle
                  r={nodeRadius + 8}
                  fill="none"
                  stroke="var(--cyan)"
                  strokeWidth="2"
                  opacity="0.5"
                >
                  <animate
                    attributeName="r"
                    from={nodeRadius + 4}
                    to={nodeRadius + 16}
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.5"
                    to="0"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Main circle */}
              <circle
                className={`node-circle ${isRouter ? 'router' : device.status}`}
                r={nodeRadius}
                filter="url(#glow)"
              />

              {/* Status indicator */}
              {!isRouter && (
                <circle
                  cx={nodeRadius * 0.7}
                  cy={-nodeRadius * 0.7}
                  r="4"
                  fill={
                    device.status === 'online'
                      ? 'var(--green)'
                      : device.status === 'warning'
                      ? 'var(--amber)'
                      : 'var(--coral)'
                  }
                />
              )}

              {/* Label */}
              <text
                className="node-label"
                y={nodeRadius + 16}
                dy="0.35em"
              >
                {device.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        left: '1rem',
        display: 'flex',
        gap: '1rem',
        padding: '0.75rem 1rem',
        background: 'var(--bg-secondary)',
        borderRadius: '8px',
        border: '1px solid var(--border)',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.65rem',
        color: 'var(--text-secondary)',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cyan)' }} />
          Router
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)' }} />
          Online
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--amber)' }} />
          Warning
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--coral)' }} />
          Offline
        </span>
      </div>
    </div>
  );
}
