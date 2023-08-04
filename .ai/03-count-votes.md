To execute Step 3, you'll need to create a user interface for voting. Here's a general outline of how you could approach this in React:

1. Create a Candidates Context: This context will store the list of candidates that have voted in the past 6 months. This list will be updated as the user votes on different proposals.

2. Create a UserVotes Context: This context will store the user's votes.

3. Create a Proposal Component: This component will display a proposal and allow the user to vote on it. It will use the "ForumID" field of the proposal to display an iframe with the vote screen.

4. Create a Proposals Component: This component will display a list of proposals and allow the user to select one to vote on. It will use a strategy to determine which proposal to display next.

5. Update your App Component: Use the contexts and components you've created in your App component.

This is a basic outline and you'll need to fill in the details based on your specific requirements and data. 
The iframe has CSP protections. I don't need anything from the iframe, are there attributes I can use to avoid problems?

Yes, you can use the sandbox attribute on the iframe to apply extra restrictions and avoid problems related to Content Security Policy (CSP). The sandbox attribute enables an extra set of restrictions for the content in the iframe.

Here's how you can modify the Proposal component to include the sandbox attribute:

In the sandbox attribute, you can include space-separated tokens that lift particular restrictions. In this case, allow-scripts allows the content to run scripts, and allow-same-origin allows the content to maintain its origin; you can remove or add more depending on your needs.

Please note that using the sandbox attribute is a good practice to isolate potentially malicious documents via setting an iframe sandbox, but it might not be a silver bullet for all iframe related CSP issues. You might still need to adjust your CSP settings if you encounter further issues. 
Great. Can you produce a widget to list all the votes, adding a button to "persist" the vote to localstorage, and another to "forget" the choice?

Sure, you can create a new component to list all the votes. You can use the localStorage API to persist and forget the votes. Here's how you can modify your code:

In this code, VoteList is a new component that lists all the votes. It uses two useEffect hooks to load the votes from localStorage when the component mounts and save the votes to localStorage whenever they change. The handlePersist function is used to manually save the votes to localStorage, and the handleForget function is used to remove the votes from localStorage and reset the userVotes state.

You can include this new VoteList component in your ShowVoteOnProposals component or anywhere else in your app where you want to display the list of votes. 
I'm getting the error "Uncaught TypeError: import_react3.useContext(...) is undefined"; why could that be?

The error message "Uncaught TypeError: import_react3.useContext(...) is undefined" typically indicates that the value you're trying to access from the context is not defined.

In your case, it seems like the UserVotesContext might not be providing the userVotes and setUserVotes values correctly.

Here are a few things you can check:

1. Check the definition of UserVotesContext: Make sure that you're providing the userVotes and setUserVotes values correctly in your context provider.

2. Check the import of UserVotesContext: Make sure that you're importing the UserVotesContext from the correct file and that the export in that file is correct.

3. Check the usage of UserVotesContext: Make sure that the VoteList component is wrapped with the UserVotesContext.Provider in the component tree. If the VoteList component is not within a UserVotesContext.Provider, the context will be undefined.

If you've checked all of these and you're still seeing the error, there might be an issue with your React setup. You might need to reinstall your node_modules or check your version of React. The useContext hook is only available in React 16.8.0 and later. 
