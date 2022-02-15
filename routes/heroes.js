var express = require('express');
var router = express.Router();
var heroControllers = require('../controller/heroControllers');


router.get('/', heroControllers.getHeroList);
router.get('/id/:id', heroControllers.getSingleHero);
router.get('/delete/:id', heroControllers.deleteHero);
router.get('/searchList/:name', heroControllers.searchInList);
router.get('/byapi/:name', heroControllers.searchInAPI);
router.get('/create', heroControllers.create);
router.get('/update/:id', heroControllers.update_get);
router.post('/update/:id', heroControllers.update_post);

// router.get('/add/:name', heroControllers.addHeroFromAPI);


module.exports = router;
