import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ReactHtmlParser from 'react-html-parser';
// import PropTypes from 'prop-types'

const Editor = () => {
    // const [addData, setVal] = useState("");
    // const [addedData, showData] = useState(0);
    const [data, setData] = useState('');

    const printData = () => { 
        // console.log( ReactHtmlParser(data) ); // ger utskrift i konsollen med taggar p, p osv
        console.log( ReactHtmlParser(data)[0].props.children[0] ); // ger en array med objekt i...
    };

    const handleChange = (e, editor) => { 
    setData(editor.getData());
    };

    return (


        <div style = {{ width: '680px', margin: '0 auto' }}>

            {/* <button onClick = {()=> printData(!addedData)}>Print in console</button> */}
            <button onClick = {()=> printData() }> Spara </button>





            <div id="editor">
        {/* { ClassicEditor.removePlugins( [ 'Bold', 'Italic' ])} */}

                {/* <CKEditor editor = { ClassicEditor } data = { CKEditor.getData() } onChange = { handleChange }/> */}
                <CKEditor 
                    editor = { ClassicEditor }
                    onChange = {(e, editor) => { handleChange(e, editor) }}
                    
                />




            </div>



        </div>



    )
}

// Editor.defaultProps = {
//     color: 'steelblue',
// }

// Editor.propTypes = {
//     text: PropTypes.string,
//     color: PropTypes.string,
// }

export default Editor




// var ClassicEditor = require('@ckeditor/ckeditor5-build-classic');


// ClassicEditor
// .create( document.querySelector( '#editor' ), {
// removePlugins: [ 'Bold' ],
//     plugins: [ Image ]
// } )
// .then( editor => {
//         console.log( editor );
// } )
// .catch( error => {
//         console.error( error );
// } );

