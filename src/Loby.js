import React, { useEffect, useState } from 'react'
import './Loby.css'
import PlayerInfo from './PlayerInfo'
import GameRoom from './GameRoom';
import Sound from 'react-sound';
import joinSound from './sounds/Join.mp3';
import leaveSound from './sounds/Leave.mp3';
import 'react-sound';

function Loby({ Room_ID, socket, Username, Data} ) {
    window.soundManager.setup({debugMode: false,
    volume: 50});
const[user_list,setUser_list]=useState([]);
const[round, setRound]=useState(1);
const[time, setTime]=useState(1);
const[gameRoom, setGameRoom]=useState(false);
const[playJoinSound, setPlayJoinSound]=useState(false);
const[playLeaveSound, setPlayLeaveSound]=useState(false);
const[leader, setLeader]=useState("");
const guessed = false;
useEffect(()=>{
    socket.on("updateUserList",(data)=>{
        setUser_list(data);
    })
    socket.on("updatedRoundNumber",(data)=>{
        setRound(data);
    })
    socket.on("updateRoundTime",(data)=>{
        setTime(data);
    })
    socket.on("nextRoom",(data)=>{
        setGameRoom(data);
    })
    socket.on("playSound",(data)=>{
        setPlayJoinSound(data);
    })
    socket.on("playLeaveSound",(data)=>{
        setPlayLeaveSound(data);
    })
    socket.on("updateLeader",(data)=>{
        setLeader(data);
    })
},[socket]);

useEffect(()=>{
    let timeout = setTimeout(()=>{
        setPlayJoinSound(false);
    },1000);
    return ()=>clearTimeout(timeout);
},[playJoinSound]);

useEffect(()=>{
    let timeout = setTimeout(()=>{
        setPlayLeaveSound(false);
    },1000);
    return ()=>clearTimeout(timeout);
},[playLeaveSound]);


const incrementRound = () =>{
    socket.emit("incrementRound", Room_ID);
}

const decrementRound = () =>{
        socket.emit("decreaseRound",Room_ID);
}

const incrementTime = () =>{
    socket.emit("increaseTime",Room_ID);
}

const decrementTime = () =>{
    socket.emit("decreaseTime",Room_ID);
}

const handleGameRoom = () =>{
    const gameRoomData = {
        room:Room_ID,
        name:Username
    }
    socket.emit("GameRoomData",gameRoomData);
    
}

const empty = ()=>{

}

//console.log(user_list);
//console.log("Socket: ",socket);
//console.log("Leader: ",leader);

  return (
    <div className='loby'>
        <Sound 
      url={joinSound}
      playStatus={playJoinSound ? Sound.status.PLAYING : Sound.status.STOPPED}
      />
        <Sound 
      url={leaveSound}
      playStatus={playLeaveSound ? Sound.status.PLAYING : Sound.status.STOPPED}
      />
      {!gameRoom ? (
        <div className='loby'>
            <div className='loby_left'>
              <div className='room_info'>
                  <h2>Room ID: {Room_ID}</h2>
              </div>
                  
              {user_list.map((element,index)=>{
                  return(
                      <div key={index}>
                          <PlayerInfo Player_Name={element.name} Color={element.color} Guessed={guessed} />
                      </div>
                  )
              })}
          </div>
          <div className='loby_right'>
              <div className='loby_rigt_top'>
                  <div id='one'><h1>Round/s</h1></div>
                  <div id='right'>
                      <button id='button' onClick={leader === socket.id ? incrementRound : empty } >+</button>
                      <div id='right_h2'><h2>{round}</h2></div>
                      <button id='button' onClick={leader === socket.id ? decrementRound : empty}>-</button>
                      </div>
              </div>
              <div className='loby_rigt_middle'>
                  <div id='one'><h1>Time Limit</h1></div>
                  <div id='right'>
                      <button id='button' onClick={leader === socket.id ? incrementTime : empty}>+</button>
                      <div id='right_h2'><h2>{time} min</h2></div>
                      <button id='button' onClick={leader === socket.id ? decrementTime : empty}>-</button>
                      </div>
            
              </div>
              <div className='loby_rigt_bottom'>
                 <button id='start_button' onClick={leader === socket.id ? handleGameRoom : empty} >Start</button>
                  
              </div>
          </div>
         </div>
      ):(
        <GameRoom socket={socket} Room_ID={Room_ID} userName={Username} Users={user_list} UserData={Data} Rounds={round}/>
      )}
      
        
    </div>

  );
}

export default Loby