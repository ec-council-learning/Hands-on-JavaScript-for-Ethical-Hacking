import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const md5 = require('md5');

function Profile() {
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        };

        fetch(
            "http://localhost:3003/isAuthenticated", requestOptions)
            .then((res) => {
                if(res.status !== 200){
                    Cookies.remove("whoami");
                }
                setIsAuthenticated(res.status === 200);
            });
    });

    const updateInputPassword = (e) => {
        setPassword(e.target.value);
    };

    const updateInputConfirmation = (e) => {
        setCPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        var payload = JSON.stringify({ password: md5(password) });

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: payload
        };

        fetch(
            "http://localhost:3003/changePassword", requestOptions)
            .then((res) => {
                if(res.status == 200){
                    navigate("/");
                }
            });
    }

    return (
        <div>
            <h3>Change password</h3>
            {isAuthenticated ?
                <div>
                    <input id="password" value={password} onChange={updateInputPassword} placeholder="New password" type="password"></input>
                    <input id="cPassword" value={cPassword} onChange={updateInputConfirmation} placeholder="Retype password" type="password"></input>
                    <button onClick={handleSubmit} disabled={password !== cPassword}>Submit</button>
                </div>
                :
                <p><h4>Unauthorized</h4></p>}
        </div>
    );
}
export default Profile;
