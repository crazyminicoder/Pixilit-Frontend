import React, { useEffect, useState } from 'react'
import PlayerInfo from './PlayerInfo'
import './GameOver.css';

function GameOver({users, socket}) {
    const[userList , setUserList]=useState(users)

    useEffect(()=>{
        socket.toString("updateUserList",(data)=>{
            setUserList(data);
        })
    },[socket]);
  return (
    <div className='gameOverBody'>
        <div className='gameBodyMiddle'>
            <div className='gameBodyTitle'>
                <h2>Game Over</h2>
                </div>
        <div className="playerCard">
       {userList.map((element,index)=>{
                return(
                    
                    <div key={index} className="cards">
                        <PlayerInfo Player_Name={element.name} Color={element.color} Score={element.score}/>
                    </div>
                 
                )
            })}
            </div>
            </div>
    </div>
  )
}

export default GameOver