import { useState } from "react";
import authModel from "../models/auth"

export default function Login({setToken}) {
    const [user, setUser] = useState({});

    function changeHandler(event) {
        let newObject = {};

        newObject[event.target.name] = event.target.value;

        setUser({...user, ...newObject});
    }


    async function register() {
        await authModel.register(user);
    }

    async function login() {
        const loginResult = await authModel.login(user);

        if (loginResult.data.token) {
            setToken(loginResult.data.token);
        }
    }

    return (
        <>
        <h2>Login or register</h2>

        {/* <form> */}
            <input className = "button" type = "email" name = "email" onChange = { changeHandler }/>
            <input className = "button" type = "password" name = "password"  onChange = { changeHandler }/>

            <button className = "button" onClick = { login }> Log in </button>
            <button className = "button" onClick = { register }> Register </button>
        {/* </form> */}
        </>
    );
}

// Lägg in checkToken på allt vi vill hämta från backend. Det ska inte gå att hämta data om token inte finns, eller är expired, eller inte stämmer