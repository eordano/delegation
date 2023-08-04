import { Database, Member, Proposal, Vote } from "./types"
import { ParsedMember, ParsedProposal, ParsedVote } from "./parseData"

export function loadData(all: {
    votes: ParsedVote[],
    members: ParsedMember[],
    proposals: ParsedProposal[]
}): Database {
    const { votes, proposals, members } = all
    const membersDictionary = {} as Record<string, Member>
    for (let member of members) {
        const newMember: Member = {
            ...member,
            VoteByProposal: {},
        }
        membersDictionary[member.Member] = newMember
    }
    const proposalsDictionary = {} as Record<string, Proposal>
    for (let proposal of proposals) {
        const newProposal: Proposal = {
            ...proposal,
            Started: new Date(proposal.Started),
            Ended: new Date(proposal.Ended),
            VoteByMembers: {},
            Voters: [],
            Votes: []
        }
        proposalsDictionary[proposal.SnapshotID] = newProposal
    }
    const newVotes: Vote[] = []
    for (let vote of votes) {
        const memberId = vote.Member
        const member = membersDictionary[memberId]
        if (!member) {
            console.log(`Member ${memberId} for vote on ${vote.SnapshotID} not found`)
            continue
        }
        const proposal = proposalsDictionary[vote.SnapshotID]
        if (!proposal) {
            continue
        }
        const newVote: Vote = {
            ...vote,
            Created: new Date(vote.Created),
            Member: member,
            Proposal: proposal
        }
        member.VoteByProposal[vote.SnapshotID] = newVote
        proposal.VoteByMembers[memberId] = newVote
        proposal.Voters.push(member)
        proposal.Votes.push(newVote)
        newVotes.push(newVote)
    }
    return {
        votes: newVotes,
        proposals: proposalsDictionary,
        members: membersDictionary
    }
}