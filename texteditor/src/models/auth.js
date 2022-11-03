import docsModel from "../models/docsModel";

const baseUrl = docsModel.baseUrl; //"http://localhost:1337";

const auth = {
    // token: "",

    login: async function login(user) {
        const response = await fetch(`${baseUrl}/auth/login`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "content-type": "application/json"
            }
        });

        const result = await response.json();

        // console.log(result.token);

        return result;
        // if (result.data.token) {
        //     auth.token = result.data.token;
        // }
    },

    register: async function register() {

    },
};

export default auth;