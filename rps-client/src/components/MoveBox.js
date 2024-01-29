import React from "react";
import "../styles/component.css";



export default function MoveBox({selectedMove, updateFunction}) {
    const moveOptions = [{id: '1', move: "Rock"}, {id: '2', move: "Paper"}, {id: '3', move: "Scissors"}, {id: '4' , move: "Spock"}, {id:'5', move: "Lizard"}]
    // const [selectedMove, setSelectedMove] = React.useState('');

    return(
        <div className="moves-container">
            <h2>Select Your Move: </h2>
            <div className="button-list">
            {moveOptions.map((option)=>(
                        <button 
                            style={option.move == selectedMove.move ? {backgroundColor: '#065143', color: "#FBF9FF", marginLeft: '20px'}: {marginLeft: '30px'}} 
                            onClick={()=>{updateFunction(option); console.log("Selected Move:", selectedMove) }}>
                                {option.move}
                        </button>
                ))}
            </div>    
        </div>
    )
}