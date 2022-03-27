import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import Moment from 'moment';
import firebase from '../Firebase';
import ScrollToBottom from 'react-scroll-to-bottom';
import { RiSendPlaneFill } from 'react-icons/ri';
import { IoExitOutline } from 'react-icons/io5';
import '../styles/ChatRoom.css'
import Swal from 'sweetalert2'

function ChatRoom() {
    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);
    const [nickname, setNickname] = useState('');
    const [roomname, setRoomname] = useState('');
    const [newchat, setNewchat] = useState({ roomname: '', nickname: '', message: '', date: '', type: '' });
    const history = useHistory();
    const { room } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            setNickname(localStorage.getItem('nickname'));
            setRoomname(room);
            firebase.database().ref('chats/').orderByChild('roomname').equalTo(roomname).on('value', resp => {
              setChats([]);
              setChats(snapshotToArray(resp));
            });
        };
      
        fetchData();
    }, [room, roomname]);

    useEffect(() => {
        const fetchData = async () => {
            setNickname(localStorage.getItem('nickname'));
            setRoomname(room);
            firebase.database().ref('roomusers/').orderByChild('roomname').equalTo(roomname).on('value', (resp2) => {
              setUsers([]);
              const roomusers = snapshotToArray(resp2);
              setUsers(roomusers.filter(x => x.status === 'online'));
            });
        };
      
        fetchData();
    }, [room, roomname]);

    const snapshotToArray = (snapshot) => {
        const returnArr = [];

        snapshot.forEach((childSnapshot) => {
            const item = childSnapshot.val();
            item.key = childSnapshot.key;
            returnArr.push(item);
        });

        return returnArr;
    }

    const submitMessage = (e) => {
        e.preventDefault();
        
        const chat = newchat;
        chat.roomname = roomname;
        chat.nickname = nickname;
        chat.date = Moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
        chat.type = 'message';

        let text = document.getElementById("message").value
        fetch("https://connectify-api.herokuapp.com/CheckOffensive?text=" + text.replaceAll(" ", "+"))
        .then(response => response.json())
        .then(data => {
            if(data["result"] === 1){
                chat.message = "🚫 Watch your language! Message Deleted!"
                const newMessage = firebase.database().ref('chats/').push();
                newMessage.set(chat);
            }
            else{
                chat.message = text
                const newMessage = firebase.database().ref('chats/').push();
                newMessage.set(chat);}
        })
        document.getElementById("message").value=""
        setNewchat({ roomname: '', nickname: '', message: '', date: '', type: '' });
    };

    const onChange = (e) => {
        e.persist();
        setNewchat({...newchat, [e.target.name]: e.target.value});
    }

    const exitChat = (e) => {
        const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
        chat.roomname = roomname;
        chat.nickname = nickname;
        chat.date = Moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
        chat.message = `${nickname} leave the room`;
        chat.type = 'exit';
        const newMessage = firebase.database().ref('chats/').push();
        newMessage.set(chat);
    
        firebase.database().ref('roomusers/').orderByChild('roomname').equalTo(roomname).once('value', (resp) => {
          let roomuser = [];
          roomuser = snapshotToArray(resp);
          const user = roomuser.find(x => x.nickname === nickname);
          if (user !== undefined) {
            const userRef = firebase.database().ref('roomusers/' + user.key);
            userRef.update({status: 'offline'});
          }
        });
    
        history.goBack();
    }

    function videoChatOnlick() {
        Swal.fire({
            icon: 'information',
            title: 'Loading...',
            text:'Share the joining link in the chat and Enjoy!'
        })
        setTimeout(()=>{window.open("https://jump.chat/c/", "_blank");}, 2000)
    }

    function ytOnClick() {
        Swal.fire({
            icon: 'information',
            title: 'Loading...',
            text: 'Share the joining link in the chat and Enjoy!'
        })
        setTimeout(()=>{window.open("https://sync-tube.de/create", "_blank");}, 2000)
    }

    function scribblOnClick() {
        Swal.fire({
            icon: 'information',
            title: 'Loading...',
            text: 'Share the joining link in the chat and Enjoy!'
        })
        setTimeout(()=>{window.open("https://skribbl.io/", "_blank");}, 2000)
    }

    function kartOnClick() {
        Swal.fire({
            icon: 'information',
            title: 'Loading...',
            text: 'Share the joining link in the chat and Enjoy!'
        })
        setTimeout(()=>{window.open("https://smashkarts.io/", "_blank");}, 2000)
    }

    return (
        <div className="Container">
            <div id="Cont_row">
                <div id="Cont_col_1">
                    <div className="UsersCardHeader">
                        <div className="card_body_header">
                            <h2>Members</h2>
                            <button onClick={() => { exitChat() }}> 
                                    Exit Room <IoExitOutline/>
                            </button>
                        </div >
                    </div>
                    {users.map((item, idx) => (
                        <div className="UsersCard">
                            <div className="card_body">
                                {item.nickname}
                            </div >
                        </div>
                    ))}
                    <p id="chat-notice">If members not visible, try rejoining the room.</p>
                </div>
                <div id="Cont_col_2">
                    <div id="Options_Chat_Cont">
                        <button id="play_games_bt" className="Nav_bts" onClick={scribblOnClick}>Play Skribbl</button>
                        <button id="play_kart_bt" className="Nav_bts" onClick={kartOnClick}>Play Smashkarts</button>
                        <button id="video_Watch_bt" className="Nav_bts" onClick={ytOnClick}>Watch YoutTube</button>
                        <button id="videoChat_bt" className="Nav_bts" onClick={videoChatOnlick}>Video Chat</button>
                    </div>
                    <ScrollToBottom className="ChatContent">
                        {chats.map((item, idx) => (
                            <div key={idx} className="MessageBox">
                                {item.type ==='join'||item.type === 'exit'?
                                    <div className="ChatStatus">
                                        <span className="ChatContentCenter">{item.message}</span>
                                    </div>:
                                    <div className="ChatMessage">
                                        <div className={`${item.nickname === nickname? "RightBubble":"LeftBubble"}`}>
                                        {item.nickname === nickname ? 
                                            <span className="MsgName">Me</span>:<span className="MsgName">{item.nickname}</span>
                                        }
                                        <span className="MsgDate"> at {item.date}</span>
                                        <p>{item.message}</p>
                                        </div>
                                    </div>
                                }
                            </div>
                        ))}
                    </ScrollToBottom>
                    <footer className="StickyFooter">
                        <form className="MessageForm" onSubmit={submitMessage}>
                            <div id="input_msg">
                                <input id="message" type="text" name="message" placeholder="Enter message here" value={newchat.message} onChange={onChange} />
                                <button id="submitButton" variant="primary" type="submit"> <RiSendPlaneFill/> </button>
                            </div>
                        </form>
                    </footer>
                </div>
            </div>
        </div>
    );
}

export default ChatRoom;