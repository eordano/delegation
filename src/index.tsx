import React, { useEffect, useState } from "react"
import { createRoot } from 'react-dom/client';

function App() {
  const [members, setMembers] = useState([])
  const [votes, setVotes] = useState([])
  const [proposals, setProposals] = useState([])

  const fetchData = async (url) => {
    const response = await fetch(url)
    const data = await response.text()
    return data.split("\n").map((row) => row.split(","))
  }

  useEffect(() => {
    fetchData("/data/members.csv").then(setMembers)
    fetchData("/data/votes.csv").then(setVotes)
    fetchData("/data/proposals.csv").then(setProposals)
  }, [])

  return (
    <div>
      <h1>Delegation Helper</h1>
      {/* Further components and logic here */}
    </div>
  )
}

const domNode = document.getElementById('root');
const root = createRoot(domNode);
root.render(<App />)
