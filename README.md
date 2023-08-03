# Stage 2: Setting up cursor.sh

Delegation is a simple HTML+JS single page application built with React and Typescript to help me with an optimization problem.

The problem: Pick 20 delegates out of a set of candidates to delegate my votes to.

The system in question is an Ethereum-based DAO, and I can distribute my "voting power" (similar to shares) across a number of users that I feel would vote similarly to me. In order to do that, I have a transparent list of who voted for what across time.

The data is in the following format, in the shape of three CSV files served from `/data/{members,votes,proposals}.csv

members.csv sample rows (out of ~4316):
```
Member	Total VP	MANA VP	LAND VP	NAMES VP	Delegated VP	L1 Wearables VP	Rental VP	Has Delegated	Delegate	Has Delegators	Delegators Amount	Delegators	Avatar Preview
0x30b1f4bd5476906f38385b891f2c09973196b742	1,026	0	0	600	0	426	0	TRUE	0x0f051a642a1c4b2c268c7d6a83186159b149021b	FALSE	0		https://wearable-preview.decentraland.org/?profile=0x30b1f4bd5476906f38385b891f2c09973196b742
0xd689478d44a438798ee0dc07657cce2135c0aef7	20,079	779	18,000	1,300	0	0	0	FALSE		FALSE	0		https://wearable-preview.decentraland.org/?profile=0xd689478d44a438798ee0dc07657cce2135c0aef7
0x862f109696d7121438642a78b3caa38f476db08b	4,251	4,151	0	100	0	0	0	TRUE	0x5e382071464a6f9ea29708a045983dc265b0d86d	FALSE	0		https://wearable-preview.decentraland.org/?profile=0x862f109696d7121438642a78b3caa38f476db08b
```

votes.csv sample rows (out of ~62174):
```
Member	Snapshot ID	Created	Proposal Title	Choice #	Choice	Vote Weight	Total VP	MANA VP	Names VP	LAND VP	Delegated VP	L1 Wearables VP	Rental VP
0x0D0665AC1553822812C721Ba18F98075745c7324	QmYbA6Teu2B7KFc9kJM5gBya7yWVEuTEfukqwVADoAy6A6	2021-06-01T19:30:53.000Z	Split LAND and MANA Voting power into 50% each, same weight	1	YES	9.683306502	28,000	28,000	0	0	0	0	0
0x148BB53F3759B4664AC41a9A4D1BE52746f1565e	Qmc6fwrpgiMTP8CjSaugqFsa6gXYC7cJKquKYnihKQW9AM	2021-06-02T17:48:16.000Z	Proposal for the Decentraland Foundation to receive deploy permissions on road parcels	1	Grant the Foundation "update manager" permissions for the DAO's LAND and Estates	0.002570331757	13	13	0	0	0	0	0
0xd689478d44A438798EE0DC07657CcE2135c0AeF7	QmUyJB7rrd4ExW1b8GXYbdFrhVFgAaoszzZLv4jLWqTiCL	2021-05-24T15:38:54.000Z	Add the location 111,-23 to the Points of Interest	1	yes	2.178653562	17,035	9,035	0	8,000	0	0	0
```

proposals.csv sample rows (out of ~1879):
```
Proposal ID	Snapshot ID	Author	Type	Title	Started	Ended	Threshold	Status	Forum Topic	Total VP	MANA VP	LAND VP	NAMES VP	DELEGATED VP	Votes
51794290-30fb-11ee-9309-9f2674902254	0xa27812071a8601ed2f3a11a457d8f094a5d7b4dba47e453210212b602e60b0d0	0xd8330e0bae6ce5877b1d961eeb3ac3152a9e99dd	poi	Add the location 150,145 to the Points of Interest	2023-08-02T06:10:00.689Z	2023-08-09T06:10:00.688Z	500000	active	20094	5,996	23	0	100	5,873	13
78bacea0-2fa2-11ee-a512-65477fceb1b0	0x9333d345617ec0547ed38f5a626454145b5046b05e976c513ed47ef9135be15c	0x247e0896706bb09245549e476257a0a1129db418	poll	Should the Community Be the Final Arbiter in Grants Revocation Decisions ?	2023-07-31T13:02:00.178Z	2023-08-05T13:02:00.177Z	500000	active	20062	1,239,927	6,155	24,000	24,400	1,181,306	65
527ec930-2fde-11ee-a512-65477fceb1b0	0xe286e5292dfa07f3d485c36555a0c2d90ee2d1ce5bd83247cca48d6e3a979c03	0xe5cf1bb88a59f9fc609689c681d1d14bfe7ce73a	grant	Decentraland University Live Teaching Platform	2023-07-31T20:10:00.835Z	2023-08-14T20:10:00.834Z	6800000	active	20065	6,379,236	34,902	62,000	125,700	6,080,690	64
4e57fe70-3084-11ee-a512-65477fceb1b0	0x6a779076aa6e7f27c53285dde222b2f54149b1edf6364ce86c26810f5cd3ce0b	0x0636211443e91468ee3657e1d7faede7059c4843	governance	Should Grant Request Proposals require at least 100 VP to submit?	2023-08-01T15:58:00.328Z	2023-08-15T15:58:00.327Z	6000000	active	20081	2,641,025	4,094	26,000	147,500	2,391,404	49
```

This is the plan to build the app:

### Step 1: Setting up the Environment and Loading the Data [DONE]
- **Toolset**: React, Typescript, node.js, Express, esbuild
- **Loading Data**: Simple fetch from javascript of the CSV files

Files: 'src/index.tsx' contains the base App component and rendering, `static/index.html` contains the base HTML, `index.ts` in the root folder contains the server-side code.

### Step 2: Analyzing the data, Filtering Proposals and Gathering Choices
- **Creating Typescript Types**: From the samples, create raw types from what is read in the CSVs into `src/csvTypes.ts` and the combined, parsed data types in `src/types.ts` [CURRENT]
- **Filtering Proposals**: From the "proposals.csv" file, we'll filter out the proposals from the past 6 months.
- **Gathering Choices**: We'll need to join this data with the "votes.csv" to get the different choices for each proposal.

### Step 3: User Voting Interface
- **Voting Interface**: We'll create an interface allowing you to vote on or skip each proposal. As you make your selections, we'll keep track of your choices.

### Step 4: Analyzing Similarities
- **Finding Similarities**: We'll compare your choices with those in the "votes.csv" file to find the top 40 candidates who voted similarly.
- **Summarizing Similarities and Differences**: We'll summarize which proposals you and each of the top 40 candidates voted similarly or differently.

### Step 5: Displaying Results
- **Summary Display**: We'll create a component to display the summary of the top 40 candidates, highlighting similarities and differences.
