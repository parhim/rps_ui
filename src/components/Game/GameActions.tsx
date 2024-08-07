import { useRecoilValue } from "recoil";
import {
  joinedGameAtom,
  gameAtomFamily,
  GameState,
  currentSlotAtom,
  choiceAtomFamily,
} from "../../state";
import { Button } from "../Button";
import { Choice, useCommitChoice } from "../../hooks/game/useCommitChoice";
import { useEndGame } from "../../hooks/game/useEndGame";
import { useRevealChoice } from "../../hooks/game/useRevealChoice";
import { useCollectWinnings } from "../../hooks/game/useCollectWinnings";
import { useEffect, useState } from "react";
import { canCollect } from "../../utils/game";
import { useGameWallet } from "../../hooks/game/wallet/useGameWallet";
import { PublicKey } from "@solana/web3.js";
import { useUpdateChoice } from "../../state/game/transactions";
import { GameResult } from "./GameResult";

export const GameActions = () => {
  const joinedGameKey = useRecoilValue(joinedGameAtom);
  const game = useRecoilValue(gameAtomFamily(joinedGameKey));
  const slot = useRecoilValue(currentSlotAtom);
  const [isRevealing, setIsRevealing] = useState(false);
  const { gameWallet: wallet } = useGameWallet();
  const isHost = game?.host.toString() === wallet?.publicKey.toString();
  const commit = useCommitChoice();
  const currentChoice = useRecoilValue(choiceAtomFamily(joinedGameKey));
  const end = useEndGame();
  const collect = useCollectWinnings();
  const reveal = useRevealChoice();
  const updateChoiceUi = useUpdateChoice();
  useEffect(() => {
    if (
      (!game?.hostCommitment && isHost) ||
      (!game?.challengerCommitment && !isHost)
    ) {
      updateChoiceUi(joinedGameKey, null);
    }
  }, [game, isHost, joinedGameKey, updateChoiceUi]);

  useEffect(() => {
    (async () => {
      if (game && game.gameState === GameState.Ready && !isRevealing) {
        setIsRevealing(true);
        await reveal();
        setIsRevealing(false);
      }
    })();
  }, [game, isRevealing, reveal]);

  if (!game) return <></>;

  return (
    <div className="flex flex-col flex-1">
      <p>{isHost ? "youre the host" : "you joined the game"}</p>
      {isHost && !!game.challenger && <p>Oponent has joined the game</p>}
      {((isHost && !!game.challengerCommitment) ||
        (!isHost && !!game.hostCommitment)) && <p>Oponent made their choice</p>}
      <GameResult />
      {[GameState.Active, GameState.Waiting].includes(game.gameState) && (
        <div className="flex flex-row justify-between items-center space-x-2">
          <Button
            variant={currentChoice === Choice.Rock ? "filled" : "outline"}
            onClick={() => commit(Choice.Rock)}
          >
            <p className=" text-4xl">🪨</p>
          </Button>
          <Button
            variant={currentChoice === Choice.Paper ? "filled" : "outline"}
            onClick={() => commit(Choice.Paper)}
          >
            <p className=" text-4xl">📄</p>
          </Button>
          <Button
            variant={currentChoice === Choice.Scissors ? "filled" : "outline"}
            onClick={() => commit(Choice.Scissors)}
          >
            <p className=" text-4xl">✂️</p>
          </Button>
        </div>
      )}
      {game.gameState === GameState.Ready && (
        <Button onClick={async () => reveal()}>Reveal choice</Button>
      )}
      {/* todo here that should also make sure that youre winner or just made a choice */}
      {game.gameState === GameState.Completed &&
        canCollect(game, wallet?.publicKey ?? PublicKey.default, slot) && (
          <Button onClick={collect}>Collect</Button>
        )}
      {isHost && game.gameState !== GameState.Completed && (
        <div>
          <p>End game and reclaim rent</p>
          <Button onClick={end}>End game</Button>
        </div>
      )}
    </div>
  );
};
