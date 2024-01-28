import React from "react"
import "../styles/home.css";
import "../styles/pages.css";
import { useNavigate } from "react-router-dom";
import MoveBox from "../components/MoveBox";
import {ethers, Wallet} from 'ethers';
import {prepareWriteContract, writeContract} from "@wagmi/core";
import { RPS_ABI, RPS_Bytecode, RPSRegistry_ABI, RPSRegistryAddr } from "../contracts/Info";
import { useSigner  } from "wagmi";
import toast, { Toaster } from 'react-hot-toast';
import { formatAddress } from "../services/Formatter";
import {CopyToClipboard} from 'react-copy-to-clipboard'


export default function Start(){
    const signer = useSigner()


    const navigate = useNavigate();
    const [selectedMove, setSelectedMove] = React.useState('');
    const [playerAddr, setPlayerAddr] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [salt, setSalt] = React.useState('');
    const [publicKey, setPublicKey] = React.useState('');

    const [contractAddr, setContractAddr] = React.useState(null);

    function generateSalt(){
        const wallet = Wallet.fromMnemonic(
            ethers.utils.entropyToMnemonic(ethers.utils.randomBytes(32))
        )
        console.log('wallet.publicKey:', wallet.address) //To be used in hashing (referred as public Key)
        console.log('wallet.privateKey:', wallet.privateKey) // To be given to user as private Key as SALT
        setSalt(wallet.privateKey)
        setPublicKey(wallet.address)
    }

    
    
      
      


    // @dev Player1 Deploys RPS Contract and START THE GAME
    async function handlePlay(){

        //Creating C1 Hash
        const c1Hash = ethers.utils.solidityKeccak256(["uint8", "uint256"],[selectedMove.id, publicKey]);
        console.log("Move Hash: ", c1Hash);

        try {
            //Deploying RPS Contract with params and Value
            const factory = new ethers.ContractFactory(RPS_ABI, RPS_Bytecode, signer.data);
            // console.log("Factory Contract:", factory);
            const contract = await factory.deploy(c1Hash, playerAddr, {value: Number(ethers.utils.parseEther(amount))});
            // console.log("Contract Address: ", contract.address);
            console.log("Transaction Hash:", contract.deployTransaction)
            setContractAddr(contract.address);
            toast(`Transaction: ${contract.deployTransaction.hash}` );
        } catch (error) {
            console.log("Error while Deploying RPS: ", error);
            toast('Error: Could not deploy RPS, check connection and retry')
        } 
    }

    async function updateRegistry(){
        const config = await prepareWriteContract({
            address: RPSRegistryAddr,
            abi: RPSRegistry_ABI,
            functionName: "addGame",
            args: [contractAddr]
        });

        try {
            const { hash } = await writeContract(config);
            console.log("Adding Game Transaction: ", hash);
            toast(`Game Added Succesfully: ${hash}`);
        } catch (error) {
            console.log("Error: ", error);
            toast("Could not add Game to Registry")
            
        }
    }


    return(
        <div className="main-content">
            <h1>How to Play?</h1>
            <div className="instruction-box">
                <p><b>Step1:</b> Choose a Move (Rock, Paper, Scissor, Lizard, Spock)</p>
                <p><b>Step2:</b> Choose opponent (address)</p>
                <p><b>Step3:</b> Choose value to bet (ether)</p>
                <p><b>Step4:</b> Choose a random number (SALT) to hash Player1's move</p>
                <p><b>Step5:</b> Deploy Contract by sending Transaction</p>
            </div>


            <MoveBox selectedMove={selectedMove} updateFunction={setSelectedMove}/>
            {/* <p>Check Move: {selectedMove}</p> */}

            <div className="row-box-left">
                <h2 >Player 2: </h2>
                <input 
                    value = {playerAddr}
                    onChange={(e)=>{setPlayerAddr(e.target.value)}}
                    type="string"
                    placeholder="0x2F15F9c7C7100698E10A48E3EA22b582FA4fB859"
                    className="input-box"
                />
            </div>

            <div className="row-box-left">
                <h2 >Amount: </h2>
                <div style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                    <input 
                        value = {amount}
                        onChange={(e)=>{setAmount(e.target.value)}}
                        type="number"
                        placeholder="ETH"
                        className="input-box"

                    />
                    <h3 style={{padding: 0}}>ETH</h3>
                </div>
            </div>

            <div className="row-box-left">
                <h2>Salt: {formatAddress(salt)}</h2>
                <button onClick={generateSalt} style={{marginLeft: '20px'}}>New Salt</button>
                <CopyToClipboard text={salt} style={{marginLeft: '20px'}}  onCopy={() => toast("Salt Copied!")}>
                    <button>Copy Salt</button>
                </CopyToClipboard>   
            </div>

            <button onClick={handlePlay} style={{marginTop: '8vh'}}>PLAY</button>
            <Toaster toastOptions={{style: {width: '80%'}}}/>

            <div>
                {contractAddr !=null ? 
                <div>
                    <p>Game Contract Addr: {contractAddr}</p>
                    <button onClick={updateRegistry}>Add GAME</button>    
                </div>: <></>}
            </div>
            
        </div>
    )
}