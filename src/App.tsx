import { RecoilRoot } from "recoil";
import "./App.css";
import { WalletConnectionProvider } from "./contexts/WalletConnectionProvider";
import { NetworkProvider } from "./contexts/NetworkProvider";
import { ToastProvider } from "./contexts/ToastContext";
import { Router } from "./Router";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <RecoilRoot>
        <ToastProvider>
          <NetworkProvider>
            <WalletConnectionProvider>
              <Router />
            </WalletConnectionProvider>
          </NetworkProvider>
        </ToastProvider>
      </RecoilRoot>
    </BrowserRouter>
  );
}

export default App;
