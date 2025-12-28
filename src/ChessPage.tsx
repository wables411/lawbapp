import React, { useState, useEffect } from 'react';
import { ChessGame } from './components/ChessGame';
import { ChessMultiplayer } from './components/ChessMultiplayer';
import { ChessChat } from './components/ChessChat';
import { initBaseMiniApp, getSafeAreaInsets, applySafeAreaInsets } from './utils/baseMiniapp';
import './components/ChessMultiplayer.css';
import './components/ChessPage.css';

const ChessPage: React.FC = () => {
  // This is a Base/Farcaster miniapp - always initialize
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

  const [gameMode, setGameMode] = useState<'singleplayer' | 'multiplayer'>('singleplayer');
  const [chatInviteCode, setChatInviteCode] = useState<string | undefined>();
  const [isInGame, setIsInGame] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);

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
        paddingBottom: '50px',
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
        }}
      >
        {gameMode === 'singleplayer' ? (
          <ChessGame 
            onClose={handleClose} 
            onBackToModeSelect={handleBackToModeSelect}
            onGameStart={handleGameStart}
            onChatToggle={handleChatToggle}
            isChatMinimized={!isChatVisible}
            isMobile={true}
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
            isMobile={true}
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
          isMobile={true}
        />
      )}
    </div>
  );
};

export default ChessPage;
