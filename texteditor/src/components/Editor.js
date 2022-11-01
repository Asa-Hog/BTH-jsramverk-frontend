import React, { useState, useEffect } from 'react';
import { TrixEditor } from "react-trix";
import "trix/dist/trix.css";
import { io } from "socket.io-client";
// import ReactHtmlParser from 'react-html-parser';
// import "trix";
import docsModel from '../models/docsModel';

let sendToSocket = true;

const Editor = () => {
    let updateCurrentDocOnChange;
    let [data, setData] = useState('');
    const [name, setName] = useState('');
    const [docs, setDocs] = useState([]);
    const [currentDoc, setCurrentDoc] = useState({});
    const [selectedDoc, setSelectedDoc] = useState({}); // id på valt objekt
    const [socket, setSocket] = useState(null);

    // // Hämta alla dokument
    useEffect(() => {
        (async () => {
            const allDocs = await docsModel.getAllDocs();
            setDocs(allDocs);
        })();
    }, [currentDoc]); //Laddas om när currentDoc ändras (Om man vill hämta dok från andra browsers?)


    // Skapa en socket mellan frontend och backend - om selectedDoc ändras - till nya dokumentet
    useEffect(() => {
        setSocket(io("http://localhost:1337")); // Ändra från hårdkodat
        if (socket) {
            console.log("create room", selectedDoc);
            socket.emit("create", selectedDoc);
        }

        return () => {
            if (socket) {
                socket.disconnect();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDoc]);


    // Skriver ut innehållet i editorn när data ändras
    useEffect(() => {
        setEditorContent(data, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);


    // Varje gång det ändras i en socket
    useEffect(() => {
        if (socket) {
            socket.on('changedText', (doc) => {
                console.log("3 received in clients", doc);
                sendToSocket = false;
                setEditorContent(doc.html, false);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    useEffect(() => {
        if (socket && sendToSocket) {
            console.log("1 emit from client", currentDoc);
            socket.emit("changedText", currentDoc);
        }
        sendToSocket = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDoc]); // Gör en emit om INNEHÅLLET i currentDoc ändras


    function setEditorContent(content, triggerChange) {
        let element = document.querySelector("trix-editor");

        updateCurrentDocOnChange = triggerChange;
        element.value = "";
        element.editor.setSelectedRange([0, 0]); //
        updateCurrentDocOnChange = triggerChange;
        element.editor.insertHTML(content);
    };

    function handleChange (html, text) { // html = event
        if (updateCurrentDocOnChange) {
            // Skapa nytt obj (copy, som är kopia av currentDoc)
            const copy = Object.assign({}, currentDoc);
            copy.html = html; // Nya objeketet har nya texten sparad i html
            setCurrentDoc(copy); // Skriv över currentDoc
        }

        updateCurrentDocOnChange = true;
    };

    let handleSelectedDoc = () => {
        // Hämta värde ur selectlista
        let docId = document.getElementById("selectDoc").value; // 0, 1, 2
        let doc = docs[docId]; // {"_id": 6140s3f01sd, "title": Saga, "html": Det var en gång}

        setSelectedDoc(doc["_id"]); // 6140s3f01sd - Ett id  1 currentDoc och selectedDoc sätts
        setCurrentDoc(doc); // Ett objekt
        setData(doc.html);
     };

    const resetDb = async () => {
        await docsModel.reset();
    };

    // const printData = () => { 
    //     // console.log("skriv ut i konsollen");
    //     // if (ReactHtmlParser(data)[0].props !== undefined) {
    //     //     console.log( ReactHtmlParser(data)[0].props.children ); // ger en array med objekt i
    //     // }
    //     // for (let row in  ReactHtmlParser(data)[0].props.children[row]) {
    //         // \filtrera ut element (br mm ?
    //     //     console.log(row);
    //     // }
    //     if (data !== undefined) {
    //         console.log(data);
    //     };
    // };

    const setDocName = (event) => {
        // console.log(event.target.value);
        setName(event.target.value);
    };

    const showSaveForm = () => {
        // Visa formuläret med CSS
        document.getElementById("saveForm").style.display = "block";
    };

    const createObject = async (event) => {
        event.preventDefault();
        let newDoc = {};
        newDoc.html = data;
        newDoc.name = name;
        await docsModel.create(newDoc);
    };

    const updateObject = async () => { 
        if (currentDoc === undefined) {
            alert("Please choose a file to update");
        } else {
            console.log(currentDoc);
            // console.log(data);
            // currentDoc.html = data; // Ändrar html för currentDoc till det som står i editorn
            await docsModel.update(currentDoc);
        }
    };

    return (
        <div className = "editor">

            <trix-toolbar id = "trix-toolbar">

                <button className = "button" onClick = {()=> resetDb() }> Reset </button>
                <button className = "button" onClick = {(event)=> showSaveForm(event) }> Create new </button>

                <select id = "selectDoc" onChange = { handleSelectedDoc } >
                    <option value = "-99" key = "0"> Choose a document </option>
                    {docs.map((doc, index) => <option value = {index} key = {index}> {doc.name} </option>)}
                </select>

                <button className = "button" onClick = {()=> updateObject() }> Update </button>
            </trix-toolbar>

            <form className = "saveForm" id = "saveForm" onSubmit = { (event) => { createObject(event);} } style = {{display: "none"}}>Name of file:
                <input className = "button" id = "fileName" type = "text" value = { name } onChange = { (event) => { setDocName(event); } } >
                </input>

                <input className = "button" type = "submit" value = "Save"></input>
            </form>

            <TrixEditor id = "trixEditorContent" className = "trix-editor" toolbar = "trix-toolbar"
                onChange = { handleChange }
                // onChange={props.change}
                // value = { data }
                // input = 'react-trix-editor'
                // autoFocus={true}
                // default={props.default}
            />
        </div>
    )
}

export default Editor


// Exemplet från föreläsning med att socket inte ska trigga ett change-event i frontend:

//   function handleChange(html, text) {
//     if (updateCurrentDocOnChange) {
//         const copy = Object.assign({}, currentDoc);
//         copy.html = html;
//         setCurrentDoc(copy);
//     }

//     updateCurrentDocOnChange = true;
//   }

//   function setEditorContent(content, triggerChange) {
//       let element = document.querySelector("trix-editor");

//       updateCurrentDocOnChange = triggerChange;
//       element.value = "";
//       element.editor.setSelectedRange([0, 0]);
//       updateCurrentDocOnChange = triggerChange;
//       element.editor.insertHTML(content);
//   }

// Exempel från föreläsningen om throttling:

// let throttleTimer;

// io.sockets.on('connection', function(socket) {
//     socket.on('create', function(room) {
//         socket.join(room);
//     });

//     socket.on("docsData", function (data) {
//         socket.to(data["_id"]).emit("docsData", data);

//         clearTimeout(throttleTimer);
//         console.log("writing");
//         throttleTimer = setTimeout(function() {
//             console.log("now it should save to database")
//         }, 2000);
//     });
// });

// Jag hade lite problem med att min markör hela tiden hoppade till slutet av min text i trixeditor i React när jag skrev i editorn efter att ha implementerat sockets. Det gjorde det svårt att ändra text "mitt i" ett textblock. Visade sig bero på att setEditorContent funktionen rensar editorn och lägger in nytt innehåll. Efter att ha pratat med @efo modifierade jag setEditorContent funktionen till följande (delar här om någon sitter med samma problem) vilket verkar fungera (markören "stannar" där den var): 

// const cursorPos = useRef([]);

// function setEditorContent(content: string, triggerChange: boolean) {
//         let element = document.querySelector("trix-editor") as any | null;

//         updateCurrentDocOnChange = triggerChange;
//         // Get selected range (save the current cursor position)
//         cursorPos.current = element.editor.getSelectedRange();
//         element.value = "";
//         element.editor.setSelectedRange([0, 0]);
//         updateCurrentDocOnChange = triggerChange;
//         element.editor.insertHTML(content);
//         // Set selected range to the "old" cursor position
//         element.editor.setSelectedRange(cursorPos.current);
//     }
