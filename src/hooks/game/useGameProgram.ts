import { AnchorProvider, Program } from "@coral-xyz/anchor";
import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import { RPS_IDL } from "../../utils/program/idl";
import { RockPaperScissors } from "../../utils/program/type";

const noop = () => {
  //
};

/**
 *
 * @returns rock_paper_scissors program
 */
export const useGameProgram = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  return useMemo(() => {
    const _anchorWallet = wallet
      ? wallet
      : ({
          publicKey: PublicKey.default,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          signTransaction: noop as () => Promise<any>,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          signAllTransactions: noop as () => Promise<any>,
        } as AnchorWallet);
    const provider = new AnchorProvider(connection, _anchorWallet, {
      commitment: "confirmed",
      preflightCommitment: "confirmed",
      skipPreflight: false,
    });
    const program = new Program(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      RPS_IDL as any,
      provider
    ) as Program<RockPaperScissors>;

    return program;
  }, [connection, wallet]);
};
