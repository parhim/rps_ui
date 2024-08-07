import { PublicKey } from "@solana/web3.js";
import { Choice } from "../hooks/game/useCommitChoice";
import { GameAccount } from "../state";

export const choiceToString = (c: Choice) => {
  switch (c) {
    case Choice.Paper:
      return "Paper";
    case Choice.Rock:
      return "Rock";
    case Choice.Scissors:
      return "Scissors";
  }
};

// 0 is both winners (tie)
// 1 is host wins
// 2 is challenger wins
export const canCollect = (
  game: GameAccount,
  account: PublicKey,
  slot: number
) => {
  const { host, challenger, hostChoice, challengerChoice, commitmentDeadline } =
    game;
  if (!hostChoice && !challengerChoice) return false;
  const isHost =
    account.equals(host) && !account.equals(challenger ?? PublicKey.default);
  if (
    ((hostChoice && !challengerChoice) || (challengerChoice && !hostChoice)) &&
    commitmentDeadline &&
    slot > commitmentDeadline.toNumber()
  ) {
    return true;
  }
  if (hostChoice === challengerChoice) return true;
  if (
    (hostChoice === Choice.Rock && challengerChoice === Choice.Scissors) ||
    (hostChoice === Choice.Paper && challengerChoice === Choice.Rock) ||
    (hostChoice === Choice.Scissors && challengerChoice === Choice.Paper)
  ) {
    console.log("ishost");

    return isHost;
  }
  return !isHost;
};
