import { onValue, ref, set } from "firebase/database";
import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { GameContext } from "./context/GameContext";
import { PlayerContext } from './context/PlayerContext';
import { db } from './utils/firebase';

export interface IPlayerContext {
    playerName: string;
    setPlayerName: (name: string) => void;
    playerId: string;
    setPlayerId: (id: string) => void;
}

export const Game = () => {

    const { id } = useParams();
    const myGameRef = ref(db, `games/${id}`);

    const playerContext = React.useContext(PlayerContext);
    const gameContext = React.useContext(GameContext);

    const [gamePlayers, setGamePlayers] = React.useState([]);
    const [choice, setChoice] = React.useState<number>();

    const myConnectionRef = ref(db, `connections/${playerContext.playerId}`);
    set(myConnectionRef, { name: playerContext.playerName, gameId: id });

    const setMyChoice = (option: number) => {
        const myPlayerRef = ref(db, `games/${id}/players/${playerContext.playerId}`);
        set(myPlayerRef, { name: playerContext.playerName, optionIdChosen: option });
        setChoice(option);
    };

    const gameNeedsUpdate = (newGame: any, oldGame: any) => {
        if (!oldGame) return true;
        if (oldGame.hasOwnProperty("showing") && newGame.showing !== oldGame.showing) return true;
        if (newGame.options.length !== oldGame.options.length) return true;
        for (let i = 0; i < newGame.options.length; i++) {
            if (newGame.options[i] !== oldGame.options[i]) return true;
        }
        return false;
    };

    const playersNeedUpdate = (playersArr: any[], gamePlayers: any[]) => {
        if (playersArr.length !== gamePlayers.length) return true;
        for (let i = 0; i < playersArr.length; i++) {
            const [_gamePlayerId, gamePlayerObj] = gamePlayers[i];
            const [_playerId, playerObj] = playersArr[i];
            if (gamePlayerObj.name !== playerObj.name || gamePlayerObj.optionIdChosen !== playerObj.optionIdChosen) return true;
        }
        return false;
    };


    React.useEffect(() => {
        return onValue(myGameRef, (snapshot) => {
            if (snapshot.exists()) {
                const game = snapshot.val();
                let players = game.players;
                if (!players || !Object.keys(players).some((key) => key === playerContext.playerId)) {
                    const newPlayer = { name: playerContext.playerName, optionIdChosen: null };
                    set(ref(db, `games/${id}/players/${playerContext.playerId}`), newPlayer);
                    players = players ? { ...players, [playerContext.playerId]: newPlayer } : { newPlayer };
                    game.players = players;
                }
                gameContext.setMyGame({ [id]: game });
                const playersArr = Object.entries(game.players);
                if (playersNeedUpdate(playersArr, gamePlayers)) setGamePlayers(playersArr);
            }
        });
    }, []);

    React.useEffect(() => {
        return onValue(myGameRef, (snapshot) => {
            if (snapshot.exists()) {
                if (gameNeedsUpdate(snapshot.val(), gameContext?.myGame && gameContext.myGame[id])) gameContext.setMyGame({ [id]: snapshot.val() });
            }
        });
    }, []);

    React.useEffect(() => {
        const myPlayerRef = ref(db, `games/${id}/players/${playerContext.playerId}`);
        return onValue(myPlayerRef, (snapshot) => {
            if (snapshot.exists()) {
                const player = snapshot.val();
                if (player.optionIdChosen ?? -1 === -1) setChoice(undefined);
                else if (player.optionIdChosen !== choice) setChoice(player.optionIdChosen);
            }
        });
    }, []);

    return (
        <>
            <section className="game-ui">
                {id ? <h2>Game ID: {id}</h2> : ""}
                <div>
                    <Link to="/lobby">Back to lobby</Link>
                </div>
                <section className="players">
                    <h3>Players:</h3>
                    <ul className="player-list">
                        {gamePlayers && gamePlayers.map((player, index) => {
                            const [gamePlayerId, gamePlayerObj] = player;
                            return (
                                <li className="player-list-item" key={index}>
                                    {(playerContext.playerId === gamePlayerId ? <strong>{gamePlayerObj?.name}</strong> : gamePlayerObj?.name)}
                                    {(gameContext?.myGame[id]?.showing ? <strong>{gamePlayerObj?.optionIdChosen ?? ""}</strong> : <strong>{gamePlayerObj?.optionIdChosen ? " *" : ""}</strong>)}
                                </li>
                            );
                        }
                        )}
                    </ul>
                </section>
                <section className="action-buttons">
                    <button className="primary" onClick={() => {
                        const game = gameContext?.myGame && gameContext.myGame[id];
                        if (game) {
                            game.showing = !game.showing;
                            gameContext.setMyGame({ [id]: game });
                            set(ref(db, `games/${id}`), game);
                        }
                    }}>{gameContext?.myGame && gameContext.myGame[id]?.showing ? "Hide all" : "Reveal all"}</button>
                    <button className="primary" onClick={() => {
                        const game = gameContext?.myGame && gameContext.myGame[id];
                        if (game) {
                            const players = game.players;
                            if (players) {
                                Object.keys(players).forEach((playerId) => {
                                    const player = players[playerId];
                                    player.optionIdChosen = null;
                                });
                                game.players = players;
                            }
                            game.showing = false;
                            set(ref(db, `games/${id}`), game);
                        }
                    }}>Clear all</button>
                </section>
                <h3>Options:</h3>
            </section>
            <section className="options">
                {gameContext?.myGame && gameContext.myGame[id] && gameContext.myGame[id].options.map((option) => {
                    return (
                        <button
                            className={"card" + (option === choice ? " selected" : "")}
                            key={`optionButton${option}`}
                            onClick={() => setMyChoice(option)}>{option}</button>
                    )
                }
                )}
            </section>
        </>
    );
};