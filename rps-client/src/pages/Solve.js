import React from "react"
import "../styles/home.css";
import "../styles/pages.css";

import { useLocation, useNavigate } from "react-router-dom";
import MoveBox from "../components/MoveBox";
import { useContractReads, useSigner } from "wagmi";
import { RPS_ABI } from "../contracts/Info";
import {ethers} from 'ethers';
import toast, { Toaster } from "react-hot-toast";

export default function Solve(){
    const navigate = useNavigate();
    const {state} = useLocation();
    const signer = useSigner();
    const gameAddr = state;
    const [selectedMove, setSelectedMove] = React.useState('')
    const [salt, setSalt] = React.useState('')
    const [transaction, setTransaction] = React.useState('')

    const {data} = useContractReads({
        contracts:[
            {
                address: gameAddr,
                abi: RPS_ABI,
                functionName: "j1",
            },
            {
                address: gameAddr,
                abi: RPS_ABI,
                functionName: "j2"
            },
            {
                address: gameAddr,
                abi: RPS_ABI,
                functionName: "stake",
            },
        ]
    })
    
    let player1Addr;
    let player2Addr;
    let stakeAmt;
    if(data){
        console.log("Data:", data)
        player1Addr = data[0]
        player2Addr = data[1];
        stakeAmt = ethers.utils.formatEther(Number(data[2]));
    }

    async function solveGame(){
        const computedKey = ethers.utils.computeAddress(salt);
        try {
            const contract = new ethers.Contract(gameAddr, RPS_ABI, signer.data);
            const result = await contract.solve(selectedMove.id, computedKey);
            console.log("Result: ", result);
            setTransaction(result.hash)
            toast(`Transaction Succesful: ${result.hash} `)
        } catch (error) {
            console.log("Error: ", error)
            toast("Error while Solving Game")
        }
    }

    async function handleP1Timeout(){
        try {
            const contract = new ethers.Contract(gameAddr, RPS_ABI, signer.data);
            const result = await contract.j1Timeout();
            console.log("Transaction Result: ", result)
            toast(`Transaction: ${result.hash}`);
        } catch (error) {
            console.log("Error", error)
            toast(`Error sending Transaction`)
        }
    }

    

    return(
        <div className="main-content">
            <h1>Solve Game</h1>
            <div className="instruction-box">
                <p><b>Step1:</b> Player1 selects his original move</p>
                <p><b>Step2:</b> player1 enters the salt</p>
                <p><b>Step3:</b> Solve the Game</p>
            </div>

            <MoveBox selectedMove={selectedMove} updateFunction={setSelectedMove}/>

            {data && <div className="small-info">
                <h3>Game Contract: {gameAddr}</h3>
                <h3>Eligible Player: {player1Addr}</h3>
                <h2>Stake: {stakeAmt} ETH</h2>
            </div>
            }

            <div style={{width: '70%',display: "flex", flexDirection: 'row', marginBlock: '2%', justifyContent: 'center'}}>
                <h2 >Salt: </h2>
                <input 
                    value = {salt}
                    onChange={(e)=>{setSalt(e.target.value)}}
                    type="string"
                    placeholder="salt"
                    style={{
                        borderWidth: '2px',
                        borderColor: '#C0DA74',
                        borderRadius: '15px',
                        margin: "5px",
                        paddingInline: '10px' ,
                        backgroundColor: "transparent",
                        color: "#F5F4F5",
                        width: "40%",
                        fontSize: '24px'
                    }}
                />
            </div>

            <button onClick={solveGame}>SOLVE</button>
            {transaction && <p>Transaction Hash: {transaction}</p>}
            
            <div className="small-info" style={{width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginBlockStart: '2%' }}>
                <button onClick={handleP1Timeout}>P1 timeout</button>
                <p>can be used by Player2, if player1 exceeded timeout (5 mins)</p>
                <p>Player 2 receives full payout</p>
                <p>Beneficiary Address: {player2Addr}</p>
            </div>

            <Toaster toastOptions={{style: {width: '80%'}}}/>

        </div>
    )
}