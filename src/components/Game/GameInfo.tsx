import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  chainDetailsOpenAtom,
  currentSlotAtom,
  gameAtomFamily,
} from "../../state";
import { SimpleCard } from "../common";
import { useLoadGame } from "../../hooks/game/useLoadGame";
import { Button } from "../Button";

export const GameInfo = ({ gameKey }: { gameKey: string }) => {
  const game = useRecoilValue(gameAtomFamily(gameKey));
  const slot = useRecoilValue(currentSlotAtom);
  const load = useLoadGame();
  const setDetailsOpen = useSetRecoilState(chainDetailsOpenAtom);

  if (!game)
    return (
      <Button variant="simple" onClick={() => setDetailsOpen(false)}>
        Close
      </Button>
    );
  return (
    <SimpleCard>
      <div className="flex flex-row justify-between items-center">
        <Button variant="simple" onClick={() => setDetailsOpen(false)}>
          Close
        </Button>
      </div>
      <Button onClick={() => load(gameKey)}>↻</Button>
      {game && (
        <div>
          <p>State: {game.gameState?.toString()}</p>
          <p>Host: {game.host?.toString()}</p>
          {game.commitmentDeadline && (
            <p>
              slot: {slot}/{game.commitmentDeadline.toString()}
            </p>
          )}
          <p>Host choice: {game.hostChoice?.toString()}</p>
          <p>Host commitment: {game.hostCommitment?.toString().slice(0, 13)}</p>
          <p>Challanger: {game.challenger?.toString()}</p>
          <p>Challanger choice: {game.challengerChoice?.toString()}</p>
          <p>
            Challanger commitment:{" "}
            {game.challengerCommitment?.toString().slice(0, 13)}
          </p>
        </div>
      )}
    </SimpleCard>
  );
};
