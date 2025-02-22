import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { atom, atomFamily } from "recoil";
import { recoilPersist } from "recoil-persist";
import { Choice } from "../../hooks/game/useCommitChoice";

const { persistAtom } = recoilPersist();

export const keypairAtom = atom<{
  publicKey: PublicKey;
  secretKey: string;
} | null>({
  key: "keypairAtom",
  default: null,
  effects: [persistAtom],
});

export const joinedGameAtom = atom<string>({
  key: "joinedGameAtom",
  default: "",
  effects: [persistAtom],
});

export const nonceSeed = atomFamily<number | null, string>({
  key: "nonceSeed",
  default: null,
  effects: [persistAtom],
});

// based on gameKey
export const choiceAtomFamily = atomFamily<Choice | null, string>({
  key: "choiceAtomFamily",
  default: null,
  effects: [persistAtom],
});

export const joinableGameIds = atom<string[]>({
  key: "joinableGameIds",
  default: [],
});

export const loadedGames = atom<string[]>({
  key: "loadedGames",
  default: [],
});

export const currentSlotAtom = atom<number>({
  key: "currentSlotAtom",
  default: 0,
});
export const gameAtomFamily = atomFamily<GameAccount | null, string>({
  key: "gameAtomFamily",
  default: null,
});

export type GameAccount = {
  host: PublicKey;
  challenger?: PublicKey;
  hostCommitment?: number[];
  challengerCommitment?: number[];
  hostChoice?: number;
  challengerChoice?: number;
  betSize: BN;
  gameState: GameState;
  commitmentDeadline?: BN;
};

export enum GameState {
  Waiting,
  Ready,
  Active,
  Completed,
}
