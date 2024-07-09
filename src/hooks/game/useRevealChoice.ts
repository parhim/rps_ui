import { useCallback } from "react";
import { useGameProgram } from "./useGameProgram";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import { sha256 } from "js-sha256";
import useSharedTxLogic from "../useSendTxCommon";
import { ComputeBudgetProgram } from "@solana/web3.js";
import {
  getComputeUnitsForTransaction,
  COMPUTE_UNIT_BUFFER,
} from "../../utils/getComputeLimit";
import { useRecoilValue } from "recoil";
import {
  choiceAtomFamily,
  joinedGameAtom,
  nonceSeed,
  selectPriorityFeeIx,
} from "../../state";
import { useLoadGame } from "./useLoadGame";

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

export const useRevealChoice = () => {
  const program = useGameProgram();
  const gameKey = useRecoilValue(joinedGameAtom);
  const wallet = useAnchorWallet();
  const { sendTx } = useSharedTxLogic();
  const load = useLoadGame();
  const seed = useRecoilValue(nonceSeed(gameKey));
  const priorityIx = useRecoilValue(selectPriorityFeeIx);
  const choice = useRecoilValue(choiceAtomFamily(gameKey));

  return useCallback(async () => {
    if (!seed) return toast.error("no seed");
    if (!wallet) return toast.error("no wallet connected");
    const nonce = createNonce(seed);
    if (!choice) return toast.error("no choice");
    const tx = await program.methods
      .revealChoice(choice, Array.from(nonce))
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
    await sendTx(tx, [], program.idl, "Revealing choice");

    await load(gameKey);
  }, [
    choice,
    gameKey,
    load,
    priorityIx,
    program.idl,
    program.methods,
    program.provider.connection,
    seed,
    sendTx,
    wallet,
  ]);
};
