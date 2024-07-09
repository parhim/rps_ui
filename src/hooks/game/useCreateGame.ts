import { useCallback } from "react";
import toast from "react-hot-toast";
import { useGameProgram } from "./useGameProgram";
import { BN } from "bn.js";
import { ComputeBudgetProgram, Keypair } from "@solana/web3.js";
import { joinedGameAtom, selectPriorityFeeIx } from "../../state";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  getComputeUnitsForTransaction,
  COMPUTE_UNIT_BUFFER,
} from "../../utils/getComputeLimit";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import useSharedTxLogic from "../useSendTxCommon";
import { RPS_IDL } from "../../utils/program/idl";
import { useUpdateSeed } from "../../state/game/transactions";

export const useCreateGame = () => {
  const program = useGameProgram();
  const priorityIx = useRecoilValue(selectPriorityFeeIx);
  const wallet = useAnchorWallet();
  const setJoined = useSetRecoilState(joinedGameAtom);
  const { sendTx } = useSharedTxLogic();
  const setSeed = useUpdateSeed();

  return useCallback(
    async (betSize: string) => {
      const gameKeypair = Keypair.generate();
      const lamports = Number(betSize) ?? 0;
      if (!wallet) return toast.error("No wallet connected");
      if (!lamports) return toast.error("Please provide a bet size");
      const BET_SIZE = new BN(lamports);
      const tx = await program.methods
        .createGame(BET_SIZE)
        .accounts({
          host: wallet.publicKey,
          game: gameKeypair.publicKey,
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
      await sendTx(tx, [gameKeypair], RPS_IDL, "Creating game");
      toast.success(gameKeypair.publicKey.toString());
      setJoined(gameKeypair.publicKey.toString());
      setSeed(
        gameKeypair.publicKey.toString(),
        Math.floor(Math.random() * 100)
      );
      return gameKeypair.publicKey;
    },
    [
      priorityIx,
      program.methods,
      program.provider.connection,
      sendTx,
      setJoined,
      setSeed,
      wallet,
    ]
  );
};
