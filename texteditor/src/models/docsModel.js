const docsModel = {

    baseUrl: window.location.href.includes("localhost") ? 
        "http://localhost:1337" :
        "https://bth-jsramverk-editor-asho20.azurewebsites.net", //driftsatt i Azure


    getCurrentUser: function getCurrentUser() {
        const res = fetch(`${docsModel.baseUrl}/users/currentUser`);

        // const result = response.json();

        return res.data;
    },


    reset: async function reset() {
        const response = await fetch(`${docsModel.baseUrl}/reset`);

        const result = await response.json();

        return result.data;
    },


    getAllDocs: async function getAllDocs(token) {
        const response = await fetch(`${docsModel.baseUrl}/docs`
        , {
            headers: {
                "x-access-token": token
            }
        }
        );

        const result = await response.json();

        return result.data;
    },


    create: async function create(newDoc) {
        const response = await fetch(`${docsModel.baseUrl}/create`,
            { 
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newDoc)
            }
        );

        const result = await response.json();

        return result.data;
    },

    update: async function update(doc) {
        // const response = await fetch(`${URL}/update/:id`);
        const response = await fetch(`${docsModel.baseUrl}/update`,
            { 
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(doc)
            }
        );

        const result = await response.json();

        return result;
    },

    addEditor: async function addUser(doc, email) {
        let data = {doc: doc,
             email:email};

        const response = await fetch(`${docsModel.baseUrl}/addEditor`,
            { 
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        return result;
    },

    getAllowedUsers: async function getAllowedUsers(selectedDoc) {
        console.log(selectedDoc);

    },

    execute: async function execute(data) {
        const res = await fetch("https://execjs.emilfolino.se/code", {
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        });

        const result = await res.json();

        return result;

    }
};

export default docsModel;
