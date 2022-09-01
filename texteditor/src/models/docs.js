const docs = {
    // setCurrentDoc: async function getAllDocs() {
    //     let a = `${URL}/docs`;
    //     // console.log("hello world");
    //     // console.log("url is: " + a);
    //     // // const response = await fetch(`${URL}/docs`); // Hämtar allt som ligger bakom url/docs
    //     const response = await fetch("http://localhost:1337/docs");//Fetch ger sträng
    //     // // Får inte fram rätt url från två rader upp

    //     const result = await response.json(); // Gör om sträng till json

    //     console.log(result);
    //     // console.log(result.data);

    //     // // return result.data; // Skriver jag in detta som det ska vara får jag undefined
    //     return result;
    // },

    getAllDocs: async function getAllDocs() {
        let a = `${URL}/docs`;
        // console.log("hello world");
        // console.log("url is: " + a);
        // // const response = await fetch(`${URL}/docs`); // Hämtar allt som ligger bakom url/docs
        const response = await fetch("http://localhost:1337/docs");//Fetch ger sträng
        // // Får inte fram rätt url från två rader upp

        const result = await response.json(); // Gör om sträng till json

        console.log(result);
        // console.log(result.data);

        // // return result.data; // Skriver jag in detta som det ska vara får jag undefined
        return result;
    },

    create: async function create(doc) {
        // const response = await fetch(`${URL}/create`);
        const response = await fetch("http://localhost:1337/create",
            { 
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(doc)
            }
        );

        // Response är det jag får från backend /create. I det här fallet ett objekt m ett nytt id
        console.log(response);
        const result = await response.json(); // Gör om sträng till json
        console.log(result);

        // Gör en koll så response/result status blev 201 - dvs att dokumentet skapades
        // console.log(result.result.ops); //undefined - ger error
        //  if (result.result.ok) {
        //     return res.status(201).json({ data: result.ops });
        // }
        // return result.data; // Skriver jag in detta som det ska vara får jag undefined

        // Göra nåt med id:t jag får tillbaka?

        return result;
    },

    update: async function update(doc) {
        // const response = await fetch(`${URL}/update/:id`);
        const response = await fetch("http://localhost:1337/update",
            { 
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                // headers: {'Content-Type': 'Access-Control-Allow-Origin'},
                // headers: {"Content-type": "application/x-www-form-urlencoded"},
                body: JSON.stringify(doc)
            }
        );

        console.log(response); // Response jag får är fel
        const result = await response.json(); // Gör om response till json
        console.log(result); // Tomt, pga att response är fel
        return result;
    }
};

export default docs;
