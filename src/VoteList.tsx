import React, { useEffect } from 'react'
import { UserVoteProps } from './UserVoteProps';

export function VoteList(props: UserVoteProps) {
  const { userVotes, setUserVotes } = props

  // Load votes from localStorage when component mounts
  useEffect(() => {
    const savedVotes = localStorage.getItem('votes');
    if (savedVotes && setUserVotes) {
      setUserVotes(JSON.parse(savedVotes));
    }
  }, [setUserVotes]);

  // Save votes to localStorage whenever they change
  useEffect(() => {
    if (userVotes && Object.keys(userVotes).length) {
      localStorage.setItem('votes', JSON.stringify(userVotes));
    }
  }, [userVotes]);

  const handleForgetOne = (key: string) => {
    const newVotes = { ...userVotes }
    delete newVotes[key]
    setUserVotes(newVotes)
  };

  const handleForget = () => {
    localStorage.removeItem('votes');
    setUserVotes({});
  };

  return (
    <div>
      <h2>Your Votes</h2>
      {Object.entries(userVotes).map(([proposalId, vote]) => (
        <p key={proposalId}><a target="_blank" href={`https://governance.decentraland.org/proposal/?id=${proposalId}`}>{props.proposalsMap[proposalId].Title}</a>: {vote as any} <button onClick={() => handleForgetOne(proposalId)}>Forget</button></p>
      ))}
      <button onClick={handleForget}>Forget All Votes</button>
    </div>
  );
};