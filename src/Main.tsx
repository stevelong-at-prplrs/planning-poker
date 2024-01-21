import * as React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Game } from './Game';
import { InputName } from './InputName';
import { Lobby } from './Lobby';
import { GameProvider } from './context/GameProvider';
import { PlayerProvider } from './context/PlayerProvider';

const router = createBrowserRouter([
  {
    path: "/",
    element: <InputName />,
  },
  {
    path: "/lobby",
    element: <Lobby />
  },
  {
    path: "/game/:id",
    element: <Game />
  }
]);

const Main = () => {
  return (
    <PlayerProvider>
      <GameProvider>
        <RouterProvider router={router} />
      </GameProvider>
    </PlayerProvider>
  );
}

export default Main;