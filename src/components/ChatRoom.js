import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import Moment from 'moment';
import firebase from '../Firebase';
import ScrollToBottom from 'react-scroll-to-bottom';
import '../styles/ChatRoom.css';

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
        fetch("http://127.0.0.1:5000/CheckOffensive?text=" + text.replaceAll(" ", "+"))
        .then(response => response.json())
        .then(data => {
            console.log("came here")
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

    return (
        <div className="Container">
            <div id="Cont_row">
                <div id="Cont_col_1">
                    <div id="btn_Cont">
                        <button onClick={() => { exitChat() }}> Exit Chat </button>
                    </div >
                    {users.map((item, idx) => (
                        <div className="UsersCard">
                            <div className="card_body">
                                {item.nickname}
                            </div >
                        </div>
                    ))}
                </div>
                <div id="Cont_col_2">
                    <ScrollToBottom className="ChatContent">
                        {chats.map((item, idx) => (
                            <div key={idx} className="MessageBox">
                                {item.type ==='join'||item.type === 'exit'?
                                    <div className="ChatStatus">
                                        <span className="ChatDate">{item.date}</span>
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
                    <div className="StickyFooter">
                        <form className="MessageForm" onSubmit={submitMessage}>
                            <div id="input_msg">
                            <input type="text" name="message" id="message" placeholder="Enter message here" onChange={onChange} />
                                <button variant="primary" type="submit">Send</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatRoom;