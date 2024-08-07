import { Connection, PublicKey, TransactionError } from "@solana/web3.js";

/**
 * Minimum cost in lamports for a TX.
 *
 * TODO make this dynamic.
 */
export const BASE_NETWORK_FEES = 0.00001 * 10 ** 9;

export const chunkArray = <T>(array: T[], chunkLength?: number): T[][] => {
  const chunks = [];
  const length = chunkLength ?? 100;
  for (let i = 0; i < array.length; i += length) {
    chunks.push(array.slice(i, i + length));
  }
  return chunks;
};

export const getManyAccounts = async (
  connection: Connection,
  addresses: PublicKey[]
) => {
  const addressChunks = chunkArray(addresses);

  const promises = addressChunks.map(async (addressChunk) => {
    return await connection.getMultipleAccountsInfo(addressChunk);
  });

  const results = await Promise.all(promises);
  return results.flat();
};

export class TxError extends Error {
  error: TransactionError;
  signatures: string[];
  logs: string[] | undefined;
  constructor(
    error: TransactionError | Error,
    signatures: string[],
    message?: string
  ) {
    super(message);
    this.error = error;
    this.signatures = signatures;
  }
}

export const wait = async (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};
