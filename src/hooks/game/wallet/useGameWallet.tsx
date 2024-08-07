import { useMemo } from "react";
import { keypairAtom } from "../../../state";
import { Keypair } from "@solana/web3.js";
import { useRecoilValue } from "recoil";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

export const useGameWallet = () => {
  const gameKeyPair = useRecoilValue(keypairAtom);

  const kp = useMemo(() => {
    if (!gameKeyPair) return null;
    const secretKey = Uint8Array.from(
      Buffer.from(gameKeyPair.secretKey, "base64")
    );
    const kp = Keypair.fromSecretKey(secretKey);
    return kp;
  }, [gameKeyPair]);
  const gameWallet = useMemo(() => {
    if (!kp) return null;
    return new NodeWallet(kp);
  }, [kp]);

  return { gameWallet, kp };
};
