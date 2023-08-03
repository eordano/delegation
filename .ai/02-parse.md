It seems like you have provided a detailed setup for parsing the CSV data according to your needs. Your TypeScript functions to parse members, votes, and proposals look well-structured and ready to use.

However, the code you provided doesn't include the reading and parsing of the CSV files themselves. To accomplish that, you could use a library like `Papaparse` or manually read and split the files line by line.

Here's a sample code snippet that shows how to parse the CSV files and then apply your parsing functions:

```typescript
import * as Papa from 'papaparse';
import { parseMember, parseVote, parseProposal } from './src/parseData'

// Parsing members.csv
Papa.parse('/data/members.csv', {
    header: true,
    dynamicTyping: true,
    complete: (result) => {
        const members: Record<string, ParsedMember> = {};
        result.data.forEach((member: Member) => {
            members[member.Member] = parseMember(member);
        });

        // Parsing votes.csv
        Papa.parse('/data/votes.csv', {
            header: true,
            dynamicTyping: true,
            complete: (result) => {
                const allVotes: ParsedVote[] = result.data.map((vote: Vote) => parseVote(vote, members));

                // Parsing proposals.csv
                Papa.parse('/data/proposals.csv', {
                    header: true,
                    dynamicTyping: true,
                    complete: (result) => {
                        const proposals: ParsedProposal[] = result.data.map((proposal: Proposal) => parseProposal(proposal, allVotes));

                        // Now members, allVotes, and proposals contain the parsed data
                        console.log(members, allVotes, proposals);
                    }
                });
            }
        });
    }
});
```

Note that this example assumes that the CSV files are available at the specified paths and that the field names in the CSV files match those in your TypeScript types (`Member`, `Vote`, `Proposal`). You will need to adjust the file paths and possibly the field names as per your actual data.

Make sure to install `Papaparse` if you decide to use it:

```bash
npm install papaparse
```

This code will asynchronously parse the CSV files and apply your transformations, printing the results to the console. From there, you can handle the data as needed for your specific optimization problem.
