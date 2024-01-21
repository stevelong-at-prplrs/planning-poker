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
                <div className="input-prompt">
                    {
                        playerContext.playerName ?
                            <>
                                <h1>Hello {playerContext.playerName}</h1>
                                <div>Would you like to play a game?</div>
                                <Link ref={focusRef} className="link" to="/lobby" onKeyDown={() => navigate("/lobby")} onBlur={() => navigate("/lobby")}>Entering Lobby</Link>
                            </>
                            :
                            <>
                                <h2>What is your name?</h2>
                                <input ref={focusRef} type="text" onBlur={(e) => playerContext.setPlayerName(e.currentTarget.value)} onKeyDown={(e) => { if (e.key === "Enter") playerContext.setPlayerName(e.currentTarget.value)}}/>
                                <button className="primary" onClick={(e) => playerContext.setPlayerName(e.currentTarget.value)}>Submit</button>
                            </>
                    }
                </div>
            </div>
    );
};