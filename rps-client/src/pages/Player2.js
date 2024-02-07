import React from "react";
import "../styles/home.css";
import "../styles/pages.css";
import { useLocation } from "react-router-dom";
import MoveBox from "../components/MoveBox";
import {
  useBlockNumber,
  useContractReads,
  useSigner,
  useProvider,
  useAccount,
} from "wagmi";
import { RPS_ABI } from "../contracts/Info";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import { validateMove } from "../services/validations";
import Timer from "../components/Timer";

export default function Player2() {
  const account = useAccount();
  const signer = useSigner();
  const provider = useProvider();
  const { state } = useLocation();
  const gameAddr = state.contract;
  console.log("Signer Account:", signer);

  const [selectedMove, setSelectedMove] = React.useState("");
  const [currntTimestamp, setCurrentTimestamp] = React.useState();
  const [timeLeft, setTimeLeft]= React.useState(0);

  let betAmount, player1, player2, lastAction, TIMEOUT;

  const { data} = useContractReads({
    contracts: [
      {
        address: gameAddr,
        abi: RPS_ABI,
        functionName: "stake",
      },
      {
        address: gameAddr,
        abi: RPS_ABI,
        functionName: "j1",
      },
      {
        address: gameAddr,
        abi: RPS_ABI,
        functionName: "j2",
      },
      {
        address: gameAddr,
        abi: RPS_ABI,
        functionName: "lastAction",
      },
      {
        address: gameAddr,
        abi: RPS_ABI,
        functionName: "TIMEOUT",
      },
    ],
  });
  console.log("Contract Reads: ", data);
  if (data) {
    console.log("Stake Amount: ", ethers.utils.formatEther(Number(data[0])));
    betAmount = ethers.utils.formatEther(Number(data[0]));
    player1 = data[1];
    player2 = data[2];
    lastAction = Number(data[3]);
    TIMEOUT = data[4];
  }

  let currentBlock = useBlockNumber();
  console.log("Current block: ", currentBlock.data, currentBlock);

  React.useEffect(() => {
    getBlockTimestamp();
  });

  async function getBlockTimestamp() {
    console.log("HELLO RUNNING....", currentBlock);
    const result = await provider.getBlock(currentBlock.data);
    console.log("CURRENT TIMESTAMP =====> ", result, result.timestamp);
    setCurrentTimestamp(result.timestamp);
    if(result.timestamp < lastAction+300){
        setTimeLeft((lastAction+300) - result.timestamp)
    }
  }

  async function handlePlay2() {
    console.log("Input Variables");
    console.log("Selected MOve:", selectedMove.id);
    console.log("Value: ", Number(data[0]));
    let isValidMove = validateMove(selectedMove.id);

    if(signer == null){
        toast('Signer Not Found, check connection and refresh')
    }

    if (account.address !== player2) {
      toast("Connected account is not an eligible player");
    }

    if (!isValidMove) {
      toast("Please select a valid Move");
    } else {
      try {
        const contract = new ethers.Contract(gameAddr, RPS_ABI, signer.data);
        console.log("Contract: ", contract);

        const result = await contract.play(selectedMove.id, {
          value: Number(data[0]),
        });
        console.log("Transaction Result : ", result);

        toast(`Transaction: ${result.hash}`);
      } catch (error) {
        console.log("Error while play 2 ", error);
        toast(`Error Sending Transaction`);
      }
    }
  }

  async function handleP2Timeout() {
    try {
      const contract = new ethers.Contract(gameAddr, RPS_ABI, signer.data);
      const result = await contract.j2Timeout();
      console.log("Transaction Result: ", result);

      toast(`Transaction: ${result.hash}`);
    } catch (error) {
      console.log("Error", error);
      toast(`Error sending Transaction`);
    }
  }

  return (
    <div className="main-content">
      <h1>Player 2</h1>
      <div className="instruction-box">
        <p>
          <b>Step1:</b> Choose a move
        </p>
        <p>
          <b>Step2:</b> Play with equal ether
        </p>
      </div>

      <MoveBox selectedMove={selectedMove} updateFunction={setSelectedMove} />
      {data && (
        <div className="small-info">
          <h3>Game Contract: {gameAddr}</h3>
          <h3>Eligible Player: {player2}</h3>
          <h2>Amount to Bet: {betAmount} ETH</h2>
          <div className="small-box">
            <p>CONTRACT TIMESTAMP: {lastAction}</p>
            <p>CURRENT TIMESTAMP: {currntTimestamp}</p>
          </div>
        </div>
      )}

      <button onClick={handlePlay2}>PLAY</button>

      {(lastAction + 300 < currntTimestamp || timeLeft===0) && account.address === player1 ? (
        <div
          className="small-info"
          style={{
            width: "80%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            marginBlockStart: "2%",
          }}
        >
          <button onClick={handleP2Timeout}>P2 timeout</button>
          <p>can be used by Player1, if player2 exceeded timeout (5 mins)</p>
          <p>Beneficiary Addr: {player1}</p>
        </div>
      ) : (
        <Timer initialMinute={Math.floor(timeLeft/60)} initialSeconds={timeLeft%60}/>
      )}
    </div>
  );
}
