import { useCallback } from "react";
import { useGameProgram } from "./useGameProgram";
import toast from "react-hot-toast";
import { sha256 } from "js-sha256";
import useSharedTxLogic from "../useSendTxCommon";
import { ComputeBudgetProgram } from "@solana/web3.js";
import {
  getComputeUnitsForTransaction,
  COMPUTE_UNIT_BUFFER,
} from "../../utils/getComputeLimit";
import { useRecoilState, useRecoilValue } from "recoil";
import { joinedGameAtom, nonceSeed, selectPriorityFeeIx } from "../../state";
import { useLoadGame } from "./useLoadGame";
import { useUpdateChoice } from "../../state/game/transactions";
import { useGameWallet } from "./wallet/useGameWallet";

export enum Choice {
  Rock = 1,
  Paper = 2,
  Scissors = 3,
}

export function hashChoiceAndNonce(choice: number, nonce: Uint8Array): Buffer {
  const data = Buffer.concat([Buffer.from([choice]), Buffer.from(nonce)]);
  const hash = sha256.create();
  hash.update(data);
  const digest = hash.array();
  return Buffer.from(digest);
}

export function createNonce(seed: number): Uint8Array {
  const nonce = new Uint8Array(32).fill(0);
  nonce[0] = seed;
  return nonce;
}

export const useCommitChoice = () => {
  const program = useGameProgram();
  const gameKey = useRecoilValue(joinedGameAtom);
  const { gameWallet: wallet } = useGameWallet();
  const { sendTx } = useSharedTxLogic();
  const [seed, setSeed] = useRecoilState(nonceSeed(gameKey));
  const priorityIx = useRecoilValue(selectPriorityFeeIx);
  const updateChoice = useUpdateChoice();
  const load = useLoadGame();

  return useCallback(
    async (choice: Choice) => {
      if (!seed) return;
      if (!wallet) return toast.error("no wallet connected");
      const newSeed = Math.floor(Math.random() * 100);
      setSeed(newSeed);
      const nonce = createNonce(newSeed);
      const commitment = hashChoiceAndNonce(choice, nonce);
      const tx = await program.methods
        .commitChoice(Array.from(commitment))
        .accounts({
          game: gameKey,
          player: wallet.publicKey,
        })
        .transaction();

      const computeUnits = await getComputeUnitsForTransaction(
        program.provider.connection,
        tx,
        wallet.publicKey
      );
      if (priorityIx) {
        tx.instructions.unshift(priorityIx);
      }

      if (computeUnits) {
        tx.instructions.unshift(
          ComputeBudgetProgram.setComputeUnitLimit({
            units: computeUnits * COMPUTE_UNIT_BUFFER,
          })
        );
      }
      await sendTx(tx, [], program.idl, "Encrypting choice", {}, true);
      await load(gameKey);
      updateChoice(gameKey, choice);
    },
    [
      gameKey,
      load,
      priorityIx,
      program.idl,
      program.methods,
      program.provider.connection,
      seed,
      sendTx,
      setSeed,
      updateChoice,
      wallet,
    ]
  );
};
