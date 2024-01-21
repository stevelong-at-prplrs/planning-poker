import * as React from 'react';
import { GameContext } from './GameContext';

export const GameProvider = ({ children }) => {
  const [myGame, setMyGame] = React.useState();
  return (
    <GameContext.Provider value={{ myGame, setMyGame }}>
      {children}
    </GameContext.Provider>
  );
};