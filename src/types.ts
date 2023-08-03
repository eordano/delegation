import { ParsedMember, ParsedProposal, ParsedVote } from "./parseData";

export interface Member extends Omit<ParsedMember, 'Votes'> {
    VoteByProposal: Record<string, Vote>
}

export interface Vote extends Omit<ParsedVote, 'Member'> {
    Proposal: Proposal
    Member: Member
}

export interface Proposal extends ParsedProposal {
    Voters: Member[]
    VoteByMembers: Record<string, Vote>
    Votes: Vote[]
}

export interface Database {
    votes: Vote[]
    members: Record<string, Member>
    proposals: Record<string, Proposal>
}