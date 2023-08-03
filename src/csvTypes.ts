export interface Member {
  Member: string;
  TotalVP: string;
  MANAVP: string;
  LANDVP: string;
  NAMESVP: string;
  DelegatedVP: string;
  L1WearablesVP: string;
  RentalVP: string;
  HasDelegated: string;
  Delegate: string;
  HasDelegators: string;
  DelegatorsAmount: string;
  Delegators: string;
  AvatarPreview: string;
}

export interface Vote {
  Member: string;
  SnapshotID: string;
  Created: string;
  ProposalTitle: string;
  ChoiceNumber: string;
  Choice: string;
  VoteWeight: string;
  TotalVP: string;
  MANAVP: string;
  NamesVP: string;
  LANDVP: string;
  DelegatedVP: string;
  L1WearablesVP: string;
  RentalVP: string;
}

export interface Proposal {
  ProposalID: string;
  SnapshotID: string;
  Author: string;
  Type: string;
  Title: string;
  Started: string;
  Ended: string;
  Threshold: string;
  Status: string;
  ForumTopic: string;
  TotalVP: string;
  MANAVP: string;
  LANDVP: string;
  NAMESVP: string;
  DELEGATEDVP: string;
  Votes: string;
}