import React from "react"
import "../styles/home.css";
import "../styles/pages.css";
import { useLocation, useNavigate } from "react-router-dom";
import MoveBox from "../components/MoveBox";
import {writeContract, prepareWriteContract} from "@wagmi/core"
import { useContractReads, useSigner } from "wagmi";
import { RPS_ABI } from "../contracts/Info";
import {ethers} from 'ethers';
import { Toaster, toast } from "react-hot-toast";

export default function Player2(){
    const navigate = useNavigate();
    const signer = useSigner();
    const {state} = useLocation();
    const gameAddr = state;
    const [selectedMove, setSelectedMove] = React.useState('');

    const { data, isError, isLoading, error } = useContractReads({
        contracts: [
            {
                address: gameAddr,
                abi: RPS_ABI,
                functionName: "stake",
            },
            {
                address: gameAddr,
                abi: RPS_ABI,
                functionName: "j1"
            },
            {
                address: gameAddr,
                abi: RPS_ABI,
                functionName: "j2"
            }
        ]     
      });
    console.log("Contract Reads: ", data);
    let betAmount;
    let player1;
    let player2;
    if(data){
        console.log("Stake Amount: ", ethers.utils.formatEther(Number(data[0])));
        betAmount = ethers.utils.formatEther(Number(data[0]))
        player1 = data[1];
        player2 = data[2];
    }
    
    

    async function handlePlay2(){
        console.log("Input Variables")
        console.log("Selected MOve:", selectedMove.id)
        console.log("Value: ", Number(data[0]))

        try {
            const contract = new ethers.Contract(gameAddr, RPS_ABI, signer.data);
            console.log("Contract: ", contract);

            const result = await contract.play(selectedMove.id, {value: Number(data[0])});
            console.log("Transaction Result : ", result)

            toast(`Transaction: ${result.hash}`)
            
        } catch (error) {
            console.log("Error while play 2 ", error)
            toast(`Error Sending Transaction`)
        }
        
    }

    async function handleP2Timeout(){
        try {
            const contract = new ethers.Contract(gameAddr, RPS_ABI, signer.data);
            const result = await contract.j2Timeout();
            console.log("Transaction Result: ", result)

            toast(`Transaction: ${result.hash}`);
        } catch (error) {
            console.log("Error", error)
            toast(`Error sending Transaction`)
        }
    }
    

    return(
        <div className="main-content">
            <h1>Player 2</h1>
            <div className="instruction-box">
                <p><b>Step1:</b> Choose a move</p>
                <p><b>Step2:</b> Play with equal ether</p>
            </div>

            
            <MoveBox selectedMove={selectedMove} updateFunction={setSelectedMove}/>
            {data && <div>
                <h3>Game Contract: {gameAddr}</h3>
                <h3>Eligible Player: {player2}</h3>
                <h2>Amount to Bet: {betAmount} ETH</h2>
            </div>}
            
            
            <button onClick={handlePlay2}>PLAY</button>

            <div style={{width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginBlockStart: '2%' }}>
                <button onClick={handleP2Timeout}>P2 timeout</button>
                <p>can be used by Player1, if player2 exceeded timeout (5 mins)</p>
                <p>Beneficiary Addr: {player1}</p>
            </div>

            <Toaster toastOptions={{style: {width: '80%'}}}/>

        </div>
    )
}