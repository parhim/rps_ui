import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  joinedGameAtom,
  gameAtomFamily,
  GameState,
  nonceSeed,
} from "../../state";
import { Button } from "../Button";
import { Choice, useCommitChoice } from "../../hooks/game/useCommitChoice";
import { useEndGame } from "../../hooks/game/useEndGame";
import { useRevealChoice } from "../../hooks/game/useRevealChoice";
import { useCollectWinnings } from "../../hooks/game/useCollectWinnings";

export const GameActions = () => {
  const joinedGameKey = useRecoilValue(joinedGameAtom);
  const game = useRecoilValue(gameAtomFamily(joinedGameKey));
  const wallet = useAnchorWallet();
  const isHost = game?.host.toString() === wallet?.publicKey.toString();
  const commit = useCommitChoice();
  const end = useEndGame();
  const collect = useCollectWinnings();
  const [seed, setSeed] = useRecoilState(nonceSeed(joinedGameKey));
  const reveal = useRevealChoice();
  console.log({ game });

  // todo usecollect pls

  if (!game) return <></>;

  return (
    <div className="flex flex-col flex-1">
      <p>{isHost ? "youre the host" : "you joined the game"}</p>
      {[GameState.Active, GameState.Waiting].includes(game.gameState) && (
        <div className="flex flex-row justify-between items-center space-x-2">
          <Button onClick={() => commit(Choice.Rock)}>Rock</Button>
          <Button onClick={() => commit(Choice.Paper)}>Paper</Button>
          <Button onClick={() => commit(Choice.Scissors)}>Scissors</Button>
        </div>
      )}
      {game.gameState === GameState.Ready && (
        <Button onClick={async () => reveal()}>Reveal choice</Button>
      )}
      {/* todo here that should also make sure that youre winner or just made a choice */}
      {game.gameState === GameState.Completed && (
        <Button onClick={collect}>Collect</Button>
      )}
      {isHost && game.gameState !== GameState.Completed && (
        <div>
          <p>End game and reclaim rent</p>
          <Button onClick={end}>End game</Button>
        </div>
      )}
      <p>
        seed:{" "}
        <input
          value={seed?.toString()}
          onChange={(e) => {
            setSeed(Number(e.target.value));
          }}
          className=" bg-slate-300 text-text rounded-md p-2 "
          type="number"
        />
      </p>
    </div>
  );
};
