import React, { useState, useEffect } from 'react';
import '../styles/RoomList.css'
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
           { showLoading && <div className="loadingSpinnerContainer"> <div className="loadingSpinner"> </div> </div> }
            <div id="roomList">
                <div id= "roomlist_header">
                    <h3> {nickname} </h3>
                    <button id="logoutBt" onClick={() => {
                            localStorage.removeItem('nickname');
                            history.push('/login');
                        }}>Logout</button>
                </div>
                <div id="roomList_lower_header">
                    <h2 id="roomListHeading">Room List</h2>
                    <Link to="/addroom" id="Addroom_but">Add Room</Link>
                </div>
                <div id="roomListContainer">
                    {room.map((item, idx) => (
                        <div class="RoomRows" key={idx} action onClick={() => { enterChatRoom(item.roomname) }}>{idx+1}.  {item.roomname}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default RoomList;