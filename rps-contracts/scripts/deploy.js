// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `yarn hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const ethers = require('ethers');
const RPS_ABI = require('../artifacts/contracts/RPS.sol/RPS.json');

async function main() {
    const accounts = await hre.ethers.getSigners();
    const player1 = accounts[0].address;
    const player2 = accounts[1].address;

    console.log("Player1: ", player1);
    console.log("Player2: ", player2);

    const salt = "0x081C72c22cA0b69B0A047877318637E8254FEBFc";
    const P1move = "Lizard"; //3
    const P2move = "Spock"; //4
    // 0: null
    // 1: Rock
    // 2: Paper
    // 3: Scissors
    // 4: Spock
    // 5: Lizard
    const lockedAmount = hre.ethers.parseEther("1");
    
    // const c1Hash = await hre.ethers.utils.keccak256(P1move, salt)
    const c1Hash = ethers.solidityPackedKeccak256(["uint8", "uint256"],[5, salt]);


    console.log("C1Hash: ", c1Hash);

    //DEPLOY CONTRACT
    const rps = await hre.ethers.deployContract("RPS", [c1Hash, player2], {value: lockedAmount});
    console.log("Rock Paper Scissor contract:", rps.target);
    const rpsBalance = await hre.ethers.provider.getBalance(rps.target)
    console.log("RPS Contract Balance: ", rpsBalance);

    //PLAYER 2 TURN
    await rps.connect(accounts[1]).play(4, {value: lockedAmount});
    const rpsBalance2 = await hre.ethers.provider.getBalance(rps.target)
    console.log("Updated RPS Contract Balance: ", rpsBalance2);

    //GETTING PLAYER BALANCES
    for (let index = 0; index < 2; index++) {
        const balance = await hre.ethers.provider.getBalance(accounts[index].address);
        console.log("Account ", index, " balance: ", balance);
    }

    //QUERYING DATA
    const c1HashStored = await rps.c1Hash();
    console.log("Stored Value of C1 Hash", c1Hash)
    const c2 = await rps.c2();
    console.log("Player 2 Move: ", c2);

    
    //SOLVING GAME
    const result = await rps.solve(5, salt);
    console.log("SOLVING GANE RESULT TRANSACTION: ", result);
    const rpsBalance3 = await hre.ethers.provider.getBalance(rps.target)
    console.log("Final RPS Contract Balance: ", rpsBalance3);


    //GETTING PLAYER BALACES
    for (let index = 0; index < 2; index++) {
        const balance = await hre.ethers.provider.getBalance(accounts[index].address);
        console.log("Account ", index, " balance: ", balance);
    }


}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  