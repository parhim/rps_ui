import { uniq } from "lodash";
import { useRecoilTransaction_UNSTABLE } from "recoil";
import {
  GameAccount,
  loadedGames,
  gameAtomFamily,
  nonceSeed,
  choiceAtomFamily,
} from "./atoms";
import { Choice } from "../../hooks/game/useCommitChoice";

export const useUpdateGameData = () =>
  useRecoilTransaction_UNSTABLE<[string, GameAccount]>(
    ({ set }) =>
      (id, game) => {
        console.log(101001);
        set(loadedGames, (l) => uniq([...l, id]));
        console.log(999);
        console.log({ id, game });

        set(gameAtomFamily(id), game);
        console.log(2332);
        return;
      },
    []
  );

// updates the seed associated to a game
export const useUpdateSeed = () =>
  useRecoilTransaction_UNSTABLE<[string, number | null]>(
    ({ set }) =>
      (gameKey, seed) => {
        set(nonceSeed(gameKey), seed);
      },
    []
  );

export const useUpdateChoice = () =>
  useRecoilTransaction_UNSTABLE<[string, Choice | null]>(
    ({ set }) =>
      (gameKey, seed) => {
        set(choiceAtomFamily(gameKey), seed);
      },
    []
  );
