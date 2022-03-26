import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import firebase from '../Firebase';

function Login() {
    const history = useHistory();
    const [creds, setCreds] = useState({ nickname: '' });
    const [showLoading, setShowLoading] = useState(false);
    const ref = firebase.database().ref('users/');

    const login = (e) => {
        e.preventDefault();
        setShowLoading(true);
        ref.orderByChild('nickname').equalTo(creds.nickname).once('value', snapshot => {
            if (snapshot.exists()) {
                localStorage.setItem('nickname', creds.nickname);
                history.push('/roomlist');
                setShowLoading(false);
            } else {
                const newUser = firebase.database().ref('users/').push();
                newUser.set(creds);
                localStorage.setItem('nickname', creds.nickname);
                history.push('/roomlist');
                setShowLoading(false);
            }
        });
    };

    return (
        <div>
            { showLoading && <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_%28wobbly%29.gif" alt="Loading" id="loading" height="100px" weight="100px" /> }
            <div id="loginContainer">
                <form onSubmit={login} id="loginContainerForm">
                    <div>
                        <h2 id="formNickname">Nickname</h2>
                        <input type="text" name="nickname" id="nickname" placeholder="Enter Your Nickname" value={creds.nickname} onChange={(e) => {
                            e.persist();
                            setCreds({...creds, [e.target.name]: e.target.value});
                        }} />
                    </div>
                    <button type="submit" id="login_login">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;