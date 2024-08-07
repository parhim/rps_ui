import { useEffect, useMemo } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useLoadGame } from "../../hooks/game/useLoadGame";
import {
  chainDetailsOpenAtom,
  gameAtomFamily,
  joinedGameAtom,
} from "../../state";
import { Button } from "../Button";
import { WalletButton } from "../Button/WalletButton";
import { GameActions } from "./GameActions";
import { useJoinGame } from "../../hooks/game/useJoinGame";
import { GameInfo } from "./GameInfo";
import { useGameWallet } from "../../hooks/game/wallet/useGameWallet";
import Decimal from "decimal.js";

export const GameScreen = ({ gameKey }: { gameKey: string }) => {
  const game = useRecoilValue(gameAtomFamily(gameKey));
  const setSelectedGame = useSetRecoilState(joinedGameAtom);
  const load = useLoadGame();
  const { gameWallet: wallet } = useGameWallet();

  const [detailsOpen, setDetailsOpen] = useRecoilState(chainDetailsOpenAtom);
  const joined =
    game &&
    wallet &&
    (game.host.equals(wallet.publicKey) ||
      game.challenger?.equals(wallet.publicKey));

  const onJoin = useJoinGame(gameKey);

  useEffect(() => {
    if (!game) {
      load(gameKey);
      setSelectedGame(gameKey);
    }
  }, [game, gameKey, load, setSelectedGame]);

  const betsize = useMemo(() => {
    return new Decimal(game?.betSize.toNumber() ?? 0).div(10 ** 9).toNumber();
  }, [game]);

  useEffect(() => {
    let intervalId: NodeJS.Timer;
    if (joined) {
      intervalId = setInterval(() => {
        load(gameKey);
      }, 2000);
    }
    return () => clearInterval(intervalId); // Cleanup interval on unmount or if `joined` becomes false
  }, [joined, load, gameKey]);

  if (!wallet) return <WalletButton />;

  return (
    <div>
      {game && (
        <div>
          <p>Bet size: {betsize} SOL</p>
          {joined ? (
            <GameActions />
          ) : (
            <Button onClick={onJoin}>Join game</Button>
          )}
        </div>
      )}
      <div className=" h-10" />
      {!game && <p>Game ended or not found</p>}
      {detailsOpen ? (
        <GameInfo gameKey={gameKey} />
      ) : (
        <>
          {game && (
            <Button variant="simple" onClick={() => setDetailsOpen(true)}>
              show chain data
            </Button>
          )}
        </>
      )}
    </div>
  );
};
