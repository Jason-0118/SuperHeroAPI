const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var PublisherSchema = new Schema({
    publisher: { type: String, required: true },
    founder: { type: String, required: true },
    Headquarters: { type: String, required: true },
    formed: { type: Date },
    active: { type: Boolean, required: true, default: true },
});

PublisherSchema.virtual("url").get(function () {
    return "/publishers/id/" + this._id;
});

PublisherSchema.virtual("date").get(function () {
    const d = this.formed;
    let dateString = d.getMonth() + "/" + d.getDay() + "/" + d.getFullYear();
    return dateString;
});

PublisherSchema.virtual("members").get(async function () {
    const Hero = require("./hero");
    let heroArray = await Hero.find().where("publisherID").equals(this._id).exec();
    return heroArray;
});

module.exports = mongoose.model("Publisher", PublisherSchema);
