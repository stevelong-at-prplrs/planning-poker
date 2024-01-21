import { onDisconnect, onValue, push, ref, set } from 'firebase/database';
import * as React from "react";
import { Link } from "react-router-dom";
import { GameContext } from './context/GameContext';
import { PlayerContext } from './context/PlayerContext';
import { db } from './utils/firebase';

const connectionsRef = ref(db, "connections");
const myConnection = push(connectionsRef);
const myConnectionRef = ref(db, `connections/${myConnection.key}`);
const connectedRef = ref(db, ".info/connected");
const gamesRef = ref(db, "games");

const deleteGame = (gameId: string) => {
    const gameRef = ref(db, `games/${gameId}`);
    set(gameRef, null);
};

export const Lobby = () => {

    const [connections, setConnections] = React.useState([]);
    const [games, setGames] = React.useState([]);
    const gameContext = React.useContext(GameContext);
    const playerContext = React.useContext(PlayerContext);
    const playerName = playerContext.playerName;

    React.useEffect(() => {
        if (playerContext?.playerName) {
            onValue(connectedRef, (snapshot) => {
                if (snapshot.val() === true) {
                    set(myConnection, {name: playerContext.playerName});
                    playerContext.setPlayerId(myConnection.key);
            
                    onDisconnect(myConnectionRef).remove();
                }
            });
        }
    }, [playerContext]);

    React.useEffect(() => {
        return onValue(connectionsRef, (snapshot) => {
          if (connections.length === 0 && snapshot.exists()) {
              const dataEntries = Object.entries(snapshot.val());
              setConnections(dataEntries);
          }
        });
      }, []);

    React.useEffect(() => {
        return onValue(gamesRef, (snapshot) => {
          if (games.length === 0 && snapshot.exists()) {
              const dataEntries = Object.entries(snapshot.val());
              setGames(dataEntries);
          }
        });
      }, []);

    return playerName ? (
        <>
            <section className="lobby">
                <h1>Lobby</h1>
                <div>Hello {playerName}</div>
            </section>
            <section className="server-info">
                <section className="connectedplayers">
                    <h4>Players Connected</h4>
                    {connections.length === 0 ? <div>No players connected</div> :
                        <>
                            <div>{connections.length} player{connections.length > 1 && "s"} connected</div>
                            <ul>
                                {connections.map((connection, index) => {
                                    const [connectionKey, playerObj] = connection;
                                    return (
                                        playerName === playerObj.name && connectionKey === myConnection.key ? <li key={index}><strong>{playerObj.name}: {connectionKey} (This is you)</strong></li> : <li key={index}>{playerObj.name}: {connectionKey}</li>
                                );})}
                            </ul>
                        </>
                    }
                </section>
                <section className="games">
                    <h4>Current Games</h4>
                    {games.length === 0 ? <div>No current games</div> :
                        <>
                            <div>{games.length} game{games.length > 1 && "s"}</div>
                            <ul>
                                {games.map((game, index) => (
                                    <li key={index}><Link to={`/game/${game[0]}`}>Join Game</Link>Options: {game[1].options.join(", ")} Owner: {game[1].owner === playerName ? <><strong>{game[1].owner}</strong><button onClick={() => deleteGame(game[0])}>delete</button></> : game[1].owner} Players: {game[1].players ? Object.keys(game[1].players).length : 0}</li>
                                ))}
                            </ul>
                        </>
                    }
                </section>
            </section>
            <section className="lobby">
                <button className="primary" onClick={() => {
                    const newGame = push(gamesRef);
                    const newGameRef = ref(db, `games/${newGame.key}`);
                    const game = {
                        owner: playerName,
                        options: ["0", "1", "2", "3", "5", "8", "13"],
                        // options: ["0", "0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100", "?", "∞", "☕"]
                        players: [],
                        showing: false
                    };
                    set(newGameRef, game);
                    gameContext.setMyGame({[newGame.key]: game});
                }}>Start new game</button>
            </section>
        </>
    ) :
    (
        <>
            <div>Please enter your name</div>
            <div>
                <Link to="/">Go to app</Link>
            </div>
        </>
    );
};