## Questions

### What issues, if any, did you find with the existing code?
  - The withdraw and deposit code is almost identical and could be combined into one component with different props,
  - There is very little error handling present and it doesn't accurately describe the errors
  - Using typescript but not defining types for state values
  - Created state for account in app, assigned the prop to a state value in another prop then updated that state in the child component
  - Had to use `docker compose build` instead of `docker run build` to properly build the project
### What issues, if any, did you find with the request to add functionality?
  - Some withdraw rules conflict(5$ rule and withdraw limits) and there is no info about which rule should take priority
  - The withdraw and deposit limits are very restrictive considering the amount of money being handled by most of the accounts

### Would you modify the structure of this project if you were to start it over? If so, how?
  I don't think so. I've never worked on a project that has the api and ui together and I think it's very convenient to run one set of commands and have everything spin up by itself. Also seems convenient for releases as well
### Were there any pieces of this project that you were not able to complete that you'd like to mention?

### If you were to continue building this out, what would you like to add next?
  - Clean up UI a bit
      add confirmation to depositing or withdrawing money
      Format the money ($1,000.00 instead of $1000)
      Allow submitting by pressing enter
  - Create a transaction history page
### If you have any other comments or info you'd like the reviewers to know, please add them below.
  - To test the $400 limit within a single day I made it so there's is a 2 minute period where account #1 will only be able to withdraw $150. After that two minutes, all withdrawals (aside from ones you've made from testing) will fall out of the 24 hour period