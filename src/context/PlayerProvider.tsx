import * as React from 'react';
import { PlayerContext } from './PlayerContext';

export const PlayerProvider = ({ children }) => {
  const [playerName, setPlayerName] = React.useState('');
  const [playerId, setPlayerId] = React.useState('');
  return (
    <PlayerContext.Provider value={{ playerName, setPlayerName, playerId, setPlayerId }}>
      {children}
    </PlayerContext.Provider>
  );
};