import { useEffect } from "react";
import { useLoadActiveGames } from "../hooks/game/useLoadActiveGames";
import { useRecoilValue } from "recoil";
import { gameAtomFamily, joinableGameIds } from "../state";
import Decimal from "decimal.js";
import { TextButton } from "../components/Button/TextButton";
import { useNavigate } from "react-router";

export const JoinGame = () => {
  const joinable = useRecoilValue(joinableGameIds);
  const loadGames = useLoadActiveGames();
  useEffect(() => {
    loadGames();
  }, [loadGames]);
  return (
    <div className="flex-1 flex flex-col justify-center items-center space-y-4">
      <div className="flex flex-row justify-between items-center">
        <p>Open sessions:</p>
        <TextButton onClick={loadGames} className=" text-4xl">
          🔄
        </TextButton>
      </div>
      {joinable.map((id) => {
        return <JoinableGameRow key={id} id={id} />;
      })}
    </div>
  );
};

const JoinableGameRow = ({ id }: { id: string }) => {
  const game = useRecoilValue(gameAtomFamily(id));
  const navigate = useNavigate();
  const betsize = new Decimal(game?.betSize.toNumber() ?? 0)
    .div(10 ** 9)
    .toNumber();

  if (!game) return <></>;
  return (
    <div
      key={id}
      className="flex min-w-full flex-row justify-between items-center rounded-lg bg-background-darkPanelSurface text-white p-4"
    >
      <span>{id.slice(0, 10)}...</span>
      <span>{betsize} SOL bet size</span>
      <button
        onClick={() => navigate(`/game/${id}`)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Join Game
      </button>
    </div>
  );
};
