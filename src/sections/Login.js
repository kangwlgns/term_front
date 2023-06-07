import axios from 'axios';
import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import logo from './logo.jpg';

function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }

    const navigate = useNavigate();
    const navigateToRegister = () => {
        navigate("/registerPage");
    };
    const navigateToMainPage = () => {
        const url = 'localhost:3001/';
        const data = {email: email, password: password};

        axios.post(url, data)
            .then(res => {
                if (res.data.result === "success") {
                    navigate("/main");
                } else {
                    alert("아이디 혹은 패스워드가 틀렸습니다.");
                }
            })
            .catch(error => {
                console.error(error);
                alert("ERROR!");
            });
    };

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>

            <form style={{ display: 'flex', flexDirection: 'column'}}>
                <div>
                    <img src={logo} alt="hi"/>
                </div>
                <label>Email</label>
                <input style={{width: '30%',margin: '0 auto'}} type='email' value={email} onChange={onEmailHandler}/>
                <label>Password</label>
                <input style={{width: '30%',margin: '0 auto'}} type='password' value={password} onChange={onPasswordHandler}/>
                <br />
                <button style={{width: '30%',margin: '0 auto'}} onClick ={navigateToMainPage}>
                    Login
                </button>
                <button style={{width: '30%',margin: '0 auto'}} onClick={navigateToRegister}>
                    SignUp
                </button>
            </form>

        </div>
    )
}

export default Login;