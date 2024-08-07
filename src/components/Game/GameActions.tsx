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

  if (!game) return null;

  return (
    <div className="flex flex-col flex-1 space-y-4 p-4 bg-background-darkPanelSurface rounded-lg shadow-lg text-white">
      <p className="text-center">
        {isHost ? "You're the host" : "You joined the game"}
      </p>
      {isHost && !!game.challenger && (
        <p className="text-center text-green-400">
          Opponent has joined the game 🎉
        </p>
      )}
      {((isHost && !!game.challengerCommitment) ||
        (!isHost && !!game.hostCommitment)) && (
        <p className="text-center text-yellow-400">
          Opponent made their choice 🤔
        </p>
      )}
      <GameResult />
      {[GameState.Active, GameState.Waiting].includes(game.gameState) && (
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => commit(Choice.Rock)}
            className={`w-16 h-16 ${
              currentChoice === Choice.Rock ? "bg-stone-600" : ""
            }`}
          >
            <p className="text-4xl">🪨</p>
          </Button>
          <Button
            onClick={() => commit(Choice.Paper)}
            className={`w-16 h-16 ${
              currentChoice === Choice.Paper ? "bg-stone-600" : " "
            }`}
          >
            <p className="text-4xl">📄</p>
          </Button>
          <Button
            onClick={() => commit(Choice.Scissors)}
            className={`w-16 h-16 ${
              currentChoice === Choice.Scissors ? "bg-stone-600 " : ""
            }`}
          >
            <p className="text-4xl">✂️</p>
          </Button>
        </div>
      )}
      {game.gameState === GameState.Ready && (
        <Button
          onClick={async () => reveal()}
          className="w-full mt-4 bg-blue-500 hover:bg-blue-700"
        >
          Reveal Choice
        </Button>
      )}
      {game.gameState === GameState.Completed &&
        canCollect(game, wallet?.publicKey ?? PublicKey.default, slot) && (
          <Button
            onClick={collect}
            className="w-full mt-2 bg-green-500 hover:bg-green-700"
          >
            Collect Winnings 🏆
          </Button>
        )}
      {isHost && game.gameState !== GameState.Completed && (
        <div className="text-center mt-4">
          <p className="mb-4">End game and reclaim rent</p>
          <Button onClick={end} className="w-full bg-red-500 hover:bg-red-700">
            End Game
          </Button>
        </div>
      )}
    </div>
  );
};
