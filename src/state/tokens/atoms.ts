import { Account, Mint } from "@solana/spl-token";
import { atom, atomFamily } from "recoil";

export const splMintAtomFamily = atomFamily<Mint | null, string>({
  key: "splMintAtomFamily",
  default: null,
});

/**
 * Token Accounts stored by mint address.
 *
 * NOTE: Only use Associated Token Accounts
 */
export const associatedTokenAccountAtomFamily = atomFamily<
  Account | null,
  string
>({
  key: "associatedTokenAccountAtomFamily",
  default: null,
});

/**
 * Native SOL held by the connected wallet.
 */
export const nativeSolBalanceAtom = atom({
  key: "nativeSolBalanceAtom",
  default: 0,
});
