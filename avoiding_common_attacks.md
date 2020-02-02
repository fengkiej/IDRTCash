# Avoiding Common Attacks #

- Most attacks are utilizing the fallback mechanism in Solidity, the external calls for this project are only to trusted contracts (Corresponding ERC20 and Rhombus). So, it less likely to be attacked from attacks that uses fallback mechanism.

- Use `require` when calling external contract to avoid [Insufficient gas griefing](https://consensys.github.io/smart-contract-best-practices/known_attacks/#insufficient-gas-griefing) to ensure that the external call has been successfully called.

- Use of Rhombus Oracle and previous blockhash as source of randomness to prevent tokenId hash targeting.

- Create various test to ensure contract behaves as intended.

- Use of [Mythril](https://github.com/ConsenSys/mythril) to check for vulnerabilities in smart contracts.