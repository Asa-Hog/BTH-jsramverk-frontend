import React, { useState, useEffect, useRef } from 'react';
import { TrixEditor } from "react-trix";
import "trix/dist/trix.css";
import { io } from "socket.io-client";
// import ReactHtmlParser from 'react-html-parser';
// import "trix";
import docsModel from '../models/docsModel';
import authModel from '../models/auth';
// import Login from "./components/Login";
import Login from "./Login";
import {useReactToPrint} from 'react-to-print';
import CodeEditor from "@monaco-editor/react";
var Buffer = require('buffer/').Buffer
let sendToSocket = true;

const Editor = () => {
    let updateCurrentDocOnChange;
    const componentRef = useRef();
    const codeRef = useRef();
    const [data, setData] = useState('');
    const [docs, setDocs] = useState([]);
    const [currentDoc, setCurrentDoc] = useState({});
    const [selectedDoc, setSelectedDoc] = useState(""); // id på valt objekt
    const [socket, setSocket] = useState(null);
    const [token, setToken] = useState("");
    const [currentUser, setCurrentUser] = useState("");
    const [appUsers, setAppUsers] = useState([]);
    const [codeData, setCodeData] = useState('');
    const [codeResult, setCodeResult] = useState('');

    // Hämta alla dokument
    useEffect(() => {
        (async () => {
            const allDocs = await docsModel.getAllDocs(token);
            setDocs(allDocs);
        })();
    }, [currentDoc, token]); //Laddas om när currentDoc ändras (Om man vill hämta dok från andra browsers?)

    // Skapa en socket mellan frontend och backend - om selectedDoc ändras - till nya dokumentet
    useEffect(() => {
        setSocket(io(docsModel.baseUrl));
        if (socket) {
            // console.log("create room", selectedDoc);
            socket.emit("create", selectedDoc);
        }

        if (document.getElementById("addEditorButton")) {
            showAddEditorButton();
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

    // Skriver ut innehållet i kod-editorn när data ändras
    useEffect(() => {
        setCodeEditorContent(codeResult, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [codeResult]);

    // Skriver ut alla användare av appen
    useEffect(() => {
        showUsers();
    }, []);

    // Varje gång det ändras i en socket
    useEffect(() => {
        if (socket) {
            socket.on('changedText', (doc) => {
                // console.log("3 received in clients", doc);
                sendToSocket = false;
                setEditorContent(doc.html, false);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    useEffect(() => {
        if (socket && sendToSocket) {
            // console.log("1 emit from client", currentDoc);
            socket.emit("changedText", currentDoc);
        }
        sendToSocket = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDoc]); // Gör en emit om INNEHÅLLET i currentDoc ändras

    function setEditorContent(content, triggerChange) {
        let element = document.querySelector("trix-editor");

        if (element) {
            updateCurrentDocOnChange = triggerChange;
            element.value = "";
            element.editor.setSelectedRange([0, 0]); //
            updateCurrentDocOnChange = triggerChange;
            element.editor.insertHTML(content);
        }
    };

    function setCodeEditorContent(content, triggerChange) {
        // let element = document.querySelector("trix-editor");
        let element = document.getElementById("code-editor");
        // console.log(element);
        // console.log(element2);

        if (element) {
            updateCurrentDocOnChange = triggerChange;
            element.value = "";
            // element.setSelectedRange([0, 0]); //
            updateCurrentDocOnChange = triggerChange;
            element.innerHTML = content;
        }

        // codeRef.insertHTML(decodedResult);
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
        if (docId !== "-99") {
            let doc = docs[docId]; // {"_id": 6140s3f01sd, "title": Saga, "html": Det var en gång}

            setSelectedDoc(doc["_id"]); // 6140s3f01sd - Ett id  1 currentDoc och selectedDoc sätts
            setCurrentDoc(doc); // Ett objekt
            setData(doc.html);
        }
     };

    const resetDb = async () => {
        await docsModel.reset();
    };

    const showSaveForm = () => {
        // Visa formuläret med CSS
        document.getElementById("saveForm").style.display = "block";
    };

    const hideSaveForm = () => {
        // Dölj formuläret med CSS
        document.getElementById("saveForm").style.display = "none";
    };

    const showCodeDiv = () => {
        // Visa formuläret med CSS
        document.getElementById("codeDiv").style.display = "block";
    };


    const hideCodeDiv = () => {
        // Dölj formuläret med CSS
        document.getElementById("codeDiv").style.display = "none";
    };

    const showTrixEditor = () => {
        // Visa formuläret med CSS
        document.getElementById("trixEditorContent").style.display = "block";
    };


    const hideTrixEditor = () => {
        // Dölj formuläret med CSS
        document.getElementById("trixEditorContent").style.display = "none";
    };

    function showAddEditorButton() {
        // Visa knappen med CSS
        document.getElementById("addEditorButton").style.display = "inline-block";
    }

    async function addEditor() {
        let docId = document.getElementById("selectDoc").value; // 0, 1, 2

        if (docId === "-99") {
            alert("Choose a document first.");
        } else {
            let email = prompt("Enter email of user allowed to edit document: ");

            if (email !== null && email !== "") {
                // Spara email i databasen för det dokumentet - allowed editors
                await docsModel.addEditor(currentDoc, email);
    
                let sendInvite = window.confirm(`Do you want to send an invitation to ` + email + `?`);
    
                // Maila ut inbjudan till användaren?
                if (sendInvite === true ) {
                    sendEmail(email);
                }
            }
        }
    };

    const exitCreateDoc = (event) => {
        event.preventDefault();
        // Dölj formuläret med CSS
        document.getElementById("saveForm").style.display = "none";
    };

    const logout = () => {
        window.location.reload();
    };

    const createReset = () => {
        document.getElementById("selectDoc").value = "-99";
        setCurrentDoc({});
        setSelectedDoc({});
        setData("");
    };

    const create = async (event) => {
        event.preventDefault();

        let newName = document.getElementById("fileName").value;
        let newDoc = {};

        newDoc.html = currentDoc.html;
        newDoc.name = newName;
        newDoc.type = "text";

        if (newDoc.name === null || newDoc.name === "" || newDoc.name === undefined) {
            alert("Document must have a title");
        } else {
            newDoc.owner = currentUser;
            newDoc.allowedUsers = [currentUser];

            await docsModel.create(newDoc);
            hideSaveForm();
        }

        setEditorContent("", false);
    };

    const update = async () => { 
        // Hämta värde ur selectlistan. Om värdet är -99 har inget dokument valts
        let docId = document.getElementById("selectDoc").value; // 0, 1, 2

        if (docId === "-99") {
            alert("Please choose a document to update.");
        } else {
            let res = await docsModel.update(currentDoc);

            if (res.status === 200) {
                alert("Document updated");
            }
        }
    };

    const showUsers = async () => {
        let users = await authModel.getAllUsers();
        setAppUsers(users);
    };

    const generatePDF = useReactToPrint({
        content: () => componentRef.current,
        copyStyles: false
    });

    async function invite() {
        let email = prompt("Enter email of user to invite: ");

        if (email !== null && email !== "") {
            // Spara INTE email i databasen - ska redan vara gjort
            // Maila ut inbjudan till användaren
            sendEmail(email);
        }
    };

    const sendEmail = async (email) => {
        let res = await authModel.invite(email);

        if (res.status === 200 ) {
            setTimeout(function () {window.alert("Email sent.");}, 1000);
        }
    };
    
    async function execute() {
        // create a buffer
        let buff = Buffer.from(codeData, 'utf-8');
        // decode buffer as Base64
        let encodedData = buff.toString('base64');
        let data = {
            code: encodedData

        };

        let res = await docsModel.execute(data);

        let encodedResult = res.data;
        // create a buffer
        buff = Buffer.from(encodedResult, 'base64');
        // decode buffer as UTF-8
        let decodedResult = buff.toString('utf-8');

        setCodeResult(decodedResult);


        // Fel med codeResult i st för Data om ska fungera med sockets?

        // Spara resultat i databasen....

        // Lägg till code-typ på dokumentet

        // Toggle Code-knappen

        // Göm/ visa texteditor/ codeeditor

        // Sätt samtidigt värdet på type till ena eller andra
    };

    return (
        <div className = "editor">
            { token ?
            <>
            
            <trix-toolbar id = "trix-toolbar">
            {/* <trix-toolbar className="ordToolbar"></trix-toolbar> */}

                <button className = "button trixButton" onClick = {()=> resetDb() }> Reset </button>

                <button className = "button trixButton"  onClick = {(event)=> {showSaveForm(event); createReset();} }> Create </button>

                { docs ?
                    <>
                <select id = "selectDoc" className = " button trixButton" onChange = { handleSelectedDoc } >
                     <option value = "-99" key = "0"> Choose a document </option>
                   {docs.map((doc, index) => <option value = {index} key = {index}> {doc.name} </option>)}
                    {/* {docs.map((doc, index) => <option value = {index} key = {index}> {doc} </option>)} */}
                </select>
                </>
                :
                <h2>"Docs not found"</h2>
                }

                <button className = "button trixButton" onClick = {()=> update() }> Update </button>

                <button id = "addEditorButton" className = "button trixButton" onClick = { addEditor }> Add editor </button>

                { appUsers ?
                    <>
                <select className = "button trixButton usersDiv" id = "usersDiv">
                    <option value = "-99" key = "0"> App users </option>
                    { appUsers.map((appUser, index) => <option value = { index } key = { index }> { appUser } </option>)}
                </select>
                </>
                :
                <h2>"Users not found"</h2>
                }

                <button className = "button trixButton" onClick = {()=> generatePDF() }> Print </button>

                <button className = "button trixButton" onClick = {()=> logout() }> Comment </button>

                <button className = "button trixButton" onClick = {()=> invite() }> Invite </button>

                <button className = "button trixButton" onClick = {()=> { hideTrixEditor(); showCodeDiv();} }> Code </button>

                <button className = "button trixButton" onClick = {()=> logout() }> Log out </button>

            </trix-toolbar>

            <form className = "saveForm" id = "saveForm"  style = {{ display: "none" }}> Name of file:
                
                <input className = "button" id = "fileName" type = "text" required >
                </input> 

                <button  type="submit" className = "button" onClick = { (event) => { create(event); }}> Save </button>

                <button className = "button" onClick = { (event) => { exitCreateDoc(event); } }> Exit </button>
            </form>

            <TrixEditor id = "trixEditorContent" className = "trix-editor" toolbar = "trix-toolbar"
                onChange = { handleChange }
                // onChange={props.change} // value = { data } // input = 'react-trix-editor'
                // autoFocus={true} // default={props.default}
            />

            <div id = "codeDiv" className = "codeDiv">
                <div className = "codeTop">
                    JS code editor
                </div>
                <CodeEditor
                    height="30vh"
                    defaultLanguage="javascript"
                    theme="vs-dark"
                    defaultValue='let a = "3";
                    console.log(a);'
                    onChange= {(value) => setData(value)}
                    //  onChange = { handleChange }  // Skriver ut datan = koden i text editor (gör inget- syns inte? Jo, för socket skriv ut i code editor)
                />

                <button className = "button trixButton" onClick = {()=> execute() }> Execute </button>

                <div className = "codeTop">
                    Result terminal
                </div>
                <div id = "code-editor" className = "code code-editor">
                </div>
            </div>

             </>
             : 
            <Login setToken = { setToken } setCurrentUser = { setCurrentUser } />
            } 
        </div>
    )
} 

export default Editor

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
