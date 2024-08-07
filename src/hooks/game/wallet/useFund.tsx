import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import Decimal from "decimal.js";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { keypairAtom } from "../../../state";
import { useGameProgram } from "../useGameProgram";
import { Program } from "@coral-xyz/anchor";
import { RockPaperScissors } from "../../../utils/program/type";
import useSharedTxLogic from "../../useSendTxCommon";
import { useLoadNativeSolBalanceFunc } from "../../useLoadNativeSolBalance";

export const useFund = () => {
  const [wallet, setWallet] = useRecoilState(keypairAtom);
  const { sendTx } = useSharedTxLogic();
  const program = useGameProgram();
  const refreshBalance = useLoadNativeSolBalanceFunc();
  return useCallback(
    async (amount: string) => {
      if (!wallet) {
        const keypair = Keypair.generate();
        const publicKey = keypair.publicKey;
        const secretKey = Buffer.from(keypair.secretKey).toString("base64");
        const tx = fundAccount(
          publicKey,
          new Decimal(amount).mul(10 ** 9).toNumber(),
          program
        );
        if (!tx) return toast.error("cant fund account");
        await sendTx(
          tx,
          [],
          program.idl,
          `Funding game wallet ${publicKey.toString()}`
        );

        setWallet({
          publicKey,
          secretKey,
        });
      } else {
        const tx = fundAccount(
          wallet.publicKey,
          new Decimal(amount).mul(10 ** 9).toNumber(),
          program
        );
        if (!tx) return toast.error("cant fund account");
        await sendTx(
          tx,
          [],
          program.idl,
          `Funding game wallet ${wallet.publicKey?.toString()}`
        );
        refreshBalance();
      }
    },
    [program, refreshBalance, sendTx, setWallet, wallet]
  );
};

export function fundAccount(
  pubkey: PublicKey,
  amount: number,
  program: Program<RockPaperScissors>
) {
  if (!program.provider.publicKey) return null;
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: program.provider.publicKey,
      toPubkey: pubkey,
      lamports: amount,
    })
  );
  return tx;
}
