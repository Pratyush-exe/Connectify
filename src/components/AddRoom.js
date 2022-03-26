import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import firebase from '../Firebase';

function AddRoom() {
    const history = useHistory();
    const [room, setRoom] = useState({ roomname: '' });
    const [showLoading, setShowLoading] = useState(false);
    const ref = firebase.database().ref('rooms/');

    const save = (e) => {
        e.preventDefault();
        setShowLoading(true);
        ref.orderByChild('roomname').equalTo(room.roomname).once('value', snapshot => {
            if (snapshot.exists()) {
                alert("Room name already exist!")
            } else {
                const newRoom = firebase.database().ref('rooms/').push();
                newRoom.set(room);
                history.goBack();
                setShowLoading(false);
            }
        });
    };

    return (
        <div>
            { showLoading && <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_%28wobbly%29.gif" alt="Loading" id="loading" height="100px" weight="100px" /> }
            <div id="add_room_container">
                <h2>Please Enter Room Name</h2>
                <form onSubmit={save}>
                    <div id="add_room_Cont">
                        <h1>Room Name</h1>
                        <input type="text" name="roomname" id="roomname" placeholder="Enter Room Name" value={room.roomname} onChange={(e) => {
                            e.persist();
                            setRoom({...room, [e.target.name]: e.target.value});
                        }} />
                    </div>
                    <button variant="primary" type="submit"> Add </button>
                </form>
            </div>
        </div>
    );
}

export default AddRoom;