import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    }
    const onNameHandler = (event) => {
        setName(event.currentTarget.value);
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }
    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value);
    }
    const navigate = useNavigate();
    const navigateToLogin = () => {
        navigate("/login");
    };

    // 회원가입 코드
    const onSubmitHandler = async (e) => {
        // 만약 비밀번호와 비밀번호 확인이 달랐다면 거르기
        if(password !== confirmpassword){
            return alert('비밀번호와 비밀번호 확인이 같지 않습니다.');
        }
        // 새로고침 방지
        e.preventDefault();

        const url = 'http://localhost:3001/signup';
        const body = {
            email: email,
            name: name,
            password: password
        };

        // email, 이름, 비밀번호를 넣어서 백엔드로 전송
        await axios.post(url, body)
        .then(function (res) {
            // 회원가입에 성공했으면 알림
            if (res.data.result === "success") {
                alert("회원가입이 완료되었습니다.");
                // 로그인 페이지로 돌려보내기
                navigateToLogin();
            } else {
                // UNIQUE 제약조건이나 NULL 제약조건을 지키지 않은 경우, 혹은 EMAIL CHECK 제약조건에서 걸린 경우
                alert("이미 존재하는 ID거나 잘못된 email 형식입니다.");
            }
        })
        .catch (function (error) {
            console.log(error);
            alert("ERROR!");
        });
    }

    // 최초 접근 시
    useEffect(() => {
        setEmail(null);
        setName(null);
        setPassword(null);
        setConfirmPassword(null);
    }, []);

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
            }}>
            <form style={{ display: 'flex', flexDirection: 'column'}}>
                <label>Email</label>
                <input type='email' value={email} onChange={onEmailHandler}/>
                <label>Name</label>
                <input type='text' value={name} onChange={onNameHandler}/>
                <label>Password</label>
                <input type='password' value={password} onChange={onPasswordHandler}/>
                <label>Confirm Password</label>
                <input type='password' value={confirmpassword} onChange={onConfirmPasswordHandler}/>
                <br />
                <button onClick={onSubmitHandler}>
                    Register
                </button>
                <button onClick={navigateToLogin}>
                    Go Back
                </button>
            </form>
        </div>
    )
}

export default RegisterPage;