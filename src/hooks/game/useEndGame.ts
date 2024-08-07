import { useCallback } from "react";
import toast from "react-hot-toast";
import { useGameProgram } from "./useGameProgram";
import {
  ComputeBudgetProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { joinedGameAtom, selectPriorityFeeIx } from "../../state";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  getComputeUnitsForTransaction,
  COMPUTE_UNIT_BUFFER,
} from "../../utils/getComputeLimit";
import { useUpdateSeed } from "../../state/game/transactions";
import { useGameWallet } from "./wallet/useGameWallet";
import { useConnection } from "@solana/wallet-adapter-react";

export const useEndGame = () => {
  const program = useGameProgram();
  const priorityIx = useRecoilValue(selectPriorityFeeIx);
  const { gameWallet: wallet, kp } = useGameWallet();
  const [joined, setJoined] = useRecoilState(joinedGameAtom);
  const { connection } = useConnection();
  const setSeed = useUpdateSeed();

  return useCallback(async () => {
    if (!wallet || !kp) {
      toast.error("No wallet connected");
      return;
    }

    const tx = await program.methods
      .endGame()
      .accounts({
        host: wallet.publicKey,
        game: joined,
      })
      .signers([kp])
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
    const signature = await sendAndConfirmTransaction(connection, tx, [kp], {
      skipPreflight: false,
    });
    toast.success(signature.toString());
    setSeed(joined, null);
    setJoined("");
  }, [
    connection,
    joined,
    kp,
    priorityIx,
    program.methods,
    program.provider.connection,
    setJoined,
    setSeed,
    wallet,
  ]);
};
