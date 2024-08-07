export const DEVNET_BROADCAST_URLS: string[] = import.meta.env
  .VITE_DEVNET_RPC_BROADCAST_URLS
  ? import.meta.env.VITE_DEVNET_RPC_BROADCAST_URLS.split(",")
  : [];

export const MAINNET_BROADCAST_URLS: string[] = import.meta.env
  .VITE_MAINNET_RPC_BROADCAST_URLS
  ? import.meta.env.VITE_MAINNET_RPC_BROADCAST_URLS.split(",")
  : [];
