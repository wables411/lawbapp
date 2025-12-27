import React, { useState, useEffect } from 'react';
import { ChessGame } from './components/ChessGame';
import { ChessMultiplayer } from './components/ChessMultiplayer';
import { ChessChat } from './components/ChessChat';
import { initBaseMiniApp, isBaseMiniApp, getSafeAreaInsets, applySafeAreaInsets } from './utils/baseMiniapp';
import './components/ChessMultiplayer.css';
import './components/ChessPage.css';

const ChessPage: React.FC = () => {
  // Initialize Base Mini App SDK
  useEffect(() => {
    const initialize = async () => {
      await initBaseMiniApp();
      
      // Always add body class for Base Mini App styles
      document.body.classList.add('base-miniapp');
      document.documentElement.classList.add('base-miniapp');
      
      // Apply safe area insets
      await applySafeAreaInsets();
    };
    
    void initialize();
    
    return () => {
      // Cleanup: remove class when component unmounts
      if (typeof document !== 'undefined') {
        document.body.classList.remove('base-miniapp');
        document.documentElement.classList.remove('base-miniapp');
      }
    };
  }, []);

  // Always mobile in Base miniapp, or if window is small
  const isMobile = typeof window !== 'undefined' && (isBaseMiniApp() || window.innerWidth <= 768);

  const [gameMode, setGameMode] = useState<'singleplayer' | 'multiplayer'>('singleplayer');
  const [chatInviteCode, setChatInviteCode] = useState<string | undefined>();
  const [isInGame, setIsInGame] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);

  useEffect(() => {
    setIsChatVisible(false);
  }, [isMobile]);

  const handleClose = () => {
    window.location.href = '/';
  };

  const handleModeSelect = (mode: 'singleplayer' | 'multiplayer') => {
    setGameMode(mode);
  };

  const handleBackToModeSelect = () => {
    setIsInGame(false);
    setChatInviteCode(undefined);
  };

  const handleGameStart = (inviteCode?: string) => {
    setIsInGame(true);
    setChatInviteCode(inviteCode);
  };

  const handleChatToggle = () => {
    setIsChatVisible(!isChatVisible);
  };

  const handleChatMinimize = () => {
    setIsChatVisible(false);
  };

  return (
    <div 
      className="chess-page mobile baseapp"
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        boxSizing: 'border-box',
        maxWidth: '100vw',
        maxHeight: '100vh',
        // Account for navbar at bottom (50px)
        paddingBottom: isMobile ? '50px' : '0',
      }}
    >
      <div 
        className="chess-content"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          boxSizing: 'border-box',
          maxWidth: '100%',
          maxHeight: '100%',
          // Ensure content doesn't overlap navbar
          paddingBottom: isMobile ? '0' : '0',
        }}
      >
        {gameMode === 'singleplayer' ? (
          <ChessGame 
            onClose={handleClose} 
            onBackToModeSelect={handleBackToModeSelect}
            onGameStart={handleGameStart}
            onChatToggle={handleChatToggle}
            isChatMinimized={!isChatVisible}
            isMobile={isMobile}
          />
        ) : (
          <ChessMultiplayer 
            onClose={handleClose} 
            onMinimize={() => {}} 
            fullscreen={false} 
            onBackToModeSelect={handleBackToModeSelect}
            onGameStart={handleGameStart}
            onChatToggle={handleChatToggle}
            isChatMinimized={!isChatVisible}
            isMobile={isMobile}
          />
        )}
      </div>
      
      {isChatVisible && (
        <ChessChat
          isOpen={isChatVisible}
          onMinimize={handleChatMinimize}
          currentInviteCode={chatInviteCode}
          isDraggable={false}
          isResizable={false}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};

export default ChessPage;
