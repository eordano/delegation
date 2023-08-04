# delegation

An application to pick voting delegates based on a set of votes and historic information.

[Check it out live at eordano.github.io/delegation!](https://eordano.github.io/delegation/) It's not the prettiest, but contributions are welcome.

## Getting started

0. Install, if you don't have them, `git` and `npm`
1. Clone the repo with `git pull https://github.com/eordano/delegation`
2. Run `npm install`
3. Run `npm start`
4. Go to `http://localhost:7890`

## Updating the database

The repo contains a snapshot of all votes as of August 2nd, 2023. These instructions allow one to update the dataset.

1. Replace the files `members.csv`, `proposals.csv`, and `votes.csv` on `static/data/` with the CSV exports from this Google Spreadsheet: [Decentraland DAO Transparency Data](https://docs.google.com/spreadsheets/d/1FoV7TdMTVnqVOZoV4bvVdHWkeu4sMH5JEhp8L0Shjlo/edit#gid=624625832). The sheets used are the second, third, and fourth ones.
2. Run `npm run update`, which will regenerate `static/data/all.json`.
3. Sit tight, as it takes my moderately high powered computer about a minute to build this file.

## About

Delegation is a simple HTML+JS single page application built with React and Typescript to help with an optimization problem of picking N delegates out of a set of candidates to delegate votes to.

The system in question is an Ethereum-based DAO, and one can distribute their "voting power" (similar to shares) across a number of users that would vote similarly. The data about historical votes is available from

This is the plan to build the app:

### Step 1: Setting up the Environment and Loading the Data 
- **Toolset**: React, Typescript, node.js, Express, esbuild
- **Loading Data**: Simple fetch from javascript of the CSV files

Files: 'src/index.tsx' contains the base App component and rendering, `static/index.html` contains the base HTML, `index.ts` in the root folder contains the server-side code, `types.ts` contains the actual shape of the parsed votes, members, and proposals.

### Step 2: Analyzing the data, Filtering Proposals and Gathering Choices
- **Creating Typescript Types**: the raw types from what is read in the CSVs the final database with nested types is stored in `src/types.ts`, loaded in `src/index.tsx` according to `src/loadData.ts`.
- **Filtering Proposals**: `src/index.tsx` filters out the proposals from the past 6 months

### Step 3: User Voting Interface
- **Set of candidates**: Starting with all the members that have voted in the past 6 months, this set will be updated with each user vote according to the number of coincidences on different proposals.
- **Selection of next proposal**: In order to show a relevant vote to the user, different strategies could be used:
  - Proposal with the most votes: a proposal that has voted on by many members is likely to provide a lot of information on what the members generally vote on
  - Proposal to differentiate the set of candidates: a proposal that splits up the set of candidates in as many groups as possible provides information about how various members would vote in comparison to other members.
- **Showing the Proposal and asking the user to vote**: Keep track of the user's choices and display an isolated iframe with the vote screen, as much of the information and discussion data is not included in the database. Use the field "ForumID" of the pproposal.

### Step 4: Analyzing Similarities
- **Finding Similarities**: We'll compare your choices with those in the "votes.csv" file to find the top 40 candidates who voted similarly.
- **Summarizing Similarities and Differences**: We'll summarize which proposals you and each of the top 40 candidates voted similarly or differently.

### Step 5: Displaying Results
- **Summary Display**: We'll create a component to display the summary of the top 40 candidates, highlighting similarities and differences.
  - This should include the avatar, name, and titles of the proposals in which the user agrees upon.

### Data Source

The data is in the following format, in the shape of three CSV files served from `/data/{members,votes,proposals}.csv

members.csv sample row (out of ~4316):
```
Member	Total VP	MANA VP	LAND VP	NAMES VP	Delegated VP	L1 Wearables VP	Rental VP	Has Delegated	Delegate	Has Delegators	Delegators Amount	Delegators	Avatar Preview
0x30b1f4bd5476906f38385b891f2c09973196b742	1,026	0	0	600	0	426	0	TRUE	0x0f051a642a1c4b2c268c7d6a83186159b149021b	FALSE	0		https://wearable-preview.decentraland.org/?profile=0x30b1f4bd5476906f38385b891f2c09973196b742
```

votes.csv sample row (out of ~62174):
```
Member	Snapshot ID	Created	Proposal Title	Choice #	Choice	Vote Weight	Total VP	MANA VP	Names VP	LAND VP	Delegated VP	L1 Wearables VP	Rental VP
0x0D0665AC1553822812C721Ba18F98075745c7324	QmYbA6Teu2B7KFc9kJM5gBya7yWVEuTEfukqwVADoAy6A6	2021-06-01T19:30:53.000Z	Split LAND and MANA Voting power into 50% each, same weight	1	YES	9.683306502	28,000	28,000	0	0	0	0	0
```

proposals.csv sample row (out of ~1879):
```
Proposal ID	Snapshot ID	Author	Type	Title	Started	Ended	Threshold	Status	Forum Topic	Total VP	MANA VP	LAND VP	NAMES VP	DELEGATED VP	Votes
4e57fe70-3084-11ee-a512-65477fceb1b0	0x6a779076aa6e7f27c53285dde222b2f54149b1edf6364ce86c26810f5cd3ce0b	0x0636211443e91468ee3657e1d7faede7059c4843	governance	Should Grant Request Proposals require at least 100 VP to submit?	2023-08-01T15:58:00.328Z	2023-08-15T15:58:00.327Z	6000000	active	20081	2,641,025	4,094	26,000	147,500	2,391,404	49
```

## Copyright
This code can be copied, modified, and distributed under the terms of the MIT Open Source License (see LICENSE).