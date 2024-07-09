import { useCallback } from "react";
import toast from "react-hot-toast";
import { useGameProgram } from "./useGameProgram";
import { ComputeBudgetProgram } from "@solana/web3.js";
import { joinedGameAtom, selectPriorityFeeIx } from "../../state";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  getComputeUnitsForTransaction,
  COMPUTE_UNIT_BUFFER,
} from "../../utils/getComputeLimit";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import useSharedTxLogic from "../useSendTxCommon";
import { RPS_IDL } from "../../utils/program/idl";
import { useUpdateSeed } from "../../state/game/transactions";

export const useEndGame = () => {
  const program = useGameProgram();
  const priorityIx = useRecoilValue(selectPriorityFeeIx);
  const wallet = useAnchorWallet();
  const [joined, setJoined] = useRecoilState(joinedGameAtom);
  const { sendTx } = useSharedTxLogic();
  const setSeed = useUpdateSeed();

  return useCallback(async () => {
    if (!wallet) {
      toast.error("No wallet connected");
      return;
    }

    const tx = await program.methods
      .endGame()
      .accounts({
        host: wallet.publicKey,
        game: joined,
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
    await sendTx(tx, [], RPS_IDL, "Ending game");
    setSeed(joined, null);
    setJoined("");
  }, [
    joined,
    priorityIx,
    program.methods,
    program.provider.connection,
    sendTx,
    setJoined,
    setSeed,
    wallet,
  ]);
};
