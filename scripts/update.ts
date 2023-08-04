import { promises as fs } from 'fs'
import * as Papa from 'papaparse';
import { Proposal } from './src/csvTypes'
import { parseMember, parseVote, parseProposal, ParsedMember, ParsedVote, ParsedProposal } from './src/parseData'

async function parse(file: string): Promise<any[]> {
  const contents = await fs.readFile(file, 'utf-8')
  return new Promise(async (resolve, reject) => {
    Papa.parse(contents as any, {
      header: true,
      delimiter: ',',
      dynamicTyping: true,
      transformHeader: (header, index) => {
        return header.replace(' ', '').replace('#', 'Number')
      },
      complete: (result: { data: any[] }) => resolve(result.data),
      error: reject
    })
  })
}

;(async function() {
  const memberResult = await parse('./static/data/members.csv')
  const voteResult = await parse('./static/data/votes.csv')
  const proposalResult = await parse('./static/data/proposals.csv')

  const members: ParsedMember[] = memberResult.map(parseMember)
  const allVotes: ParsedVote[] = voteResult.map(parseVote)
  const proposals: ParsedProposal[] = proposalResult.map(
    (proposal: Proposal) => parseProposal(proposal, allVotes)
  )

  await fs.writeFile('./static/data/all.json', JSON.stringify({
    members: members,
    votes: allVotes,
    proposals: proposals,
  }, null, 2))
})().catch(console.error)
