import React, { useState, useEffect, useRef } from 'react';
import { TrixEditor } from "react-trix";
import "trix/dist/trix.css";
import { io } from "socket.io-client";
import docsModel from '../models/docsModel';
import authModel from '../models/auth';
import Login from "./Login";
import { useReactToPrint } from 'react-to-print';
import CodeEditor from "@monaco-editor/react";
import { Buffer } from 'buffer';
let sendToSocket = true;
let noOfComments = 0;

const Editor = () => {
    let updateCurrentDocOnChange;
    const cursorPos = useRef([]);
    const textRef = useRef();
    const codeRef = useRef();
    const [data, setData] = useState('');
    const [docType, setDocType] = useState('text');
    const [docs, setDocs] = useState([]);
    const [currentDoc, setCurrentDoc] = useState({});
    const [selectedDoc, setSelectedDoc] = useState(""); // id på valt objekt
    const [socket, setSocket] = useState(null);
    const [token, setToken] = useState("");
    const [currentUser, setCurrentUser] = useState("");
    const [appUsers, setAppUsers] = useState([]);
    const [codeData, setCodeData] = useState('');
    const [codeResult, setCodeResult] = useState('');
    const [codePrintResult, setCodePrintResult] = useState('');
    const [editorModel, setEditorModel] = useState("");
    const [valueChange, setValueChange] = useState('');
    const [comments, setComments] = useState([]);
    const [docCreated, setDocCreated] = useState("");
    const [commentCreated, setCommentCreated] = useState("");

    // Hämta alla dokument
    useEffect(() => {
        (async () => {
            const allDocs = await docsModel.getAllDocs(token);
            setDocs(allDocs);
        })();
    }, [currentDoc, token, docCreated, commentCreated]); // Laddas om när currentDoc ändras (Om man vill hämta dok från andra browsers)

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
    }, [data]); //

    // Ändrar currentDoc när innehållet i kod-editorn ändras
    useEffect(() => {
        currentDoc.html = valueChange;

        // När det gjorts ändring i code-editorn skickar jag datan via sockets
        if (socket && sendToSocket) {
            // console.log("1b emit from client", currentDoc);
            socket.emit("changedText", currentDoc);
        }
        sendToSocket = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [valueChange]); //

    // Skriver ut innehållet i kod-terminalen när data ändras
    useEffect(() => {
        setCodeTerminalContent(codeResult);
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

                setData(doc.html); ///
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

    // Gör så att dokumentet rensas då jag försöker skapa ett nytt
    useEffect(() => {
        if (currentDoc.html === "" || currentDoc.html === undefined) {
            if (document.getElementsByClassName("trix-editor")[0]) {
                document.getElementsByClassName("trix-editor")[0].value = "";
                document.getElementsByClassName("commentsDiv")[0].style.display = "none";
                document.getElementsByClassName("trix-editor")[0].style.width = "87.5vw";
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDoc]);

    useEffect(() => {
        setEditorContent(currentDoc.html, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [commentCreated]);

    const editorDidMount = (editor) => {
        const editorModel = editor.getModel();

        setEditorModel(editorModel);
    };

    async function setEditorContent(content, triggerChange) {
        if (document.getElementById("selectDoc") && docs) {
            let docId = document.getElementById("selectDoc").value; // 0, 1, 2

            if (docId !== "-99" && docs[docId]) {
                let doc = docs[docId];
                let docType = doc.docType;
                let comments = doc.comments;

                if (docType === "text") {
                    hideCodeDiv();
                    showTrixEditor();

                    let element = document.querySelector("trix-editor");

                    if (element) {
                        updateCurrentDocOnChange = triggerChange;
                        // Get selected range (save the current cursor position)
                        cursorPos.current = element.editor.getSelectedRange();
                        element.value = "";
                        element.editor.setSelectedRange([0, 0]);
                        updateCurrentDocOnChange = triggerChange;
                        // element.editor.insertHTML(content);
                        element.value = content;
                        // Set selected range to the "old" cursor position
                        element.editor.setSelectedRange(cursorPos.current);

                        if (comments.length === 0) {
                            document.getElementsByClassName("commentsDiv")[0].style.display = "none";
                            document.getElementsByClassName("trix-editor")[0].style.width = "87.5vw";
                        } else {
                            // Show div on the side
                            document.getElementsByClassName("textDiv")[0].style.flexDirection = "row";
                            document.getElementsByClassName("commentsDiv")[0].style.display = "block";
                            document.getElementsByClassName("trix-editor")[0].style.width = "60vw";

                            // Markera texten som kommentaren avser
                            for (let i = 0; i < comments.length; i++) {
                                // Get selected range (save the current cursor position)
                                cursorPos.current = element.editor.getSelectedRange();
                                element.editor.setSelectedRange(comments[i].range);
                                element.editor.activateAttribute("italic");
                                element.editor.activateAttribute("bold");
                                // Set selected range to the "old" cursor position
                                element.editor.setSelectedRange(cursorPos.current);
                            }
                            let length = element.editor.getDocument().toString().length;

                            // Get selected range (save the current cursor position)
                            cursorPos.current = element.editor.getSelectedRange();

                            element.editor.setSelectedRange(length - 1);
                            element.editor.deactivateAttribute("italic");
                            element.editor.deactivateAttribute("bold");
                            // Set selected range to the "old" cursor position
                            element.editor.setSelectedRange(cursorPos.current);
                        }
                    }
                } 

                if (docType === "code") {
                    hideTrixEditor();
                    showCodeDiv();
                    document.getElementsByClassName("commentsDiv")[0].style.display = "none";
                    // Inget skrivs ut i kod-editorn härifrån, utan innehållet där sätts efter vad värdet på variabeln data är
                }
            }
        }
    };

    function setCodeTerminalContent(codeResult) {
        let element = document.getElementById("code-terminal");
        if (element) {
            element.value = "";
            let codeArray = codeResult.trim().split("\n");
            setCodePrintResult(codeArray)
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
        if (docId !== "-99") {
            let doc = docs[docId]; // {"_id": 6140s3f01sd, "title": Saga, "html": Det var en gång}

            setSelectedDoc(doc["_id"]); // 6140s3f01sd - Ett id  1 currentDoc och selectedDoc sätts
            setCurrentDoc(doc); // Ett objekt
            setData(doc.html);
            setCodeData(doc.html);
            setDocType(doc.docType);
            setComments(doc.comments);
        }
        hideSaveForm();
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
        document.getElementsByClassName("trix-editor")[0].style.display = "block";
    };

    const hideTrixEditor = () => {
        // Dölj formuläret med CSS
        document.getElementsByClassName("trix-editor")[0].style.display = "none";
    };

    function code() {
        hideSaveForm();
        hideTrixEditor();
        document.getElementsByClassName("commentsDiv")[0].style.display = "none";
        showCodeDiv();
        createReset();
        setDocType("code");

        // Sätt innehållet i kod-editorn till tomt
        let element = document.getElementsByClassName("code-editor")[0];

        if (element) {
            if (editorModel) {
                editorModel.setValue("");
            }
        }
    }

    function text() {
        hideSaveForm();
        hideCodeDiv();
        showTrixEditor();
        createReset();
        setDocType("text");
    }

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
    
                // Maila ut inbjudan till användaren
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
        if (document.getElementById("selectDoc")) {
            document.getElementById("selectDoc").value = "-99";
            setEditorContent("", false);
            setCurrentDoc({});
            setSelectedDoc({});
            setData("");
            setCodeData("");
        }
    };

    const create = async (event) => {
        event.preventDefault();

        let newName = document.getElementById("fileName").value;
        let newDoc = {};

        if (currentDoc.html) {
            newDoc.html = currentDoc.html;
        } else {
            newDoc.html = codeData;
        }

        newDoc.name = newName;
        newDoc.docType = docType;
        newDoc.comments = [];
        newDoc.html = currentDoc.html;

        if (newDoc.name === null || newDoc.name === "" || newDoc.name === undefined) {
            alert("Document must have a title.");
        } else {
            if (newDoc.html === "" || newDoc.html === undefined) {
                alert("Please add new content.");
            } 
            else {
                newDoc.owner = currentUser;
                newDoc.allowedUsers = [currentUser];

                await docsModel.create(newDoc);
                hideSaveForm();
            }
        }
        // Gör att dokumentlistan uppdateras varje gång det skapas ett nytt dokument
        setDocCreated(newDoc);
    };

    const update = async () => { 
        if (document.getElementById("selectDoc")) {
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
        }
    };

    const showUsers = async () => {
        let users = await authModel.getAllUsers();
        setAppUsers(users);
    };

    async function invite() {
        let email = prompt("Enter email of user to invite: ");

        if (email !== null && email !== "") {
            // Spara INTE email i databasen - ska redan vara gjort
            // Maila ut inbjudan till användaren
            sendEmail(email);
        }
    };

    async function sendEmail(email) {
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
    };

    const printText = useReactToPrint(
        {
        content: () => textRef.current,
        copyStyles: false
        }
    );

    const printCode = useReactToPrint(
        {
      content: () => codeRef.current,
      copyStyles: true
        }
    );

    function handlePrint() {
        if (docType === "text") {
            printText();
        }

        if (docType === "code") {
            printCode();
        }
    }

    async function comment() {
        if (currentDoc.docType === "code") {
            alert("Comments only work for text documents.");
        } else {
            let element = document.querySelector("trix-editor");

            if (element) {
                // Plocka upp start och slut pos från det som är markerat i texten
                let markedText = element.editor.getSelectedRange();

                // Markera först texten - tryck sedan på comment
                if (markedText[0] === markedText[1]) {
                    alert("Please mark the text you want to comment - then press Comment.");
                } else {
                    // Ange kommentaren
                    let newCommentText = prompt("Add comment:");

                    if (newCommentText) {
                        let newComment = {"range": markedText, "commentText": newCommentText, "createdBy": currentUser};

                        // Skapa nytt obj (copy, som är kopia av currentDoc)
                        const copy = Object.assign({}, currentDoc);

                        let currentComments = currentDoc.comments;

                        currentComments.push(newComment);

                        // Sortera kommentarerna efter comment.range första pos
                        currentComments.sort(function(a, b) {
                            return a.range[0] - b.range[0];
                        });

                        copy.comments = currentComments;
                        // Spara kommentaren till databasen
                        await docsModel.update(copy);
                    }
                } 
            }

            noOfComments++;
            setCommentCreated(noOfComments);
        }
    }

    async function remove(comment) {
        let commentRange = [];
        let newCommentArray = [];
        let remove = window.confirm("Remove comment?");

        if (remove) {
            const commentDivText = comment.target.innerHTML.split("\n\n");

            // Ger kommentarens range, samt en array utan den borttagna kommentaren
            for (let i = 0; i < currentDoc.comments.length; i++) {
                if (currentDoc.comments[i].commentText === commentDivText[1].trim()) {
                    commentRange = currentDoc.comments[i].range;
                } else {
                    newCommentArray.push(currentDoc.comments[i]);
                }
            }

            // Skriver över currentDocs kommentarsarray
            currentDoc.comments = newCommentArray;

            await docsModel.update(currentDoc); // Spara i databasen

            setCurrentDoc(currentDoc);

            // Ta bort kommentarens markering
            let element = document.querySelector("trix-editor");

            element.editor.setSelectedRange(commentRange);
            element.editor.deactivateAttribute("italic");
            element.editor.deactivateAttribute("bold");
        }
    }

    return (
        <div className = "editor">
            { token ?
            <>
            <trix-toolbar id = "trix-toolbar">

                <button className = "button trixButton" onClick = { resetDb }> Reset </button>

                <button className = "button trixButton" onClick = {(event)=> { showSaveForm(event); createReset();} }> Create </button>

                { docs ?
                    <>
                <select id = "selectDoc" className = " button trixButton" data-testid = "select" onChange = { handleSelectedDoc } >
                     <option value = "-99" key = "0"> Choose document </option>
                   {docs.map((doc, index) => <option value = {index} key = {index} data-testid = "select-option"> {doc.name} </option>)}
                </select>
                </>
                 : 
                  <h3>"Docs not found"</h3>
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

                <button className = "button trixButton" onClick = { handlePrint }> Print </button>

                <button className = "button trixButton" onClick = { comment }> Comment </button>

                <button className = "button trixButton" onClick = { invite }> Invite </button>

                <button className = "button trixButton" onClick = { code }> Code </button>

                <button className = "button trixButton" onClick = { logout }> Log out </button>
            </trix-toolbar>

            <form className = "saveForm" id = "saveForm"  style = {{ display: "none" }}> Name of file:
                
                <input className = "button" id = "fileName" type = "text" required >
                </input> 

                <button  type="submit" className = "button" onClick = { (event) => { create(event); }}> Save </button>

                <button className = "button" onClick = { (event) => { exitCreateDoc(event); } }> Exit </button>
            </form>

            <div className = "textDiv" ref = { textRef } style = {{ display: "flex", flexDirection: "column"}}>
                <TrixEditor id = "trixEditorContent" className = "trix-editor" toolbar = "trix-toolbar" 
                onChange = { handleChange }
                // autoFocus={true}
                />
                <div className = "commentsDiv" style = {{ display: "none", fontStyle: "italic", fontWeight: "bold" }} > Comments
                    {
                        comments.map((comment, index) => <p onClick = { (comment, index) => { remove(comment, index) } } className="commentDiv" key = {index}> {
                            `By ${comment.createdBy}:\n\n${comment.commentText}`} </p>)
                    }
                </div>
            </div>

            <div id = "codeDiv" className = "codeDiv" style = {{ display: "none" }} >
                <div className = "codeEditorDiv">
                    <div className = "codeTop" >
                        JS code editor
                    </div>
                    <div ref = { codeRef }>
                        <CodeEditor
                            data-testid="ces"
                            id = "code-editor"
                            className = "code-editor"
                            height="30vh"
                            defaultLanguage="javascript"
                            theme="vs-dark"
                            onChange = { (value) => {handleChange(); setValueChange(value); setCodeData(value);} }
                            editorDidMount = { editorDidMount }
                            value = { data }
                        />
                    </div>
                </div>

                <button className = "button trixButton executeButton" onClick = {()=> execute() }> Execute </button>
                <div className = "resultTermialDiv">
                    <div className = "codeTop"> Result terminal </div>
                    <div id = "code-terminal" className = "code code-terminal">
                    { codePrintResult ?
                    <>
                    {codePrintResult.map((res, index) => <div className = "codeRes" value = {index} key = {index}> {res}
                     </div>)}
                     </>
                     :
                     <div className = "codeText">Result shows here.</div>
                    }
                </div>


                </div>
                <button className = "button trixButton executeButton" onClick = {()=> text() }> Return to text mode </button>
            </div>

             </>
             : 
            <Login setToken = { setToken } setCurrentUser = { setCurrentUser } />
            } 
        </div>
    )
} 

export default Editor
