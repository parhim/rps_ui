import { selector } from "recoil";
import { customPriorityFee } from "./atoms";
import { ComputeBudgetProgram } from "@solana/web3.js";

export const selectPriorityFeeIx = selector({
  key: "selectPriorityFeeIx",
  get: ({ get }) => {
    const fee = get(customPriorityFee);
    if (!fee) return null;
    return ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: Math.floor(Number(fee)),
    });
  },
});
