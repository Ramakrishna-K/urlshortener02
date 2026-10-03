

import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("=================================");
        console.log("MONGODB CONNECTED");
        console.log("Host:", mongoose.connection.host);
        console.log("Database:", mongoose.connection.name);
        console.log("URI:", process.env.MONGO_URI);
        console.log("=================================");

    } catch (error) {
        console.error("MONGODB CONNECTION FAILED");
        console.error(error.message);

        process.exit(1);
    }
};

export default connectDB;
