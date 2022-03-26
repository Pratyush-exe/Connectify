import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import Moment from 'moment';
import firebase from '../Firebase';

function RoomList() {
    const [room, setRoom] = useState([]);
    const [showLoading, setShowLoading] = useState(true);
    const [nickname, setNickname] = useState('');
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            setNickname(localStorage.getItem('nickname'));
            firebase.database().ref('rooms/').on('value', resp => {
                setRoom([]);
                setRoom(snapshotToArray(resp));
                setShowLoading(false);
            });
        };
      
        fetchData();
    }, []);

    const snapshotToArray = (snapshot) => {
        const returnArr = [];

        snapshot.forEach((childSnapshot) => {
            const item = childSnapshot.val();
            item.key = childSnapshot.key;
            returnArr.push(item);
        });

        return returnArr;
    }

    const enterChatRoom = (roomname) => {
        const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
        chat.roomname = roomname;
        chat.nickname = nickname;
        chat.date = Moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
        chat.message = `${nickname} enter the room`;
        chat.type = 'join';
        const newMessage = firebase.database().ref('chats/').push();
        newMessage.set(chat);

        firebase.database().ref('roomusers/').orderByChild('roomname').equalTo(roomname).on('value', (resp) => {
            let roomuser = [];
            roomuser = snapshotToArray(resp);
            const user = roomuser.find(x => x.nickname === nickname);
            if (user !== undefined) {
              const userRef = firebase.database().ref('roomusers/' + user.key);
              userRef.update({status: 'online'});
            } else {
              const newroomuser = { roomname: '', nickname: '', status: '' };
              newroomuser.roomname = roomname;
              newroomuser.nickname = nickname;
              newroomuser.status = 'online';
              const newRoomUser = firebase.database().ref('roomusers/').push();
              newRoomUser.set(newroomuser);
            }
        });
    
        history.push('/chatroom/' + roomname);
    }

    return (
        <div>
            { showLoading && <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_%28wobbly%29.gif" alt="Loading" id="loading" height="100px" weight="100px" /> }
            <div id="roomList">
                <h3> {nickname} 
                    <button onClick={() => {
                        localStorage.removeItem('nickname');
                        history.push('/login');
                    }}>Logout</button>
                </h3>
                <h2>Room List</h2>
                <div>
                    <Link to="/addroom">Add Room</Link>
                </div>
                <div id="roomListContainer">
                    {room.map((item, idx) => (
                        <div class="RoomRows" key={idx} action onClick={() => { enterChatRoom(item.roomname) }}>{item.roomname}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default RoomList;