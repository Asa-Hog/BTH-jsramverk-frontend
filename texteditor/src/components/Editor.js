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
import {basicSetup, EditorView} from "codemirror"
import {javascript} from "@codemirror/lang-javascript"
let sendToSocket = true;

const Editor = () => {
    let updateCurrentDocOnChange;
    const [data, setData] = useState('');
    const [name, setName] = useState('');
    const [docs, setDocs] = useState([]);
    const [currentDoc, setCurrentDoc] = useState({});
    const [selectedDoc, setSelectedDoc] = useState({}); // id på valt objekt
    const [socket, setSocket] = useState(null);
    const [token, setToken] = useState("");
    const [currentUser, setCurrentUser] = useState("");
    const [appUsers, setAppUsers] = useState([]);

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

    // Skriver ut användare
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

    const hideSaveForm = () => {
        // Dölj formuläret med CSS
        document.getElementById("saveForm").style.display = "none";
    };

    function showAddEditorButton() {
        // Visa knappen med CSS
        document.getElementById("addEditorButton").style.display = "inline-block";
    }

    async function addEditor() {
        let email = prompt("Enter email of user allowed to edit document: ");

        if (email !== null && email !== "") {
            // Spara email i databasen för det dokumentet - allowed editors
            await docsModel.addEditor(currentDoc, email);
            console.log("spara i databasen");

            let sendInvite = window.confirm(`Do you want to send an invitation to ` + email + `?`);

            // Maila ut inbjudan till användaren?
            if (sendInvite === true ) {
                sendEmail(email);
            }
        }
    };

    async function invite(token) {
        let email = prompt("Enter email of user to invite: ");

        if (email !== null && email !== "") {
            // Spara INTE email i databasen - ska redan vara gjort
            // Maila ut inbjudan till användaren
            sendEmail(email, token);
        }
    };

    const exitCreateDoc = () => {
        // Dölj formuläret med CSS
        document.getElementById("saveForm").style.display = "none";

        // // Ta bort nedanstående om något krånglar!!!
        // let element = document.querySelector("trix-editor");

        // if (element) {
        //     element.value = "";
        //     element.editor.setSelectedRange([0, 0]);
        //     element.editor.insertHTML("");
        // }
    };

    const logout = () => {
        window.location.reload();
    };

    const createObject = async (event) => {
        event.preventDefault();
        let newDoc = {};
        // console.log(currentDoc);
        // console.log(data);

        // newDoc.html = data;
        newDoc.html = currentDoc.html;
        newDoc.name = name;

        console.log(currentUser);
        newDoc.owner = currentUser;
        newDoc.allowedUsers = [currentUser];

        await docsModel.create(newDoc);
        hideSaveForm();
        // console.log("nytt dokument sparat", newDoc);
    };

    const updateObject = async () => { 
        if (currentDoc === undefined) {
            alert("Please choose a file to update");
        } else {
            await docsModel.update(currentDoc);
            // console.log("dok nu uppdaterat");
        }
    };

    const showUsers = async () => {
        let users = await authModel.getAllUsers();
        setAppUsers(users);
    };

    const componentRef = useRef();

    const generatePDF = useReactToPrint({
        content: () => componentRef.current,
        // documentTitle: 'dgf'
        // onAfterPrint: () => alert('Print success')
        copyStyles: false
    });

    const sendEmail = (email, token) => {
        // let currentUser = authModel.currentUser.data.email;
        let res = authModel.invite(email, currentUser, token);
        console.log("editor res", res);

    };

    return (
        <div className = "editor">
            { token ?
            <>
            
            <trix-toolbar id = "trix-toolbar">
            {/* <trix-toolbar className="ordToolbar"></trix-toolbar> */}

                {/* <button className = "button trixButton" onClick = {()=> resetDb() }> Reset </button> */}

                <button className = "button trixButton" onClick = {(event)=> showSaveForm(event) }> Create </button>

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

                <button className = "button trixButton" onClick = {()=> updateObject() }> Update </button>

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

                <button className = "button trixButton" onClick = {()=> logout() }> Code </button>

                <button className = "button trixButton" onClick = {()=> logout() }> Log out </button>

            </trix-toolbar>

            <form className = "saveForm" id = "saveForm" onSubmit = { (event) => { createObject(event);} } style = {{ display: "none" }}> Name of file:
                <input className = "button" id = "fileName" type = "text" value = { name } onChange = { (event) => { setDocName(event); } } >
                </input>

                <input className = "button" type = "submit" value = "Save"></input>
                <button className = "button" onChange = { exitCreateDoc }> Exit </button>
            </form>

            <TrixEditor id = "trixEditorContent" className = "trix-editor" toolbar = "trix-toolbar"
                onChange = { handleChange } ref = { componentRef }
                // onChange={props.change} // value = { data } // input = 'react-trix-editor'
                // autoFocus={true} // default={props.default}
            />

            <div className = "code">
                <textarea id = "code" >
                    <h1>Hello</h1>
                </textarea>
            </div>

            {/* new EditorView({
                doc: "console.log('hello')\n",
                extensions: [basicSetup, javascript()],
                parent: document.body
                }) */}



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
