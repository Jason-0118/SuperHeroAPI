var heroList = [];
var publisherList = [
    {
        publisher: "Marvel Comics",
        founder: "Martin Goodman",
        Headquarters: "New York",
        formed: Date.parse("1939"),
        active: true
    },
    {
        publisher: "Dark Horse Comics",
        founder: "Mike Richardson",
        Headquarters: "Oregon",
        formed: Date.parse("1986"),
        active: true
    },
    {
        publisher: "DC Comics",
        founder: "Malcolm Wheeler-Nicholson",
        Headquarters: "California",
        formed: Date.parse("1934"),
        active: true
    },
    {
        publisher: "Wildstorm",
        founder: "Jim Lee",
        Headquarters: "California",
        formed: Date.parse("1992"),
        active: true
    },
];

let fetch = require("node-fetch");
async function getDataArray() {
    let responsePromise = await fetch("https://www.superheroapi.com/api.php/906492110137146/search/man");
    let json = await responsePromise.json();
    console.log(json.results[0])
    for (let i = 0; i < 50; i++) {
        let object = {
            name: json.results[i].name,
            gender: json.results[i].appearance.gender,
            race: json.results[i].appearance.race,
            height: json.results[i].appearance.height[1],
            weight: json.results[i].appearance.weight[1],
            publisher: json.results[i].biography.publisher,
            intelligence: json.results[i].powerstats.intelligence,
            strength: json.results[i].powerstats.strength,
            speed: json.results[i].powerstats.speed,
            durability: json.results[i].powerstats.durability,
            power: json.results[i].powerstats.power,
            combat: json.results[i].powerstats.combat,
            image: json.results[i].image.url,
        }
        heroList.push(object);
    }
    console.log(heroList);
}
getDataArray();

// connect to mongoose DB
const credentials = require("./dbCredentials.js");
const mongoose = require('mongoose');
mongoose.connect(credentials.connection_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//load modeals
const Hero = require("./models/hero");
const Publisher = require("./models/publisher");


//load all
async function loadAllData() {
    await Publisher.deleteMany();
    await Hero.deleteMany();

    const publisherRecords = [];
    for (let item of publisherList) {
        const publisherRecord = new Publisher(item);
        publisherRecords.push(publisherRecord);
        await publisherRecord.save();
    }
    console.log("Done loading teamRecords");
    for (let i = 0; i < heroList.length; i++) {
        const heroRecord = new Hero(heroList[i]);

        if (heroList[i].publisher === "Marvel Comics") {
            heroRecord.publisherID = publisherRecords[0];
        }
        else if (heroList[i].publisher === "Dark Horse Comics") {
            heroRecord.publisherID = publisherRecords[1];
        }
        else if (heroList[i].publisher === "DC Comics") {
            heroRecord.publisherID = publisherRecords[2];
        }
        else if (heroList[i].publisher === "Wildstorm") {
            heroRecord.publisherID = publisherRecords[3];
        }

        await heroRecord.save();
    }

    console.log("Done loading hero");
    console.log("Done loading all datas");
    mongoose.connection.close();
}



loadAllData();