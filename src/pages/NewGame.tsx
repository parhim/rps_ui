import { useCallback, useState } from "react";
import { Button } from "../components/Button";
import { useCreateGame } from "../hooks/game/useCreateGame";
import { useNavigate } from "react-router";

export const NewGame = () => {
  const create = useCreateGame();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");

  const onCreate = useCallback(async () => {
    const gameId = await create(amount);
    navigate(`/game/${gameId.toString()}`);
  }, [amount, create, navigate]);

  return (
    <div className="flex-1 flex flex-col justify-center items-center space-y-4">
      <div className="flex flex-row justify-between items-center space-x-3">
        <label>Bet size in sol</label>
        <input
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
          className=" bg-slate-300 text-text rounded-md p-2 "
          type="number"
        />
      </div>
      <Button onClick={onCreate}>Start game</Button>
    </div>
  );
};
