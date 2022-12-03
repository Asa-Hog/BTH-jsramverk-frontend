import docsModel from "../models/docsModel";

const baseUrl = docsModel.baseUrl; //"http://localhost:1337";

const auth = {
    currentUser: "",

    login: async function login(user) {
        const response = await fetch(`${baseUrl}/auth/login`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "content-type": "application/json"
            }
        });

        const result = await response.json();

        this.currentUser = result;

        return result;
    },

    register: async function register(user) {
        const response = await fetch(`${baseUrl}/auth/register`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "content-type": "application/json"
            }
        });

        const result = await response.json();

        return result;
    },


    getAllUsers: async function getAllUsers() {
        const response = await fetch(`${baseUrl}/graphql`
            , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ query: "{ users { email } }" })
            }
        );
        const result = await response.json();

        if (result && result.data.users) {
            let emailList = [];
            for (let i = 0; i < result.data.users.length; i++) {
                emailList.push(result.data.users[i].email)
            }
            return emailList;
        }
    },

    invite: async function invite(email) {
        const response = await fetch(`${baseUrl}/auth/invite/${email}`);

        return response;
    }
};

export default auth;