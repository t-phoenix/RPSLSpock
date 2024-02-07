import React from "react"
import "../styles/home.css";
import "../styles/pages.css";

import { useLocation, useNavigate } from "react-router-dom";
import MoveBox from "../components/MoveBox";
import { useAccount, useBlockNumber, useContractReads, useProvider, useSigner } from "wagmi";
import { RPS_ABI } from "../contracts/Info";
import {ethers} from 'ethers';
import toast from "react-hot-toast";
import { validateMove, validateSalt } from "../services/validations";
import Timer from "../components/Timer";

export default function Solve(){
    const navigate = useNavigate();
    const account = useAccount();
    const {state} = useLocation();
    const signer = useSigner();
    const provider = useProvider();
    const gameAddr = state.contract;
    const [selectedMove, setSelectedMove] = React.useState('')
    const [salt, setSalt] = React.useState('')
    const [transaction, setTransaction] = React.useState('')
    const [currntTimestamp, setCurrentTimestamp] = React.useState();
    const [timeLeft, setTimeLeft]= React.useState(0);



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
            {
                address: gameAddr,
                abi: RPS_ABI,
                functionName: "lastAction",
            },
        ]
    })
    
    let player1Addr;
    let player2Addr;
    let stakeAmt;
    let lastAction;
    if(data){
        console.log("Data:", data)
        player1Addr = data[0]
        player2Addr = data[1];
        stakeAmt = ethers.utils.formatEther(Number(data[2]));
        lastAction = Number(data[3])
    }

    let currentBlock = useBlockNumber()
    console.log('Current block: ', currentBlock.data ,currentBlock);
    

    React.useEffect(()=>{
        getBlockTimestamp()
        const salt = localStorage.getItem(`${gameAddr}`)
        setSalt(salt)
    },[])

    async function getBlockTimestamp(){
        console.log("HELLO RUNNING....", currentBlock)
        const result = await provider.getBlock(currentBlock.data)
        setCurrentTimestamp(result.timestamp)
        if(result.timestamp < lastAction+300){
            setTimeLeft((lastAction+300) - result.timestamp)
        }
    }


    async function solveGame(){
        let isValidMove = validateMove(selectedMove.id);
        let isValidSalt = validateSalt(salt);

        if(account.address != player1Addr){
            toast("Connect account is not an eligible player")
        }
        if (!isValidMove) {
            toast("Select a Valid Move")
        }
        if(!isValidSalt){
            toast('Enter a Valid Salt')
        }

        if(isValidMove && isValidSalt){
            const computedKey = ethers.utils.computeAddress(salt);
            try {
                const contract = new ethers.Contract(gameAddr, RPS_ABI, signer.data);
                const result = await contract.solve(selectedMove.id, computedKey);
                setTransaction(result.hash)
                toast(`Transaction Succesful: ${result.hash} `)
            } catch (error) {
                toast("Error while Solving Game")
            }
        }
    }

    async function handleP1Timeout(){
        try {
            const contract = new ethers.Contract(gameAddr, RPS_ABI, signer.data);
            const result = await contract.j1Timeout();
            toast(`Transaction: ${result.hash}`);
        } catch (error) {
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
                <div className="small-box">
                    <p>CONTRACT TIMESTAMP: {lastAction}</p>
                    <p>CURRENT TIMESTAMP: {currntTimestamp}</p>
                </div>
            </div>
            }

            <div className="row-box-left" style={{justifyContent: 'center'}}>
                <h2 >Salt: </h2>
                <input 
                    value = {salt}
                    onChange={(e)=>{setSalt(e.target.value)}}
                    type="string"
                    placeholder="salt"
                    className="input-box"
                />
            </div>

            <button onClick={solveGame}>SOLVE</button>
            {transaction && <p>Transaction Hash: {transaction}</p>}
            
            {(lastAction+300 < currntTimestamp || timeLeft === 0) && account.address == player2Addr ? <div className="small-info" style={{width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginBlockStart: '2%' }}>
                <button onClick={handleP1Timeout}>P1 timeout</button>
                <p>can be used by Player2, if player1 exceeded timeout (5 mins)</p>
                <p>Player 2 receives full payout</p>
                <p>Beneficiary Address: {player2Addr}</p>
            </div> : <></>}



        </div>
    )
}