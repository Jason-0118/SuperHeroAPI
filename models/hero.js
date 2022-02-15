const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var HeroSchema = new Schema({
    name: {
        type: String,
        required: [true, "You must provide a name"],
        validate: [
            function (value) {
                let matchLocation = value.search(/\w/);
                return matchLocation !== -1;
            },
            "At least one alphanumeric character",
        ],
    },
    gender: {
        type: String,
        default: "unknown",
    },
    race: {
        type: String,
        default: "unknow",
        validate: [
            function (value) {
                let matchLocation = value.search(/\d+/);
                return matchLocation === -1;
            },
            "Digits not allow",
        ]
    },
    height: {
        type: String,
    },
    weight: {
        type: String,
    },
    publisher: {
        type: String,
        default: "unknown",
    },
    intelligence: {
        type: String, default: 0,
        min: [0, "can't be negative"],
    },
    strength: {
        type: String, default: 0,
        min: [0, "can't be negative"],
    },
    speed: {
        type: String, default: 0,
        min: [0, "can't be negative"],
    },
    durability: {
        type: String, default: 0,
        min: [0, "can't be negative"],
    },
    power: {
        type: String,
        default: 0,
        min: [0, "can't be negative"],
    },
    combat: {
        type: String, default: 0,
        min: [0, "can't be negative"],
    },
    image: {
        type: String,
        default: "https://live.staticflickr.com/4057/4397720327_a0680cf86d_z.jpg", //a default image
    },
    publisherID: { type: Schema.Types.ObjectId, ref: "Publisher" },
});

HeroSchema.virtual("url").get(function () {
    console.log(this._id);
    return "/heroes/id/" + this._id;
});

HeroSchema.virtual("viewDetail").get(function () {
    return "/heroes/byapi/" + this.name;
});


module.exports = mongoose.model("Hero", HeroSchema);
