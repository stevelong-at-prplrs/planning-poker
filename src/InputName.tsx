import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlayerContext } from "./context/PlayerContext";

export const InputName = () => {
    const navigate = useNavigate();

    const playerContext = React.useContext(PlayerContext);

    const focusRef = React.useRef(null);

    React.useEffect(() => {
        if (focusRef.current) focusRef.current.focus();
    }, []);

    React.useEffect(() => {
        if (playerContext.playerName) {
            focusRef.current.focus();
            setTimeout(() => {
                navigate("/lobby");
            }, 5000);
        }
    }, [playerContext.playerName]);

    return (
        <div className="input-name">
            {
                playerContext.playerName ?
                    <div className="navigate-acknowledge">
                        <h1>Hello {playerContext.playerName}</h1>
                        <div style={{ "margin": "1rem" }}>Would you like to play a game?</div>
                        <div>
                            <div className="lobby-button-background" />
                            <Link className="lobby-button" ref={focusRef} to="/lobby" onKeyDown={() => navigate("/lobby")} onBlur={() => navigate("/lobby")}>Entering Lobby</Link>
                        </div>
                    </div>
                    :
                    <div className="input-prompt">
                        <h2>What is your name?</h2>
                        <input ref={focusRef} type="text" onBlur={(e) => playerContext.setPlayerName(e.currentTarget.value)} onKeyDown={(e) => { if (e.key === "Enter") playerContext.setPlayerName(e.currentTarget.value) }} />
                        <button className="primary" onClick={(e) => playerContext.setPlayerName(e.currentTarget.value)}>Submit</button>
                    </div>
            }
        </div>
    );
};