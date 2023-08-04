import React, { useEffect, useState } from "react"
import { createRoot } from 'react-dom/client'
import { Database, Proposal } from "./types"
import { loadData } from "./loadData"
import { ShowVoteOnProposals } from "./showProposal"
import { VoteList } from "./VoteList"
import { CandidateStats } from "./CandidateStats"
import { TopCandidates } from "./TopCandidates"
import { PickStrategy } from "./PickStrategy"

const SIX_MONTHS = 6 * 30 * 24 * 60 * 60 * 1000

function App() {
  const [data, setData] = useState({
    votes: [],
    members: {},
    proposals: {}
  } as Database)
  const [proposalsSixMonths, setProposalsSixMonths] = useState([] as Proposal[])
  const [candidates, setCandidates] = useState({} as Record<string,CandidateStats>)
  const [strategy, setStrategy] = useState('same-count')
  const [userVotes, setUserVotes] = useState((
    JSON.parse(localStorage.getItem('userVotes') || '{}')
  ) as Record<string, string>)

  useEffect(() => {
    (async () => {
      const response = await fetch("/data/all.json")
      const data = loadData(await response.json())
      setData(data)
      const p = Object.values(data.proposals) as any as Proposal[]
      const now = Date.now()
      const sixMonths = p.filter(proposal => now - new Date(proposal.Started).getTime() < SIX_MONTHS)
      setProposalsSixMonths(sixMonths)
      const votersSixMonths = {} as Record<string, CandidateStats>
      for (let proposal of sixMonths) {
        for (let voter of proposal.Voters || []) {
          votersSixMonths[voter.Member] = {
            same: 0,
            different: 0,
            sameSet: [],
            differentSet: []
          }
        }
      }
      setCandidates(votersSixMonths)
    })();
  }, [setData])
  useEffect(() => {
    const votersSixMonths = {} as Record<string, CandidateStats>
    for (let proposal of proposalsSixMonths) {
      for (let voter of proposal.Voters || []) {
        const userVote = userVotes[proposal.SnapshotID]
        const candidateVote = proposal.VoteByMembers[voter.Member]
        if (userVote && userVote !== "SKIP") {
          votersSixMonths[voter.Member] = votersSixMonths[voter.Member] || { same: 0, different: 0 }
          if (userVote === candidateVote.Choice) {
            votersSixMonths[voter.Member].same += 1
            if (!votersSixMonths[voter.Member].sameSet) {
              votersSixMonths[voter.Member].sameSet = []
            }
            votersSixMonths[voter.Member].sameSet.push(proposal)
          } else {
            votersSixMonths[voter.Member].different += 1
            if (!votersSixMonths[voter.Member].differentSet) {
              votersSixMonths[voter.Member].differentSet = []
            }
            votersSixMonths[voter.Member].differentSet.push(proposal)
          }
        }
      }
    }
    setCandidates(votersSixMonths)
  }, [userVotes, proposalsSixMonths])

  return (
    <div>
      <h1>Delegation Helper</h1>
      {
        proposalsSixMonths.length && <>
          <ShowVoteOnProposals
            proposalsMap={data.proposals}
            proposals={proposalsSixMonths}
            candidates={candidates}
            userVotes={userVotes}
            setUserVotes={setUserVotes}
          />
          <VoteList proposalsMap={data.proposals} userVotes={userVotes} setUserVotes={setUserVotes}/>
          <PickStrategy strategy={strategy} setStrategy={setStrategy} />
          <TopCandidates strategy={strategy as any} candidates={candidates} members={data.members} proposals={data.proposals}/>
          <h2>Proposals from the past six months: {proposalsSixMonths.length}</h2>
        </>
      }
    </div>
  )
}

const domNode = document.getElementById('root')
const root = createRoot(domNode)
root.render(<App />)