import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import { GameState, GameAccount, joinableGameIds } from "../../state";
import { useUpdateGameData } from "../../state/game/transactions";
import { useGameProgram } from "./useGameProgram";

export const useLoadActiveGames = () => {
  const program = useGameProgram();
  const setJoinable = useSetRecoilState(joinableGameIds);
  const updateGame = useUpdateGameData();

  return useCallback(async () => {
    const games = await program.account.game.all();
    console.log({ games });

    const joinableGames = games.filter((g) => !g.account.challenger);
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
  }, [program, setJoinable, updateGame]);
};
