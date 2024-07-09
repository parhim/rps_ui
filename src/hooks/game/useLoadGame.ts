import { useCallback } from "react";
import { useGameProgram } from "./useGameProgram";
import { GameAccount, GameState } from "../../state";
import { useUpdateGameData } from "../../state/game/transactions";

export const useLoadGame = () => {
  const program = useGameProgram();
  const updateGame = useUpdateGameData();
  return useCallback(
    async (key: string) => {
      const game = await program.account.game.fetch(key);
      if (!game) return;
      let gameState = GameState.Waiting;
      if (game.gameState.active) gameState = GameState.Active;
      if (game.gameState.completed) gameState = GameState.Completed;
      if (game.gameState.ready) gameState = GameState.Ready;
      console.log({ gamest: game.gameState });

      const account = {
        ...game,
        gameState,
      } as GameAccount;
      updateGame(key, account);
      return account;
    },
    [program.account.game, updateGame]
  );
};
