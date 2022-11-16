import { useState } from "react";
import authModel from "../models/auth"

export default function Login({setToken, setCurrentUser}) {
    const [user, setUser] = useState({});


    function changeHandler(event) {
        let newObject = {};

        newObject[event.target.name] = event.target.value;

        setUser({...user, ...newObject});

        setCurrentUser(user.email);
    }


    async function register() {
        await authModel.register(user);
        alert("User successfully registered");
    }

    async function login() {
        const loginResult = await authModel.login(user);

            if (loginResult.data.token) {
                setToken(loginResult.data.token);
            }
    }

    return (
        <>
        <div className="loginDiv">
            <div className = "loginTitle">Text Editor</div>
            <p className="loginP">Log in to access your account, or sign up today!</p>

            <div className = "loginForm">
                <label className="loginLabel">Email</label>
                <input className = "button loginbutton" type = "email" name = "email" onChange = { changeHandler } required/>
                <label className="loginLabel">Password</label>
                <input className = "button loginbutton" type = "password" name = "password"  onChange = { changeHandler }/>

                <div className="loginButtonsDiv">
                    <button className = "button passwordButton" onClick = { login }> Log in </button>
                    <button className = "button registerButton" onClick = { register }> Sign up </button>
                </div>

            </div>

        </div>
        </>
    );
}
