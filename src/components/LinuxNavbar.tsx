import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useEnsName } from 'wagmi';
import { isBaseMiniApp } from '../utils/baseMiniapp';
import { ThemeToggle } from './ThemeToggle';

interface LinuxNavbarProps {
  minimizedWindows: string[];
  onRestoreWindow: (popupId: string) => void;
  onOpenPublicChat?: () => void;
  onOpenProfile?: () => void;
}

const LinuxNavbar: React.FC<LinuxNavbarProps> = ({ 
  minimizedWindows, 
  onRestoreWindow, 
  onOpenPublicChat, 
  onOpenProfile 
}) => {
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors } = useConnect();
  const { data: ensName } = useEnsName({ address });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
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

  // Auto-connect wallet when in Base/Farcaster miniapp
  useEffect(() => {
    const autoConnect = async () => {
      if (isBaseMiniApp() && !isConnected && connectors.length > 0) {
        // In Base/Farcaster miniapp, wallet should auto-connect
        // Try to connect with the Farcaster connector
        const farcasterConnector = connectors.find(c => c.id === 'farcasterMiniApp' || c.name.toLowerCase().includes('farcaster'));
        if (farcasterConnector) {
          try {
            await connect({ connector: farcasterConnector });
            console.log('[LinuxNavbar] Auto-connected wallet via Farcaster');
          } catch (error) {
            console.warn('[LinuxNavbar] Auto-connect failed:', error);
          }
        } else if (connectors.length > 0) {
          // Fallback to first available connector
          try {
            await connect({ connector: connectors[0] });
            console.log('[LinuxNavbar] Auto-connected wallet via first available connector');
          } catch (error) {
            console.warn('[LinuxNavbar] Auto-connect failed:', error);
          }
        }
      }
    };

    // Small delay to ensure connectors are ready
    const timer = setTimeout(autoConnect, 100);
    return () => clearTimeout(timer);
  }, [isConnected, connectors, connect]);

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Linux navbar styles - dark terminal theme by default, adapts to light mode
  const navbarStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '50px',
    minHeight: '50px',
    background: isDarkMode ? '#1e1e1e' : '#2d2d2d',
    borderTop: isDarkMode ? '1px solid #3a3a3a' : '1px solid #4a4a4a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 200,
    padding: '0 8px',
    boxSizing: 'border-box',
    fontFamily: 'monospace, "Courier New", Courier, monospace',
    fontSize: '12px',
    boxShadow: isDarkMode ? '0 -2px 8px rgba(0, 0, 0, 0.5)' : '0 -2px 8px rgba(0, 0, 0, 0.3)',
  };

  const leftSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    minWidth: 0,
  };

  const rightSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  };

  const menuButtonStyle: React.CSSProperties = {
    padding: '8px 12px',
    minWidth: '44px',
    minHeight: '44px',
    background: isDarkMode ? '#2d2d2d' : '#3a3a3a',
    border: isDarkMode ? '1px solid #4a4a4a' : '1px solid #5a5a5a',
    color: isDarkMode ? '#00ff00' : '#00cc00',
    cursor: 'pointer',
    fontSize: '12px',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    boxSizing: 'border-box',
    borderRadius: '2px',
    textTransform: 'uppercase',
  };

  const walletIndicatorStyle: React.CSSProperties = {
    padding: '6px 10px',
    minHeight: '32px',
    background: isDarkMode ? '#1a1a1a' : '#2a2a2a',
    border: isDarkMode ? '1px solid #3a3a3a' : '1px solid #4a4a4a',
    borderRadius: '2px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'monospace',
    fontSize: '11px',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const statusDotStyle: React.CSSProperties = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
    boxShadow: isDarkMode ? '0 0 4px currentColor' : '0 0 2px currentColor',
  };

  const clockStyle: React.CSSProperties = {
    padding: '6px 10px',
    minHeight: '32px',
    background: isDarkMode ? '#1a1a1a' : '#2a2a2a',
    border: isDarkMode ? '1px solid #3a3a3a' : '1px solid #4a4a4a',
    borderRadius: '2px',
    color: isDarkMode ? '#00ff00' : '#00cc00',
    fontFamily: 'monospace',
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  };

  const menuStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '55px',
    left: '8px',
    background: isDarkMode ? '#1e1e1e' : '#2d2d2d',
    border: isDarkMode ? '1px solid #3a3a3a' : '1px solid #4a4a4a',
    padding: '4px',
    display: isMenuOpen ? 'block' : 'none',
    zIndex: 100000,
    maxHeight: 'calc(100vh - 120px)',
    maxWidth: 'calc(100vw - 20px)',
    overflowY: 'auto',
    minWidth: '200px',
    boxShadow: isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.7)' : '0 4px 12px rgba(0, 0, 0, 0.5)',
    borderRadius: '2px',
  };

  const menuLinkStyle: React.CSSProperties = {
    padding: '12px 16px',
    minHeight: '44px',
    color: isDarkMode ? '#00ff00' : '#00cc00',
    textDecoration: 'none',
    background: 'transparent',
    border: 'none',
    borderBottom: isDarkMode ? '1px solid #3a3a3a' : '1px solid #4a4a4a',
    cursor: 'pointer',
    fontSize: '12px',
    fontFamily: 'monospace',
    width: '100%',
    textAlign: 'left',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <div style={navbarStyle}>
      <div style={leftSectionStyle}>
        {/* Menu Button */}
        <button 
          style={menuButtonStyle}
          onClick={handleMenuClick}
          type="button"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDarkMode ? '#3a3a3a' : '#4a4a4a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isDarkMode ? '#2d2d2d' : '#3a3a3a';
          }}
        >
          Menu
        </button>

        {/* Minimized Windows */}
        {minimizedWindows.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', overflowX: 'auto', flex: 1, minWidth: 0 }}>
            {minimizedWindows.map((id) => (
              <button
                key={id}
                style={{
                  ...menuButtonStyle,
                  padding: '6px 10px',
                  minWidth: 'auto',
                  fontSize: '10px',
                }}
                onClick={() => onRestoreWindow(id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDarkMode ? '#3a3a3a' : '#4a4a4a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDarkMode ? '#2d2d2d' : '#3a3a3a';
                }}
              >
                {id.replace('-popup', '').replace('-', ' ').toUpperCase().slice(0, 8)}
              </button>
            ))}
          </div>
        )}

        {/* Wallet Connection Indicator */}
        <div style={walletIndicatorStyle}>
          <div
            style={{
              ...statusDotStyle,
              background: isConnected ? (isDarkMode ? '#00ff00' : '#00cc00') : '#ff0000',
              color: isConnected ? (isDarkMode ? '#00ff00' : '#00cc00') : '#ff0000',
            }}
          />
          <span
            style={{
              color: isConnected 
                ? (isDarkMode ? '#00ff00' : '#00cc00') 
                : '#ff0000',
              fontWeight: 'bold',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {isConnected 
              ? (ensName || formatAddress(address) || 'Connected')
              : 'Disconnected'
            }
          </span>
        </div>
      </div>

      <div style={rightSectionStyle}>
        {/* Clock */}
        <div style={clockStyle}>
          {formatTime(currentTime)}
        </div>
      </div>

      {/* Menu Dropdown */}
      {isMenuOpen && (
        <div style={menuStyle} onClick={(e) => e.stopPropagation()}>
          {onOpenProfile && (
            <button
              type="button"
              style={menuLinkStyle}
              onClick={() => {
                handleMenuLinkClick();
                onOpenProfile();
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDarkMode ? '#2d2d2d' : '#3a3a3a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Profile
            </button>
          )}
          <button
            type="button"
            style={menuLinkStyle}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsMenuOpen(false);
              setTimeout(() => {
                if (onOpenPublicChat) {
                  onOpenPublicChat();
                }
              }, 50);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDarkMode ? '#2d2d2d' : '#3a3a3a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Public Chat
          </button>
          <div style={{ 
            height: '1px', 
            background: isDarkMode ? '#3a3a3a' : '#4a4a4a', 
            margin: '4px 0',
          }} />
          <a 
            href="https://www.geckoterminal.com/solana/pools/DTxVuYphEobWo66afEfP9MfGt2E14C6UfeXnvXWnvep?embed=1&info=1&swaps=0&grayscale=0&light_chart=0&chart_type=market_cap&resolution=15m" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={menuLinkStyle}
            onClick={handleMenuLinkClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDarkMode ? '#2d2d2d' : '#3a3a3a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            GeckoTerminal
          </a>
          <a 
            href="https://x.com/lawbstation" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={menuLinkStyle}
            onClick={handleMenuLinkClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDarkMode ? '#2d2d2d' : '#3a3a3a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            LawbStation Twitter
          </a>
          <a 
            href="https://x.com/lawbnexus" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={menuLinkStyle}
            onClick={handleMenuLinkClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDarkMode ? '#2d2d2d' : '#3a3a3a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            LawbNexus Twitter
          </a>
          <a 
            href="https://v2.nftx.io/vault/0xdb98a1ae711d8bf186a8da0e81642d81e0f86a05/info/" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={menuLinkStyle}
            onClick={handleMenuLinkClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDarkMode ? '#2d2d2d' : '#3a3a3a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            NFTX - Lawbsters
          </a>
          <a 
            href="https://uwu.pro/memoji/ulawb" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={menuLinkStyle}
            onClick={handleMenuLinkClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDarkMode ? '#2d2d2d' : '#3a3a3a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            UwU LAWB
          </a>
          <a 
            href="https://t.me/lawblawblawb" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={menuLinkStyle}
            onClick={handleMenuLinkClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDarkMode ? '#2d2d2d' : '#3a3a3a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Telegram
          </a>
          <a 
            href="https://discord.gg/JdkzUHYmMy" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={menuLinkStyle}
            onClick={handleMenuLinkClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDarkMode ? '#2d2d2d' : '#3a3a3a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Discord
          </a>
          <a 
            href="https://store.fun/lawbshop" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={menuLinkStyle}
            onClick={handleMenuLinkClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDarkMode ? '#2d2d2d' : '#3a3a3a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Lawb.Shop
          </a>
          <div style={{ 
            height: '1px', 
            background: isDarkMode ? '#3a3a3a' : '#4a4a4a', 
            margin: '4px 0',
          }} />
          <div onClick={(e) => e.stopPropagation()}>
            <ThemeToggle asMenuItem={true} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LinuxNavbar;

