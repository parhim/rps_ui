import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useLoadGame } from "../../hooks/game/useLoadGame";
import { gameAtomFamily, joinedGameAtom } from "../../state";
import { Button } from "../Button";
import { WalletButton } from "../Button/WalletButton";
import { GameActions } from "./GameActions";
import { useJoinGame } from "../../hooks/game/useJoinGame";
import { GameInfo } from "./GameInfo";

export const GameScreen = ({ gameKey }: { gameKey: string }) => {
  const game = useRecoilValue(gameAtomFamily(gameKey));
  const setSelectedGame = useSetRecoilState(joinedGameAtom);
  const load = useLoadGame();
  const wallet = useAnchorWallet();
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

  if (!wallet) return <WalletButton />;

  return (
    <div>
      {game ? (
        <div>
          <p>Bet size: {game.betSize.toString()} lamports</p>
          {joined ? (
            <GameActions />
          ) : (
            <Button onClick={onJoin}>Join game</Button>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
      <div className=" h-10" />
      <GameInfo gameKey={gameKey} />
    </div>
  );
};
