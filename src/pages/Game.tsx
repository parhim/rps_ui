import { useParamsWithOverride } from "../contexts/ParamOverrideContext";
import { useEffect } from "react";
import { useLoadGame } from "../hooks/game/useLoadGame";
import { GameScreen } from "../components/Game/GameScreen";

export const Game = () => {
  const { gameKey = "" } = useParamsWithOverride<{ gameKey: string }>();
  const loadGame = useLoadGame();

  useEffect(() => {
    loadGame(gameKey);
  }, [gameKey, loadGame]);
  console.log({ gameKey });

  return (
    <div className="flex-1 flex flex-col justify-center items-center space-y-4">
      <div className="flex flex-col justify-between items-center space-x-3">
        <p>{gameKey.slice(0, 12)}...</p>
        <GameScreen gameKey={gameKey} />
      </div>
    </div>
  );
};
