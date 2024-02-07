import React, { useState } from "react";
import "../styles/home.css";
import rpsinfo from "../rps.jpeg";
import { useNavigate } from "react-router-dom";
import {readContract, readContracts} from '@wagmi/core'
import { RPSRegistryAddr, RPSRegistry_ABI, RPS_ABI } from "../contracts/Info";
import Loader from "../components/Loader";

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = React.useState([]);
  const [registry, setRegistry] = React.useState([]);
  //event GameAdded


  React.useEffect(()=>{
    getGamesfromRegistry()
  },[])

  async function getGamesfromRegistry(){
    setLoading(true)
    const result = await readContract({
      address: RPSRegistryAddr,
      abi: RPSRegistry_ABI,
      functionName: "getGames",
    })

    if(result){
      console.log("Registry Games: ", result);
      setData(result);
      setGameStates(result);
    }
    
  }


  async function setGameStates(result){
    let gameList = []
    for (let index = 0; index < result.length; index++) {
      //For Every Game Address, check the stake, and player2 move (c2)
      const data = await readContracts({
        contracts: [
          {
            address: result[index],
            abi: RPS_ABI,
            functionName: 'c2'
          },
          {
            address: result[index],
            abi: RPS_ABI,
            functionName: 'stake'
          }
        ]
      })
      console.log("Player 2 Move and stake:", data)
      gameList.push({contract: result[index], move2: data[0], stake: Number(data[1])})
    }    

    console.log("Game List: ",gameList);
    setRegistry(gameList)
    setLoading(false)
  }


  console.log("Registry Data: ", data);

 

  return (
    <div className="main-content">
      

      <div className="home-banner">
        <img src={rpsinfo} style={{ borderRadius: "25px" }} />
        
        <div className="instruction-box">
            <h2>INSTRUCTIONS</h2>
          <p>
            <b>Step1:</b> Player1 Start the Game
          </p>
          <p>
            <b>Step2:</b> Player1 secure their move and salt carefully
          </p>
          <p>
            <b>Step3:</b> Player2 plays the move with same bet amount
          </p>
          <p>
            <b>Step4:</b> Player1 SOLVE by revealing their move and salt
          </p>

          <div
          style={{
            marginTop: "50px",
            width: "40%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
          }}
        >
          <button onClick={() => navigate("/start")}>START</button>
        </div>
        </div>
        
      </div>

      <h2>Game Registry</h2>
      {/* Loader Needed */}
      {loading ? <Loader/> : <div></div>}
      <p>{loading}</p>
      <div style={{width: '90%',display: 'flex', flexDirection: 'column-reverse', alignItems: 'center'}}>
        {registry && registry.map((game, index)=>(
          <div key={game.contract} className="game-card">
          <p style={{overflow: 'clip'}}>Game {index+1}: {game.contract}</p>
          <div style={{width: '20%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            {game.stake === 0 ? <h3>GAME OVER</h3> : 
            <>
              {game.move2 !== 0 ? 
                <button onClick={() => navigate(`/solve/${game}`, {state: game})}>Solve</button>: 
                <button onClick={() => navigate(`/player2/${game}`, {state: game})}>Player2</button>
              }
            </>
          }      
          </div>
      </div>
        ))}
      </div>
      

      <p style={{ color: "#52BAD1", marginTop: "20vh" }}>
        Made with ❤️ by{" "}
        <a
          href={`https://twitter.com/touchey_phoenix`}
          target="blank"
          style={{ fontSize: "14px" }}
        >
          @toucheyphoenix
        </a>
      </p>
    </div>
  );
}


