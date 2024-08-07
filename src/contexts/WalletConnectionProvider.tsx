import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@tiplink/wallet-adapter-react-ui";
import { WalletConnectWalletAdapter } from "@solana/wallet-adapter-walletconnect";
import React, { useMemo } from "react";
// Default styles for Phantom logo and such
import "@tiplink/wallet-adapter-react-ui/styles.css";
import { useDevnetState } from "./NetworkProvider";
import { NetworkOption } from "../utils/types";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export const WalletConnectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [network, , customRpc] = useDevnetState();
  const rpcEndpoint =
    network === NetworkOption.Devnet
      ? "https://api.devnet.solana.com"
      : network === NetworkOption.Custom && customRpc.length
      ? customRpc
      : import.meta.env.VITE_MAINNET_RPC_URL;
  const wallets = useMemo(
    () => [
      new WalletConnectWalletAdapter({
        network:
          network === NetworkOption.Devnet
            ? WalletAdapterNetwork.Devnet
            : WalletAdapterNetwork.Mainnet,
        options: {
          relayUrl: "wss://relay.walletconnect.com",
        },
      }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={rpcEndpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
