# Design Pattern Decision #

## Avoid state changes after external call ##
See: https://consensys.github.io/smart-contract-best-practices/recommendations/#avoid-state-changes-after-external-calls
- Most external contract calls in this project is called near the end of the function. 

## Use modifiers only for checks ##
See: https://consensys.github.io/smart-contract-best-practices/recommendations/#use-modifiers-only-for-checks
- Modifiers in this project are used for checks only.

## Prevent transfer to 0x0 address ##
See: https://consensys.github.io/smart-contract-best-practices/tokens/#prevent-transferring-tokens-to-the-0x0-address
- OpenZeppelin token contracts has been written to avoid transfer to 0x0 address except for burning token.

## Emergency Stop/Circuit Breaker Pattern ##
See: https://consensys.github.io/smart-contract-best-practices/software_engineering/#circuit-breakers-pause-contract-functionality
- The smart contracts utilizes [OpenZeppelin's Pausable](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/lifecycle) contract for emergency stop.

## Upgradability ##
See: https://consensys.github.io/smart-contract-best-practices/software_engineering/#upgrading-broken-contracts
- This project utilizes [OpenZeppelin SDK](https://openzeppelin.com/sdk/) upgradable contract pattern.

## Guard Check ###
See: https://github.com/fravoll/solidity-patterns/blob/master/docs/guard_check.md
- It uses several `modifiers` and `requires` to ensure it has correct execution.

## Randomness + Oracle ##
See: https://github.com/fravoll/solidity-patterns/blob/master/docs/randomness.md
- The contract uses previous blockhash and Rhombus oracle as source of random number to generate tokenId.

## Lock pragma to specific compiler version ##
See: https://consensys.github.io/smart-contract-best-practices/recommendations/#lock-pragmas-to-specific-compiler-version
- Main contracts in this project is locked to solc 0.5.8

## Other Remarks ##
- I was interested to implement [ERC721x](https://erc721x.org/) for this project, but due to OpenZeppelin contracts has more clearer code, I decided to go with OpenZeppelin's implementation with OpenZeppelin SDK upgradable pattern to open the possibility to use ERC721x in the future.

- There are two possible algorithm for `makingChange` (Greedy and Dynamic Programming), I decided to use these algorithms to demonstrate OpenZeppelin SDK upgradable pattern. And this upgradable pattern heavily utilize inheritance behaviour in Solidity, thus the project is implemented in Solidity language rather than Vyper or LLL.

- The function `makingChange` is an internal function, first consideration is to use `view` function for it. But, after I checked the gas cost for a contract to call view function and normal function is the same, I decided to use normal function instead so it can enable gas optimization for Dynamic Programming approach.