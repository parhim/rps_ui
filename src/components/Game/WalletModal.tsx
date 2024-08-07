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

  return (
    <SimpleModal isOpen={walletOpen} onClose={() => setWalletOpen(false)}>
      <div className="flex  justify-center pt-8 w-full flex-wrap">
        {wallet ? (
          <div className=" max-w-[80vw]">
            <p className=" text-xs">
              {wallet.publicKey?.toString().slice(0, 35)}...
            </p>
            <div className="flex flex-row justify-between items-center text-sm">
              <Button
                variant="outline"
                onClick={() =>
                  navigator.clipboard.writeText(wallet.publicKey.toString())
                }
              >
                Copy public key
              </Button>

              <TextButton
                onClick={() => navigator.clipboard.writeText(wallet.secretKey)}
              >
                Copy secret key seed
              </TextButton>
            </div>

            <p>
              game wallet balance:{" "}
              {new Decimal(balance).div(10 ** 9).toString()} SOL
            </p>
            <div className="flex flex-row justify-between">
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
          <p>wallet not created</p>
        )}
        <div>
          <div className="flex flex-col justify-center ">
            <label>Funding amount (SOL)</label>
            <input
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              className="bg-slate-300 text-text rounded-md m-4 p-2"
              type="number"
            />
            <TextButton onClick={() => onFund(amount)}>
              Fund game wallet
            </TextButton>
          </div>
        </div>
        <div className=" h-14" />
        <div className="flex flex-row justify-between items-center">
          <input
            className="bg-slate-300 text-text rounded-md m-4 p-2"
            value={customSecret}
            onChange={(e) => setCustomSecret(e.target.value)}
          />{" "}
          <Button
            onClick={() => {
              try {
                const sk = Uint8Array.from(Buffer.from(customSecret, "base64"));
                const kp = Keypair.fromSecretKey(sk);
                setWallet({
                  publicKey: kp.publicKey,
                  secretKey: customSecret,
                });
              } catch (error) {
                toast.error("invalid secret");
              }
            }}
          >
            import from secret
          </Button>
        </div>
      </div>
    </SimpleModal>
  );
};
