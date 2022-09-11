import React, { useState, useEffect } from 'react';
// import ReactHtmlParser from 'react-html-parser';
import { TrixEditor } from "react-trix";
// import "trix";
import "trix/dist/trix.css";
// import saveForm from './saveForm';

import docsModel from '../models/docsModel';

const Editor = () => {
    let [data, setData] = useState('');
    const [docs, setDocs] = useState([]);
    const [currentDoc, setCurrentDoc] = useState({});
    const [title, setTitle] = useState('');

    useEffect(() => {
        (async () => {
            const allDocs = await docsModel.getAllDocs();
            setDocs(allDocs);
        })();
    }, [currentDoc]);

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
        console.log(selectedDoc);

        if (selectedDoc !== undefined) {
            setEditorContent(selectedDoc);
        }
     };

    // console.log(event); // hela html
    // console.log(event.target); // De använde event.target.value
    // function setEditorContent(content, triggerChange) {
    function setEditorContent(selectedDoc) {
        let element = document.querySelector("trix-editor");
        // let element = document.getElementById("selectDoc"); // element.editor is undefined med denna, men ej ovanstående element som är samma sak
            element.value = "";
            // element.editor.setSelectedRange([0, 0]);
            element.editor.insertHTML(selectedDoc.html);
        // selectedDoc.innerHTML = "hej";
};

    const resetDb = async () => {
        await docsModel.reset();
    };

    const setName = (event) => {
        // console.log(event.target.value);
        setTitle(event.target.value);
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

        newDoc.name = title;
        // console.log("newDoc", newDoc);
        await docsModel.create(newDoc);
    };

    const updateObject = async () => { 
        if (currentDoc == undefined) {
            alert("Please choose a file to update");
        } else {
            currentDoc.html = data; // Ändrar html för currentDoc till det som står i editorn
            await docsModel.update(currentDoc);
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

        {/* <saveForm /> */}
        <form className = "saveForm" id = "saveForm" onSubmit = { (event) => { createObject(event);} } style = {{display: "none"}}>Name of file:
                <input className = "button" id = "fileName" type = "text" value = { title } onChange = { (event) => { setName(event); } }    > 
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
