import { Proposal } from "./types";

export type UserVoteProps = {
  proposalsMap: Record<string, Proposal>
  userVotes: Record<string, string>;
  setUserVotes: (newValues: Record<string, string>) => void;
};
