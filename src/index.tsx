import React, { useMemo, useEffect, useState } from "react"
import { createRoot } from 'react-dom/client'
import { Database, Proposal } from "./types"
import { loadData } from "./loadData"

const SIX_MONTHS = 6 * 30 * 24 * 60 * 60 * 1000

function App() {
  const [data, setData] = useState({
    votes: [],
    members: {},
    proposals: {}
  } as Database)

  useEffect(() => {
    (async () => {
      const response = await fetch("/data/all.json")
      const data = await response.json()
      setData(loadData(data))
    })();
  }, [setData])

  const proposals: Proposal[] = useMemo(() => {
    const p = Object.values(data.proposals) as any as Proposal[]
    const now = Date.now()
    return p.filter(proposal => now - new Date(proposal.Started).getTime() < SIX_MONTHS)
  }, [data])

  return (
    <div>
      <h1>Delegation Helper</h1>
      Data length: {data.votes?.length}
      <h2>Proposals from the past six months: {proposals.length}</h2>
      {proposals
        .map(proposal => (
          <div key={proposal.ProposalID}>
            <h3>{proposal.Title}</h3>
            <p>{proposal.Started}</p>
            {
              data.members[proposal.Author]?.Name
            }
            <p>Submitted by: {proposal.Author}</p>
            <p>Votes: {proposal.Votes.length}</p>
          </div>
        ))}

      
    </div>
  )
}

const domNode = document.getElementById('root')
const root = createRoot(domNode)
root.render(<App />)