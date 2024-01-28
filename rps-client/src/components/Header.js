import React from "react";
import { Web3Button } from "@web3modal/react";
import { useNetwork } from "wagmi";
import "../styles/component.css";
import { useNavigate } from "react-router-dom";


export default function Header() {
  const { chain } = useNetwork();
  const navigate = useNavigate()

  console.log("");
  return (
    <div className="navbar">
      <div className="title-container" onClick={()=>navigate('/')}>
        <h2 className="title">RPSLSpock</h2>
        <p className="icon-title">by t-phoenix</p>
      </div>
      <div className="web3buttonContainer">
        <Web3Button />
        {chain && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              
            }}
          >
            <div className="online"></div>
            <p style={{fontSize: '12px', padding: 0, margin: 0, color: '#FBF9FF'}}>{chain.name}</p>
          </div>
        )}
      </div>

    </div>
  );
}
