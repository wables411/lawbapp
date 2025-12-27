import React, { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';

interface ChessHeaderProps {
  onClose?: () => void;
  onMenuClick?: () => void;
  isMobile?: boolean;
  title?: string;
}

const ChessHeader: React.FC<ChessHeaderProps> = ({ 
  onClose, 
  onMenuClick, 
  isMobile = false,
  title = 'LAWB CHESS MAINNET BETA 3000'
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const dark = document.body.classList.contains('lawb-app-dark-mode') || 
                   document.documentElement.classList.contains('lawb-app-dark-mode');
      setIsDarkMode(dark);
    };
    
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const headerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '50px',
    minHeight: '50px',
    background: isDarkMode ? '#1e1e1e' : '#2d2d2d',
    borderBottom: isDarkMode ? '1px solid #3a3a3a' : '1px solid #4a4a4a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10001,
    padding: '0 8px',
    boxSizing: 'border-box',
    fontFamily: 'monospace, "Courier New", Courier, monospace',
    fontSize: '12px',
    boxShadow: isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.3)',
  };

  const titleStyle: React.CSSProperties = {
    color: isDarkMode ? '#00ff00' : '#00cc00',
    fontSize: isMobile ? '11px' : '12px',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    margin: 0,
    padding: 0,
    flex: 1,
    textAlign: 'left',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 12px',
    minWidth: '44px',
    minHeight: '44px',
    background: isDarkMode ? '#2d2d2d' : '#3a3a3a',
    border: isDarkMode ? '1px solid #4a4a4a' : '1px solid #5a5a5a',
    color: isDarkMode ? '#00ff00' : '#00cc00',
    cursor: 'pointer',
    fontSize: isMobile ? '14px' : '16px',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    boxSizing: 'border-box',
    borderRadius: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={headerStyle}>
      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <h2 style={titleStyle}>{title}</h2>
      </div>
      <div style={controlsStyle}>
        {onMenuClick && (
          <button
            style={buttonStyle}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onMenuClick();
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDarkMode ? '#3a3a3a' : '#4a4a4a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isDarkMode ? '#2d2d2d' : '#3a3a3a';
            }}
            title="Menu"
            type="button"
            aria-label="Menu"
          >
            ☰
          </button>
        )}
        {onClose && (
          <button
            style={buttonStyle}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDarkMode ? '#3a3a3a' : '#4a4a4a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isDarkMode ? '#2d2d2d' : '#3a3a3a';
            }}
            title="Close"
            type="button"
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ChessHeader;

