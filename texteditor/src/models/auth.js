import docsModel from "../models/docsModel";

const baseUrl = docsModel.baseUrl; //"http://localhost:1337";

const auth = {
    // token: "",

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
        // console.log(result.token);

        return result;
        // if (result.data.token) {
        //     auth.token = result.data.token;
        // }
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

        if (result) {
            let emailList = [];
            for (let i = 0; i < result.data.users.length; i++) {
                emailList.push(result.data.users[i].email)
            }
            return emailList;
        }
    },

    invite: async function invite(email) {
        console.log("1 frontend model invite function");
        const response = await fetch(`${baseUrl}/auth/invite`,
        {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(email)
        });

        console.log("4 frontend model response", response);

        // const result = await response.json();

        // return result.data;
    }
};

export default auth;