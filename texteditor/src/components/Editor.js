import React, { useState, useEffect, useRef } from 'react';
// import ReactHtmlParser from 'react-html-parser';
import { TrixEditor } from "react-trix";

// import "trix";
import "trix/dist/trix.css";

import docsModel from '../models/docs';

const Editor = () => {
    let [data, setData] = useState('');
    const [docs, setDocs] = useState([]);
    const [currentDoc, setCurrentDoc] = useState({});
    // const trixRef = useRef(null);
    // const myRef = React.createRef();

    useEffect(() => {
        (async () => {
            const allDocs = await docsModel.getAllDocs();
            setDocs(allDocs);
        })();
    }, [currentDoc]);

    let fetchDoc = () => {
        // console.log("hämta valt dokument och visa det i editorn");
        // console.log("och spara det i currentDoc??");
        // var docId = document.getElementById("selectDoc").value;
        // console.log(docs[docId]);
        // Skriv ut i editorn - UPPDATERA DATA I EDITORN AUTOMATISKT

        // Hämta värde ur selectlista
        let selectedDocId = document.getElementById("selectDoc").value;
        let chosenDoc = docs[selectedDocId];
        console.log("Chosen doc", chosenDoc);
        // editor = chosenDoc.html;

        // Från början är currentDoc {} och data ""

        // setCurrentDoc(chosenDoc); // Sätter currentDoc till valt dokument
        setCurrentDoc(chosenDoc);
        console.log("Current doc: ", currentDoc);

        setData(chosenDoc.html);
        console.log("data: ", data); // Sätter data till valt dokuments data
 
        // setCurrentDoc(chosenDoc); // när jag sätter detta uppdateras sidan
        // - då blir currentDoc {} igen - NEJ, har ju precis ändrat värdet. Sidan uppdateras bara
    }

    const printData = () => { 
        // console.log("skriv ut i konsollen");
        // if (ReactHtmlParser(data)[0].props !== undefined) {
        //     console.log( ReactHtmlParser(data)[0].props.children ); // ger en array med objekt i
        // }
        // for (let row in  ReactHtmlParser(data)[0].props.children[row]) {
            // \filtrera ut element (br mm ?
        //     console.log(row);
        // }
        if (data !== undefined) {
            console.log(data);
        };
    };

    const createObject = async () => {
        // doc = {_id: 123456, name: "hej", html: data};
        // öppna ett formulär där man får fylla i namn? / 
        // inte ha med namn när dokument skapas utan ta med det när man vill spara sen? 
        //??????????????????????????????????????????????? name = ?????????
        // Objektet får ett id som response efter detta
        let doc = {html: data};
        await docsModel.create(doc);
    };

    const updateObject = async () => { 
        // VILKET ID VILL VI UPPDATERA -
        // OBJEKTET SOM VALTS I SELECTLISTAN - FETCHOBJECT
        let doc = {html: data};
        // let doc = {html: "EJ UNDEF DATA"};
        await docsModel.update(doc);
    };

    const saveObject = () => { 
        console.log( "spara objekt" );
    };

    // let handleEditor = (e, editor) => { 
    //     // setData(editor.getData());
    //     setData("nytt");
    // }

    // handleEditorReady(editor) {
    //     // this is a reference back to the editor if you want to
    //     // do editing programatically
    //     editor.insertString("editor is ready");
    //   };


    let onChange = (event, newValue) => { 
        // console.log(event); // hela html
        // console.log(event.target); // De använde event.target.value
        // console.log(newValue);
        // setData(newValue);
        setData(event);
    }

    let onEditorReady = (event, editor) => {
        console.log("behövs?");
        // console.log("hej", editor);
        // trixRef.innerHTML = data;
        // return;
    }

    return (
        <div className = "editor">
            {/* <h1> Text editor </h1> */}

            <trix-toolbar id = "trix-toolbar">


                <button onClick = {()=> printData() }> Save </button>
                {/* <select id = "selectDoc" onChange = { fetchDoc }>
                    <option value = "-99" key = "0"> Choose a document </option>
                    {docs.map((doc, index) => <option value = {index} key = {index}> {doc.name} </option>)}
                </select> */}

                {/* <button onClick = {()=> createObject() }> Create </button> */}
                {/* <button onClick = {()=> updateObject() }> Update </button> */}
                {/* <button onClick = {()=> saveObject() }> Save </button> */}

            </trix-toolbar>


            <TrixEditor id = "trixEditorContent" className = "trix-editor" toolbar = "trix-toolbar"
                // editor = {TrixEditor}
                // onEditorReady = { onEditorReady }
                // onEditorReady = {(event, editor) => {onEditorReady(event, editor) }}
                // onChange = {(event, editor) => {onChange(event, editor) }}
                onChange = { onChange } 
                // ref = { trixRef }
                value = { data }
                // input = 'react-trix-editor'
            >
                { data }

            </TrixEditor>
        </div>
    )
}

export default Editor
