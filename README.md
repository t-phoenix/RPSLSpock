# KlerosExerciseRPSLS

First Exercise D: Rock Paper Scissor Lizard Spock

A web3 website to play this extended version of rock paper scissors. (See wikipedia article about [RPS and additional weapons](https://en.wikipedia.org/wiki/Rock%E2%80%93paper%E2%80%93scissors#Additional_weapons))

![RPSLS Image](./rps-client/src/rps.jpeg)

It should allow a party to create a RPS game. The first party creates the game, puts a commitment of his move, selects the other player and stakes some ETH.
The second party pays the same amount of ETH and chooses his move.
The first party reveals his move and the contract distributes the ETH to the winner or splits them in case of a tie.
If some party stops responding there are some timeouts.

Original RPS Smart Contract by Clesaege - [link](https://github.com/clesaege/RPS/blob/master/RPS.sol)

Website [RPSLSpock](https://rpsl-spock.vercel.app/)

### Build With

- React + JavaScript
- Solidity Smart Contracts (RPS.sol, RPSRegisty.sol)
- Hardhat and Remix
- WalletConnect + Wagmi + Ethersv5
- Goerli Testnet (Chain Id: 5)

## Securing Game (SALT)

To handle not revealing Player1's move, we use salt method to hide the move.
We do this bu using public-private key method, used by Crypto wallets like metamask.

Player1 HODL private key as SALT, which is paired with it's counterpart public key and in turn Player1's move to compute the Move Hash.

Once Player2 is done with his/her move, Player1 reveals his Move and Secret Key, and the final result is calculated and payout is distributed.

## Mixed Strategy Nash Equilibria of this Game
