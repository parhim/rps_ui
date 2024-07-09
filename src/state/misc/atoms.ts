import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { Explorer, NetworkOption } from "../../utils/types";

const {
  /* A function that takes an atom and returns a new atom that is persisted to local storage. */
  persistAtom,
} = recoilPersist();

export const networkAtom = atom<NetworkOption>({
  key: "networkAtom",
  default: 0,
  effects: [persistAtom],
});

export const customRpcAtom = atom<string>({
  key: "customRpcAtom",
  default: "",
  effects: [persistAtom],
});

export const settingsOpenAtom = atom<boolean>({
  key: "settingsOpenAtom",
  default: false,
});

export const confettiAtom = atom<boolean>({
  key: "confettiAtom",
  default: false,
});

export const customPriorityFee = atom<string>({
  key: "customPriorityFee",
  default: "16000",
  effects: [persistAtom],
});

export const explorerAtom = atom<Explorer>({
  key: "explorerAtom",
  default: Explorer.Solscan,
  effects: [persistAtom],
});
