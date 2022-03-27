import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import firebase from '../Firebase';
import "../styles/Login.css";
import img_login from "../images/Untitled.png"
import {AnimatePresence, motion} from 'framer-motion/dist/framer-motion'
import Swal from 'sweetalert2'
import Logo from './Logo';


function Login() {
    const history = useHistory();
    const [creds, setCreds] = useState({ nickname: '' , password: ''});
    const [showLoading, setShowLoading] = useState(false);
    const [SignUp, setSignUp] = useState(false);
    const ref = firebase.database().ref('users');
    useEffect(() => {
        if(SignUp===true){
            document.getElementById("formNickname").textContent = "Sign Up"
            document.getElementById("login_login").textContent = "Continue"
            document.getElementById("loginStatus").textContent = "Existing User? Please "
            document.getElementById("ChangeButton").textContent = "Sign In"
        }
        else {
            document.getElementById("formNickname").textContent = "Sign In"
            document.getElementById("login_login").textContent = "Login"
            document.getElementById("loginStatus").textContent = "New User? Please "
            document.getElementById("ChangeButton").textContent = "Sign Up"
        }
    }, [SignUp])

    // setSignUp(true)
    
    const login = (e) => {
        e.preventDefault();
        let usid = document.getElementById("nickname").value
        let pswd = document.getElementById("signup-password").value
        console.log(usid, pswd)
        let flag=0;
        setShowLoading(true);
        ref.once("value").then(function (snapshot) {
            snapshot.forEach(function(childSnap){
                console.log(childSnap.val()["nickname"], childSnap.val()["password"])
                if(childSnap.val()["nickname"] === usid && childSnap.val()["password"] === pswd){
                    flag=1
                }
            })
            if(flag===1 && !SignUp){
                localStorage.setItem('nickname', creds.nickname)
                localStorage.setItem('password', creds.password)
                history.push('/roomlist');
                setShowLoading(false);
            }
            else if(!SignUp){
                setShowLoading(false); 
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text:'Incorrect Username/password'
                })
            }
            else if(flag===1 && SignUp){
                setShowLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text:'ID already Exists'
                })
            }
            else if(SignUp){
                const newUser = firebase.database().ref('users/').push();
                newUser.set({...creds, 'password':pswd});
                localStorage.setItem('nickname', creds.nickname);
                localStorage.setItem('password', creds.password)
                history.push('/roomlist');
                setShowLoading(false); 
            }
        })
    };

    return (
        <div id="mainLoginCont">
            <Logo />
            { showLoading && <div className="loadingSpinnerContainer"> <div className="loadingSpinner"> </div> </div> }
            <motion.div id="loginContainer"
                initial={{marginTop: '190px'}}
                animate={{marginTop: '150px'}}
                transition={{duration: 0.3}}>
                <div id="loginContainer_Cont">
                    <img src={img_login} 
                    id="loginImg" alt="Login"/>
                    <form onSubmit={login} id="loginContainerForm">
                        <h2 id="formNickname">Sign In</h2>
                        <input type="text" name="nickname" id="nickname" placeholder="Username" value={creds.nickname} onChange={(e) => {
                            e.persist();
                            setCreds({...creds, "nickname": e.target.value});
                        }} />
                        <input type="password" id="signup-password" placeholder="Password" />
                        <button type="submit" id="login_login"> Login </button>
                        <div id="divStatus">
                            <p id="loginStatus">New User? Please </p>
                            <button type="button" id="ChangeButton" onClick={()=>{
                                    setSignUp(!SignUp)
                            }} > SignUp </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

export default Login;