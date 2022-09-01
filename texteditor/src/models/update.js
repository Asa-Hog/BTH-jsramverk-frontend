var express = require('express');
var router = express.Router();
// import docsModel from '../models/docs';

router.post('/', function(req, res, next) {

    const data = {
        data: {
            msg: "docs"
        }
    };

    // const data = {
    //     getAllDocs: async function getAllDocs() {
    //         const response = await fetch(`${URL}/docs`);
    //         const result = await response.json();
    
    //         return result.data;
    //     },
    // };


    res.json(data);
});

module.exports = router;