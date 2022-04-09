import React, { useState, useEffect } from 'react';
import { Buffer } from 'buffer';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'

const md5 = require('md5');

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(Cookies.get('whoami') != undefined);
    });

    const updateInputUsername = (e) => {
        setUsername(e.target.value);
    };

    const updateInputPassword = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        var payload = JSON.stringify({ user: username, password: md5(password) });
        var encoded = Buffer.from(payload).toString('base64');

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: encoded }),
            credentials: 'include'
        };

        fetch(
            "http://localhost:3003/login", requestOptions)
            .then((res) => {
                if (res.status === 200) {
                    setErrorMessage(null);
                    navigate("/profile");
                }
                else if (res.status === 401) {
                    setErrorMessage("Invalid username, password or account does not exist.");
                }
                else {
                    setErrorMessage("Error occured.");
                }
            })
            .catch((reason) => {
                console.log(reason);
                setErrorMessage("Error occured.");
            });
    }

    const handleSignOut = () => {
        Cookies.remove('whoami');
        navigate("/login");
    }

    return (
        !isAuthenticated ?
            (<div>
                <h3>Sign in</h3>
                <div>
                    <div>
                        <input id="username" value={username} onChange={updateInputUsername} placeholder="Username"></input>
                        <input id="password" value={password} onChange={updateInputPassword} placeholder="Password" type="password"></input>
                        <button onClick={handleSubmit}>Submit</button>
                    </div>
                    <div>
                        {errorMessage ? <span class="error">{errorMessage}</span> : null}
                    </div>
                    <span class="note">Sorry, sign up is currently disabled.</span>
                </div>
            </div>)
            :
            (<div><a style={{cursor:'pointer'}} onClick={handleSignOut}>Sign me out</a></div>)
    );
};


export default Login;
