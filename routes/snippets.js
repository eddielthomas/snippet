var express = require('express');
const fs = require('fs');
var utils = require('../util/helper');
var router = express.Router();
const baseURL = "http://localhost/snippets/";


/* Create the snippets */
router.post('/', (req, res, next) => {

    const name = req.body.name;
    // const name = req.query.name;
    const params = req.body;
    var filepath = "data/" + name;

    utils.checkForFile(
        filepath, () => {
            var data = {
                name: params.name,
                url: baseURL + filepath,
                expires_in: utils.getExpireTime(params.expires_in),
                snippet: params.snippet
            };
            utils.writeFile(JSON.stringify(data, null, 2), () => {
                res.status(201).send(data);
            }, filepath)
        }

    );

});
// Get
router.get('/:snippet', (req, res, next) => {

    const params = req.query;
    var filepath = "data/" + req.params.snippet;

    utils.checkForFile(
        filepath, () => {
            utils.readFile(data => {
                console.log(data);
                if(utils.compareDateWithNow(data.expires_in)){
                    data.expires_in = utils.getExpireTime(30);
                    utils.writeFile(JSON.stringify(data, null, 2), () => {
                        res.status(200).send(data);
                    }, filepath);
                }else{
                    res.status(404).send({
                        "error":"404 Not Found"
                    });
                }
                
            }, true, filepath)
        });
});
// Edit
router.put('/:snippet', (req, res, next) => {

    const params = req.params;
    var filepath = "data/" + params.snippet;

    utils.checkForFile(
        filepath, () => {
            utils.readFile(data => {
                if (params.password != data.password) {
                    res.status(200).send({
                        "update_fail": "password is incorrect"
                    })
                } else {
                    data.expires_in = utils.getExpireTime(30);
                    data.snippet = params.snippet;
                    utils.writeFile(JSON.stringify(data, null, 2), () => {
                        res.status(200).send(data);
                    }, filepath);
                }
            }, true, filepath)
        });
});
module.exports = router;
