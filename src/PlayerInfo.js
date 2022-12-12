import React from 'react'
import './PlayerInfo.css'

function PlayerInfo(props) {
  return (
    <div className='player_info' id={props.Guessed ? "guessed" : "pi"}  style={{backgroundColor: props.Color}}>
      <div className='pi_left' style={{backgroundColor: props.Color}}>
        {/*props.Leader === props.Socket ? ( <img src='./images/Leader.png' alt='Leader'></img>) : (<div></div>)*/}
       
      </div>
      <div className='pi_middle' style={{backgroundColor: props.Color}}> <h2>{props.Player_Name}</h2></div>
      <div className='pi_right' style={{backgroundColor: props.Color}}><h2>{props.Score}</h2></div>
   
   
</div>
  )
}

export default PlayerInfo