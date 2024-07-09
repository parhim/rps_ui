import { useCallback } from "react";
import toast from "react-hot-toast";
import { useGameProgram } from "./useGameProgram";
import { ComputeBudgetProgram } from "@solana/web3.js";
import {
  gameAtomFamily,
  joinedGameAtom,
  selectPriorityFeeIx,
} from "../../state";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  getComputeUnitsForTransaction,
  COMPUTE_UNIT_BUFFER,
} from "../../utils/getComputeLimit";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import useSharedTxLogic from "../useSendTxCommon";
import { useUpdateSeed } from "../../state/game/transactions";
import { useLoadGame } from "./useLoadGame";

export const useJoinGame = (gameKey: string) => {
  const program = useGameProgram();
  const priorityIx = useRecoilValue(selectPriorityFeeIx);
  const wallet = useAnchorWallet();
  const [game, setGame] = useRecoilState(gameAtomFamily(gameKey));
  const setJoined = useSetRecoilState(joinedGameAtom);
  const { sendTx } = useSharedTxLogic();
  const setSeed = useUpdateSeed();
  const load = useLoadGame();

  return useCallback(async () => {
    if (!wallet) return toast.error("No wallet connected");

    const tx = await program.methods
      .joinGame()
      .accounts({ game: gameKey, challenger: wallet.publicKey })
      .transaction();
    if (game) setGame({ ...game, challenger: wallet.publicKey });

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
    await sendTx(tx, [], program.idl, "Joining game");

    const updated = await load(gameKey);
    if (updated?.challenger && updated.challenger.equals(wallet.publicKey)) {
      setJoined(gameKey);
      setSeed(gameKey, Math.floor(Math.random() * 100));
      return gameKey;
    }
  }, [
    game,
    gameKey,
    load,
    priorityIx,
    program.idl,
    program.methods,
    program.provider.connection,
    sendTx,
    setGame,
    setJoined,
    setSeed,
    wallet,
  ]);
};
