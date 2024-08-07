import { Keypair } from "@solana/web3.js";
import Decimal from "decimal.js";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRecoilState, useRecoilValue } from "recoil";
import { useWithdraw } from "../../hooks/game/wallet/useWithdraw";
import {
  useLoadNativeSolBalance,
  useLoadNativeSolBalanceFunc,
} from "../../hooks/useLoadNativeSolBalance";
import { keypairAtom, nativeSolBalanceAtom, walletOpenAtom } from "../../state";
import { Button } from "../Button";
import { TextButton } from "../Button/TextButton";
import { SimpleModal } from "../common";
import { useFund } from "../../hooks/game/wallet/useFund";

export const WalletModal = () => {
  const [walletOpen, setWalletOpen] = useRecoilState(walletOpenAtom);
  const [customSecret, setCustomSecret] = useState("");
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useRecoilState(keypairAtom);
  const balance = useRecoilValue(nativeSolBalanceAtom);
  useLoadNativeSolBalance();
  const refreshBalance = useLoadNativeSolBalanceFunc();
  const onFund = useFund();
  const withdraw = useWithdraw();

  const handleFund = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid funding amount.");
      return;
    }
    onFund(amount);
  };

  const handleImportSecret = () => {
    try {
      const sk = Uint8Array.from(Buffer.from(customSecret, "base64"));
      const kp = Keypair.fromSecretKey(sk);
      setWallet({
        publicKey: kp.publicKey,
        secretKey: customSecret,
      });
    } catch (error) {
      toast.error("Invalid secret");
    }
  };

  return (
    <SimpleModal isOpen={walletOpen} onClose={() => setWalletOpen(false)}>
      <div className="p-6 space-y-6 max-w-lg mx-auto bg-background-darkPanelSurface rounded-lg shadow-md">
        {wallet ? (
          <div>
            <h3 className="text-lg font-semibold text-center">Game Wallet</h3>
            <p className="text-sm text-gray-500 text-center mb-4">
              {wallet.publicKey?.toString().slice(0, 35)}...
            </p>
            <div className="flex justify-center mb-4">
              <Button
                variant="outline"
                onClick={() =>
                  navigator.clipboard.writeText(wallet.publicKey.toString())
                }
                className="mr-2"
              >
                Copy Public Key
              </Button>
              <TextButton
                onClick={() => navigator.clipboard.writeText(wallet.secretKey)}
              >
                Copy Secret Key
              </TextButton>
            </div>
            <p className="text-center">
              Game Wallet Balance:{" "}
              <span className="font-semibold">
                {new Decimal(balance).div(10 ** 9).toString()} SOL
              </span>
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <TextButton onClick={refreshBalance}>Refresh</TextButton>
              <TextButton
                onClick={async () => {
                  await withdraw();
                  refreshBalance();
                }}
              >
                Withdraw
              </TextButton>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Wallet not created</p>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Funding Amount (SOL)
          </label>
          <input
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            className="block w-full  border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            type="number"
            placeholder="Enter amount"
          />
          <TextButton className="w-full" onClick={handleFund}>
            Fund Game Wallet
          </TextButton>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Import from Secret
          </label>
          <input
            className="block w-full  border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={customSecret}
            onChange={(e) => setCustomSecret(e.target.value)}
            placeholder="Enter secret key"
          />
          <Button className="w-full" onClick={handleImportSecret}>
            Import
          </Button>
        </div>
      </div>
    </SimpleModal>
  );
};
