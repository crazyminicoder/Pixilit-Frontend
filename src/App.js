import './App.css';
import io from 'socket.io-client'
import {useEffect, useState} from 'react'
import Loby from './Loby';
import {Helmet} from "react-helmet";
import 'react-sound';
const socket = io.connect("https://pixilit.onrender.com");


function App() {
  window.soundManager.setup({debugMode: false});
  const[name, setName]= useState("");
  const[playerRoom_id, setPlayerRoom_id]=useState("");
  const[inputs1, setInputS1]=useState(true);
  const[inputs2, setInputS2]=useState(true);
  const[loby,setLoby]=useState(false);
  const[app_data, setApp_Data]=useState([]);
  const colors = ["#ef233c","#0096c7","#ffd60a","#219ebc","#BFF5F5","#457b9d","#00f5d4","#d44c4c","#f77f00","#7209b7"]

  const settingName = (e) =>{
    setName(e.target.value);
  }
const settingID = (e) =>{
  setPlayerRoom_id(e.target.value);
}
const changeLayout1 = () =>{
  setInputS1(false);
  setInputS2(true);
}
const changeLayout2 = () =>{
  setInputS2(false);
  setInputS1(true);
}

const joinRoom = () =>{
  const randomNumber = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
  let randomColor= colors[randomNumber];
  if(name !== "" && playerRoom_id !== ""){
    const data = {
      room_id:playerRoom_id,
      name:name,
      color:randomColor
    };
    setApp_Data(data);
    socket.emit("join_room",data);
    setLoby(true);
  }
}

  return (
    <div className="App">
      <Helmet >
        <title>Pixilit</title>
      </Helmet>
      {!loby ? (
        <div className='appBody'>
        <div className='GameTitle'>
          <h1 id='t1'>P</h1>
          <h1 id='t2'>I</h1>
          <h1 id='t3'>X</h1>
          <h1 id='t4'>I</h1>
          <h1 id='t5'>L</h1>
          <h1 id='t6'>I</h1>
          <h1 id='t7'>T</h1>
        </div>
      <div className="room_box">
        <div className="room_name">
          <label id='label1'>Name</label>
        <input type="text" id={inputs1 ? "name" : "name2"} onClick={changeLayout1} onChange={settingName}></input>
        </div>
      <div className="room_Id">
        <label id='label2'>Room ID</label>
      <input type="text" id={inputs2 ? "id" : "id2"} onClick={changeLayout2} onChange={settingID}></input>
      </div>
      <div className="buttons">
       <button id="button_two" onClick={joinRoom}>Join</button>
      </div>
      </div>
      </div>
      ) : (
        <Loby Username={name} Room_ID={playerRoom_id} socket={socket} Data={app_data}/>
      )}
      
    </div>
  );
}

export default App;
