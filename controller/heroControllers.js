const Hero = require('../models/hero');
const Publisher = require('../models/publisher');
const errorParser = require('./errorParser.js');

// connect to mongoose DB
const credentials = require("../dbCredentials.js");
const mongoose = require('mongoose');
const publisher = require('../models/publisher');
mongoose.connect(credentials.connection_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


exports.getHeroList = async function (req, res) {
    let heroList = await Hero.find().exec();
    res.render('heroList.ejs', { heroList });
}

exports.getSingleHero = async function (req, res) {
    let singleHero = await Hero.findById(req.params.id)
        .populate("publisherID")
        .exec();
    res.render('singleHero.ejs', singleHero);
}

exports.deleteHero = async function (req, res) {
    await Hero.findByIdAndDelete(req.params.id).exec();
    res.redirect('/heroes');
}

exports.searchInList = async function (req, res) {
    let matchPattern = new RegExp(req.params.name, "i");
    let heroList = await Hero.find().where('name').regex(matchPattern).exec();
    res.render('heroList.ejs', { heroList });

}

exports.searchInAPI = async function (req, res) {
    let fetch = require("node-fetch");
    let responsePromise = await fetch(`https://www.superheroapi.com/api.php/906492110137146/search/${req.params.name}`);
    let json = await responsePromise.json();
    let heroList = json.results[0];
    console.log(heroList);
    res.render('searchHeroAPI.ejs', heroList);
}

exports.create = async function (req, res, next) {
    try {
        let singleHero = new Hero({});
        let publisherList = await Publisher.find().select('publisher').exec();
        res.render('heroForm.ejs', {
            title: 'Create Hero',
            sh: singleHero,
            pl: publisherList,
        });
    } catch (err) {
        next(err);
    }
};

exports.update_get = async function (req, res, next) {
    try {
        let singleHero = await Hero.findById(req.params.id).exec();
        let publisherList = await Publisher.find().select('publisher').exec();
        res.render('heroForm.ejs', {
            title: `Update ${singleHero.name}`,
            sh: singleHero,
            pl: publisherList,
        });
    } catch (err) {
        next(err);
    }
};

exports.update_post = [
    async function (req, res, next) {
        try {
            let singleHero = await Hero.findById(req.params.id).exec();
            if (singleHero === null)
                singleHero = new Hero({ _id: req.body.id });
            console.log("body ==>", req.body.id);

            singleHero.name = req.body.name;
            singleHero.gender = req.body.gender;
            singleHero.race = req.body.race;
            singleHero.height = req.body.height;
            singleHero.weight = req.body.weight;
            singleHero.image = req.body.image;
            singleHero.intelligence = req.body.intelligence;
            singleHero.strength = req.body.strength;
            singleHero.speed = req.body.speed;
            singleHero.durability = req.body.durability;
            singleHero.power = req.body.power;
            singleHero.combat = req.body.combat;
            singleHero.publisherID = req.body.publisherID !== '' ? req.body.publisherID : undefined;

            let publisherList = await Publisher.find().select('publisher').exec();

            singleHero
                .save()
                .then((singleHero) => {
                    res.redirect(`/heroes/id/${singleHero._id}`);
                })
                .catch((err) => {
                    console.log(err.message);
                    res.render('heroForm.ejs', {
                        title: `Update ${singleHero.name}`,
                        sh: singleHero,
                        pl: publisherList,
                        errors: errorParser.parser(err.message),
                    });
                });
        } catch (err) {
            next(err);
        }
    },
];

// exports.addHeroFromAPI = async function (req, res) {

//     let fetch = require("node-fetch");
//     let responsePromise = await fetch(`https://www.superheroapi.com/api.php/906492110137146/search/${req.params.name}`);
//     let json = await responsePromise.json();
//     let object = {
//         name: json.results[0].name,
//         gender: json.results[0].appearance.gender,
//         race: json.results[0].appearance.race,
//         alignment: json.results[0].biography.alignment,
//         height: json.results[0].appearance.height[1],
//         weight: json.results[0].appearance.weight[1],
//         publisher: json.results[0].biography.publisher,
//         image: json.results[0].image.url,
//     }
//     console.log(object);

//     const heroRecord = new Hero(object);
//     await heroRecord.save();
//     console.log("Done loading hero");
//     res.redirect('/heroes');
//     mongoose.connection.close();

// }
