import { Button } from "../components/Button";
import { useNavigate } from "react-router";

export const Menu = () => {
  const navigate = useNavigate();
  return (
    <div className="flex-1 flex flex-col justify-center items-center space-y-4">
      <Button onClick={() => navigate("/new")}>New Game</Button>
      <Button onClick={() => navigate("/join")}>Join Game</Button>
    </div>
  );
};
