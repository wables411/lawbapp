import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import Popup from './Popup';
import MintPopup from './MintPopup';
import NFTGallery from './NFTGallery';
import MemeGenerator from './MemeGenerator';
import { ChessGame } from './ChessGame';
import Taskbar from './Taskbar';
import MediaGallery from './MediaGallery';
import NFTDetailPopup from './NFTDetailPopup';

interface DesktopIcon {
  id: string;
  image: string;
  label: string;
  action: string;
  url?: string;
  popupId?: string;
  folderId?: string;
  row: number;
  col: number;
}

const ICONS: DesktopIcon[] = [
  // Folders
  { id: 'evm-folder', image: '/assets/evmfolder.png', label: 'EVM NFTs', action: 'folder', folderId: 'evm-folder', row: 0, col: 3 },
  { id: 'sol-folder', image: '/assets/solfolder.png', label: 'SOL NFTs', action: 'folder', folderId: 'sol-folder', row: 1, col: 3 },
  // Row 1
  { id: 'mint', image: '/assets/mint.gif', label: 'Mint', action: 'mint', row: 0, col: 0 },
  { id: 'gallery', image: '/assets/lawbstarz.gif', label: 'LAWB Gallery', action: 'nft-gallery', row: 0, col: 2 },
  { id: 'meme-generator', image: '/assets/meme.gif', label: 'Meme Generator', action: 'meme-generator', row: 0, col: 4 },
  { id: 'chess', image: '/assets/chessicon.png', label: 'Chess', action: 'chess', row: 0, col: 5 },

  
  // Row 2
  { id: 'purity', image: '/assets/purityfinance.png', label: 'Purity', action: 'popup', popupId: 'purity-popup', row: 1, col: 0 },
  { id: 'lawbshop', image: '/assets/lawbshop.png', label: 'Lawb.Shop', action: 'url', url: 'https://store.fun/lawbshop', row: 1, col: 1 },
  // NFT icons for folders (not shown on desktop)
  { id: 'lawbstarz', image: '/assets/lawbstarz.gif', label: 'Lawbstarz', action: 'popup', popupId: 'lawbstarz-popup', row: -1, col: -1 },
  { id: 'lawbsters', image: '/assets/lawbsters.gif', label: 'Lawbsters', action: 'popup', popupId: 'lawbsters-popup', row: -1, col: -1 },
  { id: 'halloween', image: '/assets/lawbsterhalloween.gif', label: 'Halloween', action: 'popup', popupId: 'halloween-popup', row: -1, col: -1 },
  { id: 'pixelawbs', image: '/assets/pixelawb.png', label: 'Pixelawbs', action: 'popup', popupId: 'pixelawbs-popup', row: -1, col: -1 },
  { id: 'asciilawbs', image: '/assets/asciilawb.GIF', label: 'ASCII Lawbsters', action: 'popup', popupId: 'asciilawbs-popup', row: -1, col: -1 },
  { id: 'lawbstation', image: '/assets/lawbstation.GIF', label: 'Lawbstation', action: 'popup', popupId: 'lawbstation-popup', row: -1, col: -1 },
  { id: 'nexus', image: '/assets/nexus.gif', label: 'Nexus', action: 'popup', popupId: 'nexus-popup', row: -1, col: -1 },
  // Row 4
  { id: 'chat', image: '/assets/miladychan.png', label: 'Miladychan', action: 'popup', popupId: 'miladychan-popup', row: 3, col: 0 },
  { id: 'lawb', image: '/assets/lawbticker.gif', label: '$LAWB', action: 'popup', popupId: 'lawb-popup', row: 3, col: 2 },
];

// Icon sizing for Base/Farcaster miniapp
const getIconSize = () => {
  return { width: 60, height: 60 };
};

// Calculate icon spacing for Base/Farcaster miniapp - fit all icons without scroll
const getIconSpacing = (iconCount: number) => {
  const iconSize = getIconSize();
  const availableHeight = typeof window !== 'undefined' ? window.innerHeight - 50 - 60 - 16 : 600; // Viewport minus header, navbar, padding
  const availableWidth = typeof window !== 'undefined' ? window.innerWidth - 24 : 400; // Viewport minus padding
  const iconsPerRow = 2;
  const numRows = Math.ceil(iconCount / iconsPerRow);
  
  // Calculate vertical gap to fit all icons
  const totalIconHeight = numRows * iconSize.height;
  const vGap = numRows > 1 ? Math.max(8, (availableHeight - totalIconHeight) / (numRows - 1)) : 0;
  
  // Calculate horizontal gap
  const totalIconWidth = iconsPerRow * iconSize.width;
  const hGap = Math.max(12, (availableWidth - totalIconWidth) / (iconsPerRow - 1));
  
  return {
    hGap: Math.min(hGap, 24), // Cap at 24px
    vGap: Math.min(vGap, 16), // Cap at 16px to fit all icons
    startLeft: 12,
    startTop: 8
  };
};

const ICON_WIDTH = getIconSize().width;
const ICON_HEIGHT = getIconSize().height;

interface DesktopProps {
  onIconClick: (action: string, popupId?: string, url?: string) => void;
}

const Desktop: React.FC<DesktopProps> = ({ onIconClick }) => {
  // Only show desktop icons (row >= 0, col >= 0)
  const desktopIcons = ICONS.filter(icon => icon.row >= 0 && icon.col >= 0);
  
  // This is a Base/Farcaster miniapp - always use mobile/miniapp layout
  const isMobile = true;
  
  // Detect dark mode
  const isDarkMode = typeof document !== 'undefined' && 
    (document.body.classList.contains('lawb-app-dark-mode') || 
     document.documentElement.classList.contains('lawb-app-dark-mode'));
  
  // Calculate spacing based on viewport to fit all icons
  const spacing = getIconSpacing(desktopIcons.length);
  
  // Recalculate positions for visible desktop icons, top-left oriented
  // Always use 2-column grid for miniapp
  const getPositions = () => {
    const positions: Record<string, { x: number; y: number }> = {};
    
    let index = 0;
    desktopIcons.forEach(icon => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      positions[icon.id] = {
        x: spacing.startLeft + col * (ICON_WIDTH + spacing.hGap),
        y: spacing.startTop + row * (ICON_HEIGHT + spacing.vGap),
      };
      index++;
    });
    return positions;
  };
  const [positions, setPositions] = useState(getPositions());
  const [openFolders, setOpenFolders] = useState<{ [key: string]: boolean }>({});

  const handleDrag = (id: string, data: { x: number; y: number }) => {
    setPositions(prev => ({ ...prev, [id]: { x: data.x, y: data.y } }));
  };

  const handleIconClick = (action: string, popupId?: string, url?: string, folderId?: string) => {
    if (action === 'folder' && folderId) {
      setOpenFolders(prev => ({ ...prev, [folderId]: true }));
      return;
    }
    // For all other actions, call parent handler
    onIconClick(action, popupId, url);
  };

  return (
    <div style={{ 
      position: 'relative',
      width: '100vw',
      height: '100vh',
      background: isDarkMode ? '#000000' : "url('/assets/background.gif') no-repeat center center fixed",
      backgroundSize: 'cover',
      backgroundImage: isDarkMode ? 'none' : "url('/assets/background.gif')",
      overflow: 'hidden',
    }}>
      <div style={{ 
        position: 'relative',
        width: '100%',
        maxWidth: '100vw',
        height: 'calc(100vh - 50px)',
        paddingTop: '8px',
        paddingLeft: '12px',
        paddingRight: '12px',
        paddingBottom: '60px',
        zIndex: 10,
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}>
        {desktopIcons.map(icon => (
          <Icon
            key={icon.id}
            image={icon.image}
            label={icon.label}
            action={icon.action}
            url={icon.url}
            popupId={icon.popupId}
            folderId={icon.folderId}
            position={positions[icon.id]}
            onDrag={(_e, data) => handleDrag(icon.id, data)}
            onClick={handleIconClick}
          />
        ))}
        {openFolders['evm-folder'] && (
          <Popup 
            id="evm-folder" 
            isOpen={true} 
            onClose={() => setOpenFolders(prev => ({ ...prev, ['evm-folder']: false }))} 
            onMinimize={() => setOpenFolders(prev => ({ ...prev, ['evm-folder']: false }))} 
            zIndex={3001}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
              gap: '16px',
              padding: '16px',
              justifyItems: 'center',
              alignItems: 'center',
              minHeight: '100%',
              width: '100%',
              height: '100%',
              overflow: 'auto',
              boxSizing: 'border-box',
            }}>
              {ICONS.filter(icon => ['lawbsters', 'lawbstarz', 'halloween', 'pixelawbs', 'asciilawbs'].includes(icon.id)).map(icon => (
                <Icon
                  key={icon.id}
                  image={icon.image}
                  label={icon.label}
                  action={icon.action}
                  popupId={icon.popupId}
                  folderId={icon.folderId}
                  onClick={handleIconClick}
                  isInFolder={true}
                />
              ))}
            </div>
          </Popup>
        )}
        {openFolders['sol-folder'] && (
          <Popup 
            id="sol-folder" 
            isOpen={true} 
            onClose={() => setOpenFolders(prev => ({ ...prev, ['sol-folder']: false }))} 
            onMinimize={() => setOpenFolders(prev => ({ ...prev, ['sol-folder']: false }))} 
            zIndex={3001}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
              gap: '16px',
              padding: '16px',
              justifyItems: 'center',
              alignItems: 'center',
              minHeight: '100%',
              width: '100%',
              height: '100%',
              overflow: 'auto',
              boxSizing: 'border-box',
            }}>
              {ICONS.filter(icon => ['lawbstation', 'nexus'].includes(icon.id)).map(icon => (
                <Icon
                  key={icon.id}
                  image={icon.image}
                  label={icon.label}
                  action={icon.action}
                  popupId={icon.popupId}
                  folderId={icon.folderId}
                  onClick={handleIconClick}
                  isInFolder={true}
                />
              ))}
            </div>
          </Popup>
        )}
      </div>
    </div>
  );
};

export default Desktop;