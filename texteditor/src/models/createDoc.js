const docs = {
    getAllDocs: async function getAllDocs() {
        let a = `${URL}/docs`;
        console.log("helo world");
        console.log("url is "+ a);
        // const response = await fetch(`${URL}/docs`); // Hämtar allt som ligger bakom url/docs
        const response = await fetch("http://localhost:1337/createDocs");//Fetch ger sträng
        // Får inte fram rätt url från två rader upp

        const result = await response.json(); // Gör om sträng till json

        console.log(result);
        console.log(result.data);

        // return result.data; // Skriver jag in detta som det ska vara får jag undefined
        return result;
    },
};

export default docs;