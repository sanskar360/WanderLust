const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({
    accessToken: mapToken
});

// Index
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listing/index.ejs", { allListings });
};

// New
module.exports.renderNewForm = (req, res) => {
    res.render("listing/new.ejs");
};

// Show
module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing Does Not Exists");
        return res.redirect("/listings");
    }

    res.render("listing/show.ejs", { listing });
};

// Create
module.exports.createListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
    })
    .send()
    
    const newListing = new Listing(req.body.listing);
    let url = req.file.path;
    let filename = req.file.filename;
    newListing.image = {url, filename};
    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;

    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

// Edit
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing Does Not Exists");
        return res.redirect("/listings");
    }

    res.render("listing/edit.ejs", { listing });
};

// Update
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, {
        ...req.body.listing
    });

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }

    req.flash("success", "Saved Changes");
    res.redirect("/listings");
};

// Delete
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings");
};