import { useMemo, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { Choice } from "../../hooks/game/useCommitChoice";
import { useGameWallet } from "../../hooks/game/wallet/useGameWallet";
import { useConfettiSuccess } from "../../hooks/utils/useConfettiSuccess";
import { joinedGameAtom, gameAtomFamily, GameState } from "../../state";
import { choiceToString } from "../../utils/game";

export const GameResult = () => {
  const joinedGameKey = useRecoilValue(joinedGameAtom);
  const game = useRecoilValue(gameAtomFamily(joinedGameKey));
  const { gameWallet: wallet } = useGameWallet();
  const isHost = game?.host.toString() === wallet?.publicKey.toString();
  const success = useConfettiSuccess();

  const playerWins = useMemo(() => {
    if (!game) return false;
    if (game.hostChoice === game.challengerChoice) return false;
    return (
      (isHost &&
        game.hostChoice === Choice.Rock &&
        game.challengerChoice === Choice.Scissors) ||
      (isHost &&
        game.hostChoice === Choice.Paper &&
        game.challengerChoice === Choice.Rock) ||
      (isHost &&
        game.hostChoice === Choice.Scissors &&
        game.challengerChoice === Choice.Paper) ||
      (!isHost &&
        game.challengerChoice === Choice.Rock &&
        game.hostChoice === Choice.Scissors) ||
      (!isHost &&
        game.challengerChoice === Choice.Paper &&
        game.hostChoice === Choice.Rock) ||
      (!isHost &&
        game.challengerChoice === Choice.Scissors &&
        game.hostChoice === Choice.Paper)
    );
  }, [game, isHost]);

  useEffect(() => {
    if (playerWins) {
      success();
    }
  }, [playerWins, success]);

  if (!game || game.gameState !== GameState.Completed) return null;

  const resultMessage = () => {
    if (game.hostChoice === game.challengerChoice) {
      return "It's a draw! 🤝";
    } else {
      return playerWins ? "You win! 🎉" : "You lose! 😞";
    }
  };
  if (!game.challengerChoice || !game.hostChoice) return null;

  return (
    <div className="flex justify-center items-center h-60">
      <div className="p-5 rounded-lg shadow-lg bg-background-darkPanelSurface max-w-sm w-full mx-auto text-center text-white">
        <h3 className="text-xl font-semibold mb-2">Game Result</h3>
        <p className="text-lg mb-4">{resultMessage()}</p>
        <div className="mt-4">
          <p>
            Your choice:{" "}
            <span className="font-bold">
              {choiceToString(isHost ? game.hostChoice : game.challengerChoice)}
            </span>{" "}
          </p>
          <p>
            Opponent's choice:{" "}
            <span className="font-bold">
              {choiceToString(isHost ? game.challengerChoice : game.hostChoice)}
            </span>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};
