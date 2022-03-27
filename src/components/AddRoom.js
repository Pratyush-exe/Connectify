import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import firebase from '../Firebase';
import "../styles/AddRoom.css"
import {AnimatePresence, motion} from 'framer-motion/dist/framer-motion'
import Swal from 'sweetalert2'


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
                setShowLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Try again...',
                    text:'This room already exists'
                })
            } else {
                const newRoom = firebase.database().ref('rooms/').push();
                newRoom.set(room);
                history.goBack();
            }
        });
    };

    return (
        <motion.div id="AddRoomCont"
            initial={{paddingTop: '230px'}}
            animate={{paddingTop: '180px'}}
            transition={{duration: 0.3}}>
            { showLoading && <div className="loadingSpinnerContainer"> <div className="loadingSpinner"> </div> </div> }
            <div id="add_room_container">
                <h2>Enter room name</h2>
                <form onSubmit={save}>
                    <div id="add_room_Cont">
                        <input type="text" name="roomname" id="roomname" placeholder="Enter Room Name" value={room.roomname} onChange={(e) => {
                            e.persist();
                            setRoom({...room, [e.target.name]: e.target.value});
                        }} />
                        <button variant="primary" type="submit" id="add_Bt_room"> Add </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}

export default AddRoom;