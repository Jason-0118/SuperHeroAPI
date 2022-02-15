var express = require('express');
var router = express.Router();
var publisherControllers = require('../controller/publisherControllers.js');

router.get('/', publisherControllers.getPublisherList);
router.get('/id/:id', publisherControllers.getSinglePublisher);
router.get('/id/delete/:id', publisherControllers.deletePublisher);
router.get('/create', publisherControllers.create);
router.get('/update/:id', publisherControllers.update_get);
router.post('/update/:id', publisherControllers.update_post);
module.exports = router;
