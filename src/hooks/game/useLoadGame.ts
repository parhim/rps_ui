import { useCallback } from "react";
import { useGameProgram } from "./useGameProgram";
import { GameAccount, GameState, currentSlotAtom } from "../../state";
import { useUpdateGameData } from "../../state/game/transactions";
import { useSetRecoilState } from "recoil";

export const useLoadGame = () => {
  const program = useGameProgram();
  const updateGame = useUpdateGameData();
  const setSlot = useSetRecoilState(currentSlotAtom);
  return useCallback(
    async (key: string) => {
      try {
        const game = await program.account.game.fetch(key);
        const slot = await program.provider.connection.getSlot();
        setSlot(slot);
        if (!game) {
          return null;
        }
        let gameState = GameState.Waiting;
        if (game.gameState.active) gameState = GameState.Active;
        if (game.gameState.completed) gameState = GameState.Completed;
        if (game.gameState.ready) gameState = GameState.Ready;

        const account = {
          ...game,
          gameState,
        } as GameAccount;
        updateGame(key, account);
        return account;
      } catch (error) {
        if (JSON.stringify(error).includes("Account does not exist")) {
          updateGame(key, null);
          return null;
        }
      }
    },
    [program.account.game, program.provider.connection, setSlot, updateGame]
  );
};
