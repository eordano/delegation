import { Proposal } from "./types";

export type CandidateStats = {
  same: number;
  different: number;
  sameSet: Proposal[]
  differentSet: Proposal[]
};
