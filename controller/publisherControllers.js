
const Publisher = require('../models/publisher');
const errorParser = require('./errorParser.js');


exports.getPublisherList = async function (req, res) {
    let pList = await Publisher.find().exec();
    res.render('publisherList.ejs', { pList });
}

exports.getSinglePublisher = async function (req, res) {
    let singlePublisher = await Publisher.findById(req.params.id).exec();
    let members = await singlePublisher.members;
    res.render('singlePublisher.ejs', { publisher: singlePublisher, members: members });
}

exports.deletePublisher = async function (req, res) {
    const Hero = require('../models/hero');
    let heroPList = await Hero.find().where('publisherID').eq(req.params.id).exec();
    for (let item of heroPList) {
        item.publisherID = undefined;
        item.publisher = 'deleted by u!!!';
        item.save();
    }
    await Publisher.findByIdAndRemove(req.params.id).exec();
    res.redirect('/publishers');
}

exports.create = function (req, res) {
    let publisher = new Publisher({});
    res.render('publisherForm.ejs', { title: 'Create Publisher', pl: publisher });
}

exports.update_get = async function (req, res, next) {
    try {
        let publisher = await Publisher.findById(req.params.id).exec();
        res.render('publisherForm.ejs', { title: `Update ${publisher.publisher}`, pl: publisher });
    } catch (err) {
        var err = new Error('publisher not exist');
        err.status = 404;
        return next(err);
    }
}

exports.update_post = async function (req, res, next) {
    let publisher = await Publisher.findById(req.params.id).exec();
    if (publisher === null)
        publisher = new Publisher({ _id: req.body.id });
    console.log(req.body);

    publisher.publisher = req.body.publisher;
    publisher.founder = req.body.founder;
    publisher.Headquarters = req.body.Headquarters;
    publisher.formed = req.body.formed;
    publisher.active = req.body.avtive;
    console.log(publisher);

    publisher
        .save()
        .then((publisher) => {
            res.redirect(publisher.url);
        })
        .catch ((err) => {
            res.render('publisherForm', {
                title: `Update ${publisher.publisher}`,
                pl: publisher,
                errors: errorParser.parser(err.message),
            });
        });
}