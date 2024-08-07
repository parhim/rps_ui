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
  useRecoilTransaction_UNSTABLE<[string, GameAccount | null]>(
    ({ set }) =>
      (id, game) => {
        set(loadedGames, (l) => uniq([...l, id]));
        set(gameAtomFamily(id), game);
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
