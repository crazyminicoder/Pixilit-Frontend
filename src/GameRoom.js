import React, { useCallback, useRef } from 'react'
import { useEffect, useState } from 'react'
import { Dna } from 'react-loader-spinner';
import PlayerInfo from './PlayerInfo';
import './GameRoom.css';
import ScrollToBottom from "react-scroll-to-bottom";
import Sound from 'react-sound';
import guessedSound from './sounds/Guessed.mp3';
import GameOver from './GameOver'
import 'react-sound';


function GameRoom({socket, Room_ID, userName, Users, UserData, Rounds}) {

    window.soundManager.setup({debugMode: false});

    const[userList, setUserList]=useState(Users);
    const[loading, setLoading]=useState(true);
    const[currentMessage, setCurrentMessage]=useState("");
    const[messageList, setMessageList]=useState([]);
    const[gameTimer, setGameTimer]=useState(60);
    const[startTimer, setStartTimer]=useState(false);
    const[roundDuration, setRoundDuration]=useState(0);
    const[startRound, setStartRound]=useState(false);
    const[img1]=useState(true);
    const[img2, setImg2]=useState(false);
    const[img3, setImg3]=useState(false);
    const[img4, setImg4]=useState(false);
    const[img5, setImg5]=useState(false);
    const[img40 ,setImg40]= useState("");
    const[img30 ,setImg30]= useState("");
    const[img20 ,setImg20]= useState("");
    const[img10 ,setImg10]= useState("");
    const[clearImage, setClearImage]= useState("");
    const[initializeCurrentRoundGuess]=useState(true);
    const[playerGuessedSound, setPlayerGueddesSound]= useState(false);
    const[imageReset, setImageReset]= useState(true);
    const gameTimeConstant = useRef(60);
    const[interval1, setInterval1]=useState(15000);
    const[interval2, setInterval2]=useState(30000);
    const[interval3, setInterval3]=useState(45000);
    const[interval4, setInterval4]=useState(60000);
    const[gameData, setGameData]=useState([]);
    const[reset, setReset]=useState(false);
    const[title, setTitle]=useState("");
    const[allPlayersHasGuessed, setAllPlayersHasGuessed] = useState(false);
    const[gameOver, setGameOver]= useState(false);
    const {color}= UserData;
    const roundGuess = useRef(false);
    const word = title.toUpperCase();    
    let wordArray=[];
    let currentMessageColor = "white";
    const count =useRef(1);
    let wordArrayNumbers=[];
    const roundCount = useRef(1);
    const noOfRounds = useRef(Rounds);

    //reset count.current to 1
    //roundGuess.curremnt to false

    useEffect(()=>{
        socket.emit("getTotalRounds")
    })

    const checkForAllPlayersHasGuessed = () =>{
        const msg ={
            room : Room_ID
        };
        socket.emit("checkForAllPlayersHasGuessed",msg);
    }

    const checkForRounds = () =>{
        let msg = {
            room:Room_ID,
            rounds:roundCount.current
        }
        socket.emit("checkForRounds",msg);
    }

    useEffect(()=>{
        socket.on("GameOver",(data)=>{
            setGameOver(data);
        })
    },[socket]);
    //checking for all the players has guessed?
    useEffect(()=>{
        const timer = setInterval(()=>{
            checkForAllPlayersHasGuessed();
        },100);
        return ()=>clearInterval(timer);
    },[checkForAllPlayersHasGuessed]);

    useEffect(()=>{
        socket.on("AllPlayersHasGuessed",(data)=>{
            setAllPlayersHasGuessed(data);
            //console.log("All players has guessed: ",data);
        });
    },[socket,allPlayersHasGuessed]);

    const resetAll= useCallback(()=>{
        if(reset){
                //console.log("Inside clear IDS")
                    for(let i=0;i<wordArray.length;i++){
                        //console.log("I:",i);
                        //console.log("Inside array: ",wordArrayNumbers[i]);
                        //console.log("Word array number before poping: ",wordArrayNumbers);
                        document.getElementById(i).innerHTML = "";
                        wordArrayNumbers.pop();
                        //console.log("Word array number after poping: ",wordArrayNumbers);
                    }
            
            //console.log("Inside ResetAll!!!!!");
        count.current=1;
        roundGuess.current=false;
        socket.emit("updateCurrentRoundGuess");
        const msg={
            room: Room_ID,
            count:count.current
        }
        if(count.current === 1){
            socket.emit("getMovieData",msg);   
            count.current+=1;
            //console.log("Inside Game data");
        }
        setImg2(false);
        setImg3(false);
        setImg4(false);
        setImg5(false);
        setImageReset(!imageReset);
        setReset(false);
        setAllPlayersHasGuessed(false);
        roundCount.current= roundCount.current+1;
        //console.log("Img1 after reset",img1);
        //console.log("Img2 after reset",img2);
        //console.log("Img3 after reset",img3);
        //console.log("Img4 after reset",img4);
        //console.log("Img5 after reset",img5);
        }
        
    },[reset,Room_ID,imageReset,socket,wordArray.length,wordArrayNumbers]);

     //Getting All game data
     useEffect(()=>{
        const msg={
            room: Room_ID,
            count:count.current
        }
        
        if(count.current === 1){
            socket.emit("getMovieData",msg);   
            count.current+=1;
            //console.log("Inside Game data");
        }
        
      },[Room_ID,socket]);
      
    //Calculating the squares for the title to be displayed
    for(let i=0;i<word.length;i++){
        let temp=word.charAt(i).toLowerCase();
        wordArray.push(temp);
    }
    
  
    //Function to send messages
    const sendMessage = async () => {
        let count =0;
        if (currentMessage !== "") {
            if(currentMessage.toLowerCase() === word.toLowerCase() ){
                currentMessageColor = "green";
                roundGuess.current = true;
            }
            else{
                currentMessage.toLowerCase();
                for(let i = 0;i< currentMessage.length;i++){
                    let temp = currentMessage.charAt(i);
                    if(wordArray[i] === temp){
                        count++;
                    }
                }
            let result = Math.floor((word.length * 90)/100);
                if(count >= result && count < word.length){
                    currentMessageColor = "#e36414";
                }
            }
          const messageData = {
            room: Room_ID,
            author: userName,
            message: currentMessage.toLowerCase(),
            color:color,
            word:word.toLowerCase(),
            guessedColor:currentMessageColor,
            guessed: roundGuess.current,
            time:gameTimer,
          };
          await socket.emit("send_message", messageData);
          setMessageList((list) => [...list, messageData]);
          setCurrentMessage("");
          currentMessageColor = "white";
          roundGuess.current = false;
        }
        
      };

      
      //Setting all images
      useEffect(()=>{
        socket.on("receiveMovieData",(data)=>{
            setGameData(data);
            let title = data.map((item)=> item.movieTitle)[0];
            let img1= data.map((item)=>item.imgOne)[0];
            let img2= data.map((item)=>item.imgTwo)[0];
            let img3= data.map((item)=>item.imgThree)[0];
            let img4= data.map((item)=>item.imgFour)[0];
            let img5 = data.map((item)=> item.clearImage)[0];
            setTitle(title);
            setImg40(img1);
            setImg30(img2);
            setImg20(img3);
            setImg10(img4);
            setClearImage(img5);
            //console.log(gameData)
        })
      },[socket, gameData, img40 , title,word]);

      //UseEffect For Loading
    useEffect(()=>{
        let timeout = setTimeout(()=>{
            setLoading(false);
            setStartTimer(true);
        },1000) 
        return ()=>clearTimeout(timeout);
    },[loading,img40]);

    //player has guessed sound effect
    useEffect(()=>{
        socket.on("playerHasGuessedSound",(data)=>{
            setPlayerGueddesSound(data);
        })
    },[socket]);

    //setting the guess sound back to false
    useEffect(()=>{
        let timeout = setTimeout(()=>{
            setPlayerGueddesSound(false);
        },1100);
        return ()=>clearTimeout(timeout);
    },[playerGuessedSound]);
    
    
    //Sending and receiving Random number 
    useEffect(()=>{
        if(!reset && !gameOver){
            //console.log("GameOver inside rng: ",gameOver);
            let timer = setInterval(()=>{
                const data={
                    length:word.length,
                    room:Room_ID
                }
                
                 socket.emit("getRandomNumber",data);
            },10000)
            return()=>clearInterval(timer);
        }
   },[socket,word,gameOver,reset,Room_ID]);

   useEffect(()=>{
    socket.off("receiveRandomNumber").on("receiveRandomNumber",(data)=>{
        let number= data;
        //console.log("Random number: ",number);
        if(word.charAt(number) !== " " && !reset){
            let letter= word.charAt(number)
            let count =0;
            for(let i=0;i<wordArrayNumbers.length;i++){
                if(wordArrayNumbers[i] === number){
                    count++;
                }
            }
            if(count === 0){
            wordArrayNumbers.push(number);
            }
            //console.log("Word Array Number: ",wordArrayNumbers);
            document.getElementById(number).innerHTML = letter;
            //console.log("random number",number);
        }
       })
   },[socket,word,reset,wordArrayNumbers]);

   useEffect(()=>{
       //Checking for any player who might have left the game
       socket.on("UpdateGameRoomData",(data)=>{
        setUserList(data);
    })
   },[socket,userList]);
    
// Sending and receiving messages 
useEffect(()=>{
    socket.off("receive_message").on("receive_message", (data) => {
        if(messageList ===" "){
            setMessageList(data);
        }
        else{
        setMessageList((list) => [...list, data]);
        }
      });
},[messageList, socket]);

//Round End Timer 5 second timer
useEffect(()=>{
   if(!gameOver){
        let startRoundTimer = setTimeout(()=>{
            resetAll();
            setStartTimer(true);
            setStartRound(false);
            setReset(false);
            checkForRounds();
        },3000);
    return ()=>clearTimeout(startRoundTimer);
   }
},[startRound,resetAll,checkForRounds,gameOver]);

//console.log("Reset: ",reset);
//Round Timer
//console.log("game over: ",gameOver);
useEffect(()=>{
   const timer=  setInterval(()=>{
    if(startTimer && !gameOver){
        if(gameTimer === 1 || allPlayersHasGuessed){
            setStartTimer(false);
            setGameTimer(roundDuration + 1);
            setStartRound(true);
            setReset(true);
            setAllPlayersHasGuessed(false);
        }
            setGameTimer((timer)=> timer -= 1);
    }
    },1000);
    return ()=> clearInterval(timer);
},[gameTimer,startTimer,allPlayersHasGuessed,reset, roundDuration,gameOver]);

//Getting each round length i.e 1 min, 2 min
useEffect(()=>{
    socket.emit("getGameTime",Room_ID);
    socket.on("gameTime",(data)=>{
        let time= data[0] * 60;
        setGameTimer(time);
        gameTimeConstant.current=time;
        setRoundDuration(time);
        calculateTime();
       });
},[socket,roundDuration,Room_ID]);

//initializing guess
useEffect(()=>{
    socket.emit("setCurrentRoundGuess",Room_ID);
    //console.log("Inside guess");
},[initializeCurrentRoundGuess,Room_ID,socket]);


const calculateTime= ()=>{
    if(gameTimeConstant.current === 60){
        setInterval1(16000);
        setInterval2(31000);
        setInterval3(46000);
        setInterval4(61000);
    }
    else if(gameTimeConstant.current === 120){
        setInterval1(31000);
        setInterval2(61000);
        setInterval3(91000);
        setInterval4(121000);
    }
    else if(gameTimeConstant.current === 180){
        setInterval1(46000);
        setInterval2(91000);
        setInterval3(136000);
        setInterval4(181000);
    }
    else if(gameTimeConstant.current === 240){
        setInterval1(61000);
        setInterval2(121000);
        setInterval3(181000);
        setInterval4(241000);
    }
    else{
        setInterval1(76000);
        setInterval2(151000);
        setInterval3(226000);
        setInterval4(301000);
    }
}

//setting images timer to appera on screen
useEffect(()=>{
    let timer = setTimeout(()=>{
        setImg2(true)
    },interval1);
    return ()=>clearTimeout(timer);
},[interval1,imageReset])
//setting images timer to appera on screen
useEffect(()=>{
    let timer = setTimeout(()=>{
        setImg3(true);
    },interval2);
    return ()=>clearTimeout(timer);
},[interval2,imageReset]);
//setting images timer to appera on screen
useEffect(()=>{
    let timer = setTimeout(()=>{
        setImg4(true);
    },interval3);
    return ()=>clearTimeout(timer);
},[interval3,imageReset]);
//setting images timer to appera on screen
useEffect(()=>{
    let timer = setTimeout(()=>{
        setImg5(true);
    },interval4);
    return ()=>clearTimeout(timer);
},[interval4,imageReset]);

useEffect(()=>{

},[roundGuess]);

//console.log("Interval1: ",interval1);
//console.log("Interval2: ",interval2);
//console.log("Interval3: ",interval3);
//console.log("Interval4: ",interval4);

//console.log("The game Movie Data: ",gameData);
//console.log("Movie Title: ",title);
//console.log("Word: ",word);
//console.log("Word Length: ",word.length);
//console.log("Title length: ",title.length);
//console.log("Img1 before reset",img1);
//console.log("Img2 before reset",img2);
//console.log("Img3 before reset",img3);
//.log("Img4 before reset",img4);
//console.log("Img5 before reset",img5);

//console.log("allPlayershasguessed: ",allPlayersHasGuessed);
  return (
    <div className='game_room'>
         <Sound 
      url={guessedSound}
      playStatus={playerGuessedSound ? Sound.status.PLAYING : Sound.status.STOPPED}
      
      />
    {loading ? (<Dna/>) :(
          
        <div>
      {/*Generating Title */}
      {!gameOver ? (
        <div>
         <div className='image_title'>
         {wordArray.map((letter,key)=>
              <div className={letter !== " " ? "wordLetters" : "wordLettersSpace"} >
                  <h2 id={key}> </h2>
          </div>
         )}
      </div>

      {/*Main Game Body*/}
      <div className='game_room_body'>

      {/*Game Body Left*/}    
      <div className='game_room_body_left'>
            <div className='room_info'>
                <h2>Room ID: {Room_ID}</h2>
            </div>
                
            {userList.map((element,index)=>{
                return(
                    <div key={index}>
                        <PlayerInfo Player_Name={element.name} Color={element.color} Score={element.score} Guessed={false}/>
                    </div>
                )
            })}
        </div>

         {/*Game Body Middle*/} 
         
        <div className='game_room_body_middle'>
        <img src={img40} width="100%" height="100%" alt='Error' id={img1 ? 'visible' : 'hidden'}></img>
          <img src={img30} width="100%" height="100%" alt='Error' id={img2 ? 'visible' : 'hidden'}></img>
          <img src={img20} width="100%" height="100%" alt='Error' id={img3 ? 'visible' : 'hidden'}></img>
          <img src={img10} width="100%" height="100%" alt='Error' id={img4 ? 'visible' : 'hidden'}></img>
          <img src={clearImage} width="100%" height="100%" alt='Error' id={img5 ? 'visible' : 'hidden'}></img>
          </div>

        {/*Game Body Right*/}
        <div className='game_room_body_right'>
          <div className='timer'>
            <div className='gameRounds'><h2>{roundCount.current}/{noOfRounds.current}</h2></div>
            <div className='gameTimer'><h2 style={{color: "#fca311"}}>{gameTimer} sec</h2></div>
              
          </div>
          <div className='messageBody'>
              <ScrollToBottom className="message-container">
              {messageList.map((messageContent)=>{
                  return(
                   <div className='messageBodyContent'>
                      <div className='mbcLeft'><h3 style={{color: messageContent.color}}>{messageContent.author}:</h3></div>
                      <div className='mbcRight'><h4 style={{color: messageContent.guessedColor}}>{messageContent.message}</h4></div>
                      
                  </div>
                  )
              })}
              </ScrollToBottom>
              
          </div>
          <div className='userInput'>
              <div className='playerName'>
                  <h2 style={{color: "Black"}}>{userName}:</h2>
              </div>
              <input type="text"
                      className='guessInput'
                      value={currentMessage}
                      placeholder="Guess..."
                      onChange={(event) => {
                      setCurrentMessage(event.target.value);
                      }}
                      onKeyPress={(event) => {
                      event.key === "Enter" && sendMessage();
               }} >
              </input>
          </div>
        </div>

        {/*Game Room Bottom*/}
        </div>
        <div className='gameRoomBottom'>
          <div className='gameRoomBottomColors'>
          <div className='red' id={img1 ? 'redCircle' : 'hidden'}></div>
          <div className='orange' id={img2 ? 'orangeCircle' : 'hidden'}></div>
          <div className='yellow' id={img3 ? 'yellowCircle' : 'hidden'}></div>
          <div className='green' id={img4 ? 'greenCircle' : 'hidden'}></div>
          </div>
        </div>
        </div>
      ) : (<GameOver users={userList} socket={socket}/>)}
       
    </div>
          )}
    </div>
  )
  
}

export default GameRoom