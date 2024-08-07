import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import { GameState, GameAccount, joinableGameIds } from "../../state";
import { useUpdateGameData } from "../../state/game/transactions";
import { useGameProgram } from "./useGameProgram";
import { useGameWallet } from "./wallet/useGameWallet";

export const useLoadActiveGames = () => {
  const program = useGameProgram();
  const setJoinable = useSetRecoilState(joinableGameIds);
  const updateGame = useUpdateGameData();
  const { gameWallet } = useGameWallet();

  return useCallback(async () => {
    const games = await program.account.game.all();

    const joinableGames = games.filter(
      (g) =>
        !g.account.challenger ||
        (gameWallet &&
          (g.account.challenger.equals(gameWallet.publicKey) ||
            g.account.host.equals(gameWallet.publicKey)))
    );
    setJoinable(
      joinableGames.map((g) => {
        const { publicKey, account } = g;
        const key = publicKey.toString();
        const acc = {
          ...account,
          gameState: GameState.Waiting,
        } as GameAccount;
        updateGame(key, acc);
        return publicKey.toString();
      })
    );
  }, [gameWallet, program.account.game, setJoinable, updateGame]);
};
