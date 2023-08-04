import React, { useContext, useMemo } from 'react';
import { Proposal } from './types';
import { UserVoteProps } from './UserVoteProps';
import { CandidateStats } from './CandidateStats';

export function ShowVoteOnProposals(props: {
  proposals: Proposal[]
  candidates: Record<string, CandidateStats>
} & UserVoteProps) {
  const { userVotes, setUserVotes } = props
  const skip = Object.keys(userVotes)

  // Implement your strategy to select the next proposal
  const proposals = props.proposals
    .filter(_ => !skip.includes(_.SnapshotID))
    .sort((a, b) => {
      return b.Votes.length - a.Votes.length
    })
  const nextProposal = proposals.length ? proposals[0] : null

  return (
    <div>
      {nextProposal && <VoteOnProposal proposalsMap={props.proposalsMap} proposal={nextProposal} userVotes={userVotes} setUserVotes={setUserVotes} />}
    </div>
  );
}

export function VoteOnProposal(props: { proposal: Proposal } & UserVoteProps) {
  const { proposal } = props
  const { userVotes, setUserVotes } = props

  const handleVote = (vote: string) => {
    setUserVotes({
      ...userVotes,
      [proposal.SnapshotID]: vote,
    });
  };

  return (
    <div>
      <h2>How would you vote on...</h2>
      <h3>{proposal.Title} ({proposal.Started.toLocaleString()})</h3>
      <p>
        <a target="_blank" href={`https://governance.decentraland.org/proposal?id=${proposal.ProposalID}`}>DAO Governance Page</a>
      </p>
      <p>
        <a target="_blank" href={`https://forum.decentraland.org/t/${proposal.ForumTopic}`}>Forum Thread</a>
      </p>
      <p>Choices:
      {
        Object.values(proposal.Choices).map(_ => {
          return <button key={_} onClick={() => handleVote(_)}>{_}</button>
        })
      }
      <button key={'SKIP'} onClick={() => handleVote('SKIP')}>SKIP</button>
      </p>
    </div>
  );
};
