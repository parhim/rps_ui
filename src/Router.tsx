import { Routes as Switch, Route, useNavigate } from "react-router-dom";
import { NotFound } from "./pages/NotFound";
import { WalletButton } from "./components/Button/WalletButton";
import { Menu } from "./pages/Menu";
import { Button } from "./components/Button";
import { NewGame } from "./pages/NewGame";
import { JoinGame } from "./pages/JoinGame";
import { Game } from "./pages/Game";
import { SettingsDialog } from "./components/NetworkMenu";
import { useSetRecoilState } from "recoil";
import { settingsOpenAtom } from "./state";
import { TransactionToastWindow } from "./components/Toaster";

export const Router = () => {
  const navigate = useNavigate();
  const setSettingsOpen = useSetRecoilState(settingsOpenAtom);

  return (
    <div
      className={`w-full 
bg-gradient-to-b from-[#718096] to-[#3a4654]
     text-white font-semibold `}
    >
      <div className="flex justify-center w-full">
        <div className="min-w-full p-3">
          <div className="flex w-full flex-row justify-between items-center mb-6">
            <Button variant="simple" onClick={() => navigate("/")}>
              🪨📜✂️
            </Button>
            <Button variant="simple" onClick={() => setSettingsOpen(true)}>
              Settings
            </Button>
            <WalletButton />
          </div>
          <SettingsDialog />
          <div className=" flex justify-center ">
            <Switch>
              <Route path="/" Component={Menu} />
              <Route path="/new" Component={NewGame} />
              <Route path="/game/:gameKey" Component={Game} />
              <Route path="/join" Component={JoinGame} />
              <Route path="/*" Component={NotFound} />
            </Switch>
          </div>
        </div>
        <TransactionToastWindow />
      </div>
    </div>
  );
};
