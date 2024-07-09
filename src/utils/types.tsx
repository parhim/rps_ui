export enum NetworkOption {
  Mainnet,
  Devnet,
  Custom,
}

export enum Explorer {
  Solscan,
  SolanaExplorer,
  Helius,
  SolanaFM,
}

export const Explorers: {
  [key in Explorer]: {
    name: string;
    txLink: (txId: string, devnet: boolean) => string;
    accountLink: (address: string, devnet: boolean) => string;
  };
} = {
  [Explorer.Solscan]: {
    name: "Solscan",
    txLink: (txId: string, devnet: boolean) => {
      return `https://solscan.io/tx/${txId}${devnet ? "?cluster=devnet" : ""}`;
    },
    accountLink: (address: string, devnet: boolean) => {
      return `https://solscan.io/account/${address}${
        devnet ? "?cluster=devnet" : ""
      }`;
    },
  },
  [Explorer.SolanaExplorer]: {
    name: "Solana Explorer",
    txLink: (txId: string, devnet: boolean) => {
      return `https://explorer.solana.com/tx/${txId}${
        devnet ? "?cluster=devnet" : ""
      }`;
    },
    accountLink: (address: string, devnet: boolean) => {
      return `https://explorer.solana.com/address/${address}${
        devnet ? "?cluster=devnet" : ""
      }`;
    },
  },
  [Explorer.Helius]: {
    name: "Helius",
    txLink: (txId: string, devnet: boolean) => {
      return `https://xray.helius.xyz/tx/${txId}${
        devnet ? "?network=devnet" : ""
      }`;
    },
    accountLink: (address: string, devnet: boolean) => {
      return `https://xray.helius.xyz/account/${address}${
        devnet ? "?network=devnet" : ""
      }`;
    },
  },
  [Explorer.SolanaFM]: {
    name: "SolanaFM",
    txLink: (txId: string, devnet: boolean) => {
      return `https://solana.fm/tx/${txId}${
        devnet ? "?cluster=devnet-solana" : ""
      }`;
    },
    accountLink: (address: string, devnet: boolean) => {
      return `https://solana.fm/address/${address}${
        devnet ? "?cluster=devnet-solana" : ""
      }`;
    },
  },
};
