import { useRecoilValue } from "recoil";
import { gameAtomFamily } from "../../state";
import { SimpleCard } from "../common";
import { useLoadGame } from "../../hooks/game/useLoadGame";
import { Button } from "../Button";

export const GameInfo = ({ gameKey }: { gameKey: string }) => {
  const game = useRecoilValue(gameAtomFamily(gameKey));

  const load = useLoadGame();
  if (!game) return <SimpleCard>not loaded</SimpleCard>;
  return (
    <SimpleCard>
      <Button onClick={() => load(gameKey)}>↻</Button>
      {game && (
        <div>
          <p>State: {game.gameState?.toString()}</p>
          <p>Host: {game.host?.toString()}</p>
          <p>Host choice: {game.hostChoice?.toString()}</p>
          <p>Host commitment: {game.hostCommitment?.toString()}</p>
          <p>Challanger: {game.challenger?.toString()}</p>
          <p>Challanger choice: {game.challengerChoice?.toString()}</p>
          <p>Challanger commitment: {game.challengerCommitment?.toString()}</p>
        </div>
      )}
    </SimpleCard>
  );
};
