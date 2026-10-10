
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/users.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("connected to DB");

    await initDB();
}

const initDB = async () => {
    try {
        // Find an existing user to assign as owner
        const user = await User.findOne({username: "FirstUser"});

        // Clear existing listings
        await Listing.deleteMany({});

        // Add the owner to every listing
        const listings = initData.data.map((obj) => ({
            ...obj,
            owner: user._id,
            reviews: [],
        }));

        await Listing.insertMany(listings);

        console.log("data was initialized");
    } catch (err) {
        console.error("Error initializing data:", err);
    }
};

main()
    .catch((err) => {
        console.error("Database connection error:", err);
    })
    .finally(async () => {
        await mongoose.connection.close();
    });
