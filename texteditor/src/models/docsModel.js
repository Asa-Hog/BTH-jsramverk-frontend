const docsModel = {

    baseUrl: window.location.href.includes("localhost") ? 
        "http://localhost:1337" :
        "https://bth-jsramverk-editor-asho20.azurewebsites.net", //driftsatt i Azure


    reset: async function reset() {
        const response = await fetch(`${docsModel.baseUrl}/reset`);

        const result = await response.json();

        return result.data;
    },

    getAllDocs: async function getAllDocs() {
        const response = await fetch(`${docsModel.baseUrl}/docs`);

        const result = await response.json();

        return result.data;
    },


    create: async function create(newDoc) {
        // console.log("newDoc model", newDoc);
        const response = await fetch(`${docsModel.baseUrl}/create`,
            { 
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                // headers: {'Content-Type': 'Access-Control-Allow-Origin'},
                body: JSON.stringify(newDoc)
            }
        );

        const result = await response.json();
        // console.log("frontend docsmodel result create", result);
        return result.data;
    },

    update: async function update(doc) {
        // const response = await fetch(`${URL}/update/:id`);
        const response = await fetch(`${docsModel.baseUrl}/update`,
            { 
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                // headers: {'Content-Type': 'Access-Control-Allow-Origin'},
                // headers: {"Content-type": "application/x-www-form-urlencoded"},
                body: JSON.stringify(doc)
            }
        );

        const result = await response.json();
        // console.log("frontend docsmodel result update", result);
        return result;
    }
};

export default docsModel;
