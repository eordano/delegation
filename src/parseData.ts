import { Member, Vote, Proposal } from './csvTypes'

function parseIntOrZero(number: string | any) {
    const retVal = parseInt(number, 10)
    if (Number.isFinite(retVal)) {
        return retVal
    }
    return 0
}
function parseFloatOrZero(number: string | any) {
    const retVal = parseFloat(number)
    if (Number.isFinite(retVal)) {
        return retVal
    }
    return 0
}

export interface ParsedMember extends Omit<Member, 'TotalVP' | 'MANAVP' | 'LANDVP' | 'NAMESVP' | 'DelegatedVP' | 'L1WearablesVP' | 'RentalVP' | 'DelegatorsAmount'> {
    TotalVP: number;
    MANAVP: number;
    LANDVP: number;
    NAMESVP: number;
    DelegatedVP: number;
    L1WearablesVP: number;
    RentalVP: number;
    DelegatorsAmount: number;
}

export interface ParsedVote extends Omit<Vote, 'Created' | 'ChoiceNumber' | 'VoteWeight' | 'TotalVP' | 'MANAVP' | 'NamesVP' | 'LANDVP' | 'DelegatedVP' | 'L1WearablesVP' | 'RentalVP'> {
    Created: Date;
    ChoiceNumber: number;
    VoteWeight: number;
    TotalVP: number;
    MANAVP: number;
    NamesVP: number;
    LANDVP: number;
    DelegatedVP: number;
    L1WearablesVP: number;
    RentalVP: number;
}

export interface ParsedProposal extends Omit<Proposal, 'Started' | 'Ended' | 'Threshold' | 'ForumTopic' | 'TotalVP' | 'MANAVP' | 'LANDVP' | 'NAMESVP' | 'DELEGATEDVP' | 'Votes'> {
    Started: Date;
    Ended: Date;
    Threshold: number;
    ForumTopic: number;
    TotalVP: number;
    MANAVP: number;
    LANDVP: number;
    NAMESVP: number;
    DELEGATEDVP: number;
    Choices: Record<string,string>;
}

export function parseMember(member: Member): ParsedMember {
    return {
        ...member,
        Member: member.Member.toLowerCase(),
        TotalVP: parseFloatOrZero(member.TotalVP),
        MANAVP: parseFloatOrZero(member.MANAVP),
        LANDVP: parseFloatOrZero(member.LANDVP),
        NAMESVP: parseFloatOrZero(member.NAMESVP),
        DelegatedVP: parseFloatOrZero(member.DelegatedVP),
        L1WearablesVP: parseFloatOrZero(member.L1WearablesVP),
        RentalVP: parseFloatOrZero(member.RentalVP),
        DelegatorsAmount: parseFloatOrZero(member.DelegatorsAmount),
    };
}

export function parseVote(vote: Vote): ParsedVote {
    return {
        ...vote,
        Created: new Date(vote.Created),
        Member: vote.Member.toLowerCase(),
        ChoiceNumber: parseIntOrZero(vote.ChoiceNumber),
        VoteWeight: parseFloatOrZero(vote.VoteWeight),
        TotalVP: parseFloatOrZero(vote.TotalVP),
        MANAVP: parseFloatOrZero(vote.MANAVP),
        NamesVP: parseFloatOrZero(vote.NamesVP),
        LANDVP: parseFloatOrZero(vote.LANDVP),
        DelegatedVP: parseFloatOrZero(vote.DelegatedVP),
        L1WearablesVP: parseFloatOrZero(vote.L1WearablesVP),
        RentalVP: parseFloatOrZero(vote.RentalVP),
    };
}

export function parseProposal(proposal: Proposal, allVotes: ParsedVote[]): ParsedProposal {
    const votes = allVotes.filter(_ => _.SnapshotID === proposal.SnapshotID)
    const choices = {} as Record<string, string>
    for (let vote of votes) {
        if (undefined === choices[vote.ChoiceNumber]) {
            choices[vote.ChoiceNumber] = vote.Choice
        }
    }
    return {
        ...proposal,
        Started: new Date(proposal.Started),
        Ended: new Date(proposal.Ended),
        Threshold: parseFloatOrZero(proposal.Threshold),
        ForumTopic: parseIntOrZero(proposal.ForumTopic),
        TotalVP: parseFloatOrZero(proposal.TotalVP),
        MANAVP: parseFloatOrZero(proposal.MANAVP),
        LANDVP: parseFloatOrZero(proposal.LANDVP),
        NAMESVP: parseFloatOrZero(proposal.NAMESVP),
        DELEGATEDVP: parseFloatOrZero(proposal.DELEGATEDVP),
        Choices: choices
    };
}
