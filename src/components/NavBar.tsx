import { CogIcon, CurrencyDollarIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { keypairAtom, settingsOpenAtom, walletOpenAtom } from "../state";
import { Button } from "./Button";
import { WalletButton } from "./Button/WalletButton";
import { useEffect } from "react";

export const NavBar = () => {
  const navigate = useNavigate();
  const setSettingsOpen = useSetRecoilState(settingsOpenAtom);
  const setWalletOpen = useSetRecoilState(walletOpenAtom);
  const seed = useRecoilValue(keypairAtom);

  useEffect(() => {
    if (!seed) {
      setWalletOpen(true);
    } else {
      setWalletOpen(false);
    }
  }, [seed, setWalletOpen]);

  return (
    <div className="flex w-full flex-row justify-between items-center mb-6">
      <Button variant="simple" onClick={() => navigate("/")}>
        🪨📄✂️
      </Button>
      <div className="flex">
        <Button className="p-0 mr-2" onClick={() => setWalletOpen(true)}>
          <CurrencyDollarIcon className=" w-6 h-6 mr-1" /> In-game wallet
        </Button>
        <WalletButton />
        <Button
          variant="simple"
          className="p-0"
          onClick={() => setSettingsOpen(true)}
        >
          <CogIcon color="black" className="w-8 h-8" />
        </Button>
      </div>
    </div>
  );
};
