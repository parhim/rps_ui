import { Routes as Switch, Route } from "react-router-dom";
import { NotFound } from "./pages/NotFound";
import { Menu } from "./pages/Menu";
import { NewGame } from "./pages/NewGame";
import { JoinGame } from "./pages/JoinGame";
import { Game } from "./pages/Game";
import { SettingsDialog } from "./components/NetworkMenu";
import { TransactionToastWindow } from "./components/Toaster";
import { WalletModal } from "./components/Game/WalletModal";
import { NavBar } from "./components/NavBar";

export const Router = () => {
  return (
    <div
      className={`w-full 
   
     text-white font-semibold `}
    >
      <div className="flex justify-center w-full h-full    bg-gradient-to-b from-[#718096] to-[#3a4654]">
        <div className="min-w-full p-3">
          <NavBar />
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
          <p className="mt-56 text-center text-xs">only available in devnet</p>
        </div>
        <WalletModal />
        <TransactionToastWindow />
      </div>
    </div>
  );
};
