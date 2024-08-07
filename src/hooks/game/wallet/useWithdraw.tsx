import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  Keypair,
  sendAndConfirmTransaction,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useRecoilValue } from "recoil";
import { keypairAtom } from "../../../state";
import { useGameWallet } from "./useGameWallet";

export const useWithdraw = () => {
  const wallet = useAnchorWallet();
  const { gameWallet } = useGameWallet();
  const { connection } = useConnection();
  const gameWalletKeyPair = useRecoilValue(keypairAtom);

  return useCallback(async () => {
    if (!wallet || !gameWallet || !gameWalletKeyPair)
      return toast.error("no wallet");
    const balance = await connection.getBalance(
      gameWallet.publicKey,
      "confirmed"
    );
    const tx = withdraw(gameWallet.publicKey, wallet.publicKey, balance - 5000);

    const secret = Uint8Array.from(
      Buffer.from(gameWalletKeyPair.secretKey, "base64")
    );
    const kp = Keypair.fromSecretKey(secret);
    const signature = await sendAndConfirmTransaction(connection, tx, [kp]);
    console.log({ signature });
    toast.success(signature.toString());
  }, [connection, gameWallet, gameWalletKeyPair, wallet]);
};

export function withdraw(
  gameWallet: PublicKey,
  wallet: PublicKey,
  balance: number
) {
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: gameWallet,
      toPubkey: wallet,
      lamports: balance,
    })
  );
  return tx;
}
