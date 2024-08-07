import { useConnection } from "@solana/wallet-adapter-react";
import { useCallback, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { nativeSolBalanceAtom } from "../state";
import { useGameWallet } from "./game/wallet/useGameWallet";

export const useLoadNativeSolBalance = () => {
  const loadSolBalance = useLoadNativeSolBalanceFunc();
  useEffect(() => {
    loadSolBalance();
  }, [loadSolBalance]);
};

export const useLoadNativeSolBalanceFunc = () => {
  const { gameWallet: wallet } = useGameWallet();
  const { connection } = useConnection();
  const setSolBalance = useSetRecoilState(nativeSolBalanceAtom);

  return useCallback(async () => {
    if (!wallet) {
      return;
    }
    const balance = await connection.getBalance(wallet.publicKey, "confirmed");

    setSolBalance(balance);
  }, [connection, setSolBalance, wallet]);
};
