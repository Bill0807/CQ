import { atom } from "recoil";

import challenges from "../../assets/data/monthly_challenge.json";

export const loadingState = atom({
  key: "loadingState",
  default: true,
});

function getMonthlyChallenge(challenges) {
  const currentMonth = new Date().getMonth(); // 0 for January, 1 for February, etc.
  const monthlyIndex = currentMonth % challenges.length; // Ensures the index cycles through the array
  return challenges[monthlyIndex];
}

const currentChallenge = getMonthlyChallenge(challenges);

export const monthlyChallengeState = atom({
  key: "monthlyChallengeState",
  default: currentChallenge,
});
