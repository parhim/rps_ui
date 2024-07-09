import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { ComputeBudgetProgram } from "@solana/web3.js";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useRecoilValue } from "recoil";
import {
  joinedGameAtom,
  selectPriorityFeeIx,
  choiceAtomFamily,
} from "../../state";
import {
  getComputeUnitsForTransaction,
  COMPUTE_UNIT_BUFFER,
} from "../../utils/getComputeLimit";
import useSharedTxLogic from "../useSendTxCommon";
import { useGameProgram } from "./useGameProgram";
import { useLoadGame } from "./useLoadGame";

export const useCollectWinnings = () => {
  const program = useGameProgram();
  const gameKey = useRecoilValue(joinedGameAtom);
  const wallet = useAnchorWallet();
  const { sendTx } = useSharedTxLogic();
  const load = useLoadGame();
  const priorityIx = useRecoilValue(selectPriorityFeeIx);
  const choice = useRecoilValue(choiceAtomFamily(gameKey));

  return useCallback(async () => {
    if (!wallet) return toast.error("no wallet connected");

    if (!choice) return toast.error("no choice");
    const tx = await program.methods
      .collect()
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
    await sendTx(tx, [], program.idl, "Collecting winnings");

    await load(gameKey);
  }, [
    choice,
    gameKey,
    load,
    priorityIx,
    program.idl,
    program.methods,
    program.provider.connection,

    sendTx,
    wallet,
  ]);
};
