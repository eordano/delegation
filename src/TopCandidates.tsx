import React, { useEffect, useState } from 'react'
import { CandidateStats } from './CandidateStats'
import { Proposal, Member, Vote } from './types';

type TopCandidatesProps = {
  candidates: Record<string, CandidateStats>
  members: Record<string, Member>
  proposals: Record<string, Proposal>
  strategy: 'same-count' | 'same-percent' | 'same-squared' | 'same-different'
};
function sortedVotes(v: Vote[]) {
  return v.sort((a, b) => {
    return b.Created.getTime() - a.Created.getTime()
  })
}
function firstVote(m: Member) {
  const votes = Object.values(m.VoteByProposal)
  const sorted = sortedVotes(votes)
  if (sorted) {
    return sorted[sorted.length - 1]
  }
}
function lastVote(m: Member) {
  const votes = Object.values(m.VoteByProposal)
  const sorted = sortedVotes(votes)
  if (sorted) {
    return sorted[0]
  }
}

export const TopCandidates: React.FC<TopCandidatesProps> = ({ candidates, members, proposals, strategy }) => {
  const [candidateProfiles, setCandidateProfiles] = useState(
    JSON.parse(localStorage.getItem('candidateProfiles') || '{}')
  );
  const percentSimilar = (a: CandidateStats) => {
    return a.same / (a.same + a.different) * 100
  }
  let sortedCandidates: [string, CandidateStats][] = []
  switch(strategy) {
    case 'same-squared':
      sortedCandidates = Object.entries(candidates)
        .filter(([, _]) => percentSimilar(_) > 80)
        .sort(([, a], [, b]) => b.same * percentSimilar(b) - a.same * percentSimilar(a))
        .slice(0, 40)
      break;
    case 'same-different':
      sortedCandidates = Object.entries(candidates)
        .sort(([, a], [, b]) => b.same - a.same - b.different + a.different)
        .slice(0, 40)
      break;
    case 'same-count':
      sortedCandidates = Object.entries(candidates)
        .filter(([, _]) => percentSimilar(_) > 60)
        .sort(([, a], [, b]) => b.same - a.same)
        .slice(0, 40)
      break;
    case 'same-percent':
    default:
      sortedCandidates = Object.entries(candidates)
        .sort(([, a], [, b]) => percentSimilar(b) - percentSimilar(a))
        .slice(0, 40)
  }

  useEffect(() => {
    const fetchProfiles = async () => {
      const profiles = { ...candidateProfiles };
      let changed = false
      for (const [candidate,] of sortedCandidates) {
        if (profiles[candidate] === undefined) {
          try {
            const response = await fetch(`https://peer.decentraland.org/lambdas/profiles/${candidate}`);
            const data = await response.json();
            profiles[candidate] = data.avatars[0];
            changed = true
          } catch (e) {
            profiles[candidate] = null
          }
        }
      }
      if (changed) {
        setCandidateProfiles(profiles)
        localStorage.setItem('candidateProfiles', JSON.stringify(profiles))
      }
    };
    fetchProfiles();
  }, [sortedCandidates, candidateProfiles]);
  const [expanded, setExpanded] = useState({} as Record<string, boolean>)

  return (
    <table>
      <thead>
        <tr>
          <th>Candidate</th>
          <th>Address</th>
          <th>% similar</th>
          <th>Same Votes</th>
          <th>Different Votes</th>
          <th>VP</th>
        </tr>
      </thead>
      <tbody>
        {sortedCandidates.map(([candidate, stats]) => (
          [
          <tr key={candidate}>
            <td onClick={() => setExpanded({...expanded, [candidate]: !expanded[candidate]})}>
              <img width='20px' src={candidateProfiles[candidate]?.avatar.snapshots.face256} alt={candidateProfiles[candidate]?.name} />
              {candidateProfiles[candidate]?.name || candidate}
            </td>
            <td>{candidate}</td>
            <td>{(stats.same / (stats.same + stats.different) * 100).toFixed(2)}</td>
            <td>{stats.same}</td>
            <td>{stats.different}</td>
            <td>{members[candidate].TotalVP}</td>
          </tr>
          ,
          <tr key={candidate + '-extra'} style={{display: expanded[candidate] ? 'table-row' : 'none'}}>
            <td colSpan={4}>
              {
                (() => {
                  const e = members[candidate]
                  return <>
                    <a target="_blank" href={`https://governance.decentraland.org/profile/?address=${candidate}`}>Profile</a>
                    <p><strong>Total VP</strong>: {e.TotalVP}</p>
                    <p>First vote: {firstVote(e)?.Created.toLocaleString()}</p>
                    <p>Last vote: {lastVote(e)?.Created.toLocaleString()}</p>
                    <p><strong>Voted likewise:</strong>  </p><ul>{stats.sameSet?.map(_ => 
                      <li key={_.ProposalID}><a target="_blank" href={`https://governance.decentraland.org/proposals?id=${_.ProposalID}`}>{_.Title}</a></li>
                    )} </ul>
                    <p><strong>Voted differently:</strong> </p> <ul>{stats.differentSet?.map(_ => 
                      <li key={_.ProposalID}><a target="_blank" href={`https://governance.decentraland.org/proposals?id=${_.ProposalID}`}>{_.Title}</a></li>
                    )} </ul>
                  </>
                })()
              }
            </td>
          </tr>
          ]
        )).flat()}
      </tbody>
    </table>
  )
}