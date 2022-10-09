import React, { useState, useEffect } from 'react';
// import ReactHtmlParser from 'react-html-parser';
import { TrixEditor } from "react-trix";
// import "trix";
import "trix/dist/trix.css";
// import saveForm from './saveForm';
import { io } from "socket.io-client";

import docsModel from '../models/docsModel';


const Editor = () => {
    // let socket;
    let [data, setData] = useState('');
    const [name, setName] = useState('');
    const [docs, setDocs] = useState([]);
    const [currentDoc, setCurrentDoc] = useState({});
    const [socket, setSocket] = useState(null);

    // Hämta alla dokument
    useEffect(() => {
        (async () => {
            const allDocs = await docsModel.getAllDocs();
            setDocs(allDocs);
        })();
    }, [currentDoc]);

    // Skapa en socket mellan frontend och backend
    useEffect(() => {
        setSocket(io("http://localhost:1337")); // Ändra från hårdkodat

        return () => {
            if (socket) {
                socket.disconnect();
            }
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDoc]); // (selectedDoc?)


    // Varje gång det skapas/ ändras i en socket, skriv ut i consolen
    useEffect(() => {
        if (socket) {
            socket.on("doc", function(data) {
                console.log("doc", data);
                setData(data.html);
                setName(data.name);
                setEditorContent(data);
            });
        }
    });//[socket]??

    // if (socket) {
    //     socket.on("doc", (data) => {
    //         setEditorData(data.html, false);
    //     });
    // }

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

    let handleSelectedDoc = () => {
        // Hämta värde ur selectlista
        let selectedDocId = document.getElementById("selectDoc").value;
        let selectedDoc = docs[selectedDocId];

        setCurrentDoc(selectedDoc);
        if (selectedDoc !== undefined) {
            setEditorContent(selectedDoc);
        }
     };

    // console.log(event); // hela html
    // console.log(event.target); // De använde event.target.value
    // function setEditorContent(content, triggerChange) {
    function setEditorContent(doc) {
        // let element = document.getElementById("selectDoc"); // element.editor is undefined - ej med nedanstående element som är samma sak
        let element = document.querySelector("trix-editor");

        element.value = "";
        // element.editor.setSelectedRange([0, 0]);
        element.editor.insertHTML(doc.html);
};

    const resetDb = async () => {
        await docsModel.reset();
    };

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
        // console.log("Hämta namn");
        // let docName = document.getElementById("saveForm").value;
        // let docName = document.querySelector("saveForm").value; // document.querySelector(...) is null
        // console.log(docName); //undefined
        newDoc.name = name;

        // console.log("emit newDoc");
        // socket.emit("createDoc", newDoc); // Skapar ett room på servern med
        await docsModel.create(newDoc);
    };

    const updateObject = async () => { 
        if (currentDoc === undefined) {
            alert("Please choose a file to update");
        } else {
            currentDoc.html = data; // Ändrar html för currentDoc till det som står i editorn
            await docsModel.update(currentDoc);
            // console.log("current_doc_id ", currentDoc._id);
            // console.log("current_data ", data);
        }
    };

    // const saveObject = () => { 
    //     console.log( "spara objekt" );
    // };

    // let handleEditor = (e, editor) => { 
    //     // setData(editor.getData());
    //     setData("nytt");
    // }

    // handleEditorReady(editor) {
    //     // this is a reference back to the editor if you want to
    //     // do editing programatically
    //     editor.insertString("editor is ready");
    //   };

    let setEditorData = (event) => {


        setData(event);
        currentDoc.html = data;
        console.log(data);

        console.log("currentDoc", currentDoc);
        // console.log(docs[selectedDocId]);
        // console.log("emit create");
        // socket.emit("create", docs[selectedDocId]);
        socket.emit("create", currentDoc);


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
                // editor = {TrixEditor}
                // onEditorReady = {(event, editor) => {onEditorReady(event, editor) }}
                onChange = { setEditorData } 
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


// Exemplet från föreläsning med att socket in ska trigga ett change-event i frontend:

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


// eriknastesjo
//  — 
// Idag 09:23
// Hej! Jag kanske missade när du använde setEditorContent i tidigare kmom. När/hur ska man kunna hinna kalla på den för att ändra updateCurrentDocOnChange till false innan onChange-eventet sker? Tänker just i samband med sockets.
// efo
//  — 
// Idag 09:57
// I min kod ser det ut så här:

// socket.on("docsData", (data) => {
//       setEditorContent(data.html, false);
//     });
