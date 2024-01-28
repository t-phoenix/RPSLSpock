import React from "react";
import "../styles/home.css";
import rpsinfo from "../rps.jpeg";
import { useNavigate } from "react-router-dom";
import { useContractRead } from "wagmi";
import { RPSRegistryAddr, RPSRegistry_ABI } from "../contracts/Info";

export default function Home() {
  const navigate = useNavigate();

  const { data, isError, isLoading, error } = useContractRead({
    address: RPSRegistryAddr,
    abi: RPSRegistry_ABI,
    functionName: "getGames",
  });

  console.log("Registry Data: ", data);

  return (
    <div className="main-content">
      

      <div style={{width: '90%', display: "flex", flexDirection: 'row', justifyContent: 'space-evenly', marginBlock: '10vh' }}>
      <img src={rpsinfo} style={{ borderRadius: "25px" }} />
        
        <div className="instruction-box">
            <h2>INSTRUCTIONS</h2>
          <p>
            <b>Step1:</b> Player1 Start the Game
          </p>
          <p>
            <b>Step2:</b> Player1 tell Contract Address to selected Player2
          </p>
          <p>
            <b>Step3:</b> Player1 secure their move and salt carefully
          </p>
          <p>
            <b>Step4:</b> Player2 plays the move with same bet amount
          </p>
          <p>
            <b>Step5:</b> Player1 SOLVE by revealing their move and salt
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
      <div style={{width: '90%',display: 'flex', flexDirection: 'column-reverse', alignItems: 'center'}}>
        {data && data.map((game, index) => (
            <div key={game} style={{width: '80%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <p>{index+1}'st Game : {game}</p>
                <div style={{width: '20%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <button onClick={() => navigate(`/player2/${game}`, {state: game})}>Player2</button>
                    <button onClick={() => navigate(`/solve/${game}`, {state: game})}>Solve</button>
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


