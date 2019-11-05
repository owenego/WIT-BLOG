const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const User = require("../../../app/modules/user")
const mongoose = require("mongoose");

const _ = require("lodash");
let server;
let mongod;
let db, validID;

describe("User", () => {
    before(async () => {
        try {
            mongod = new MongoMemoryServer({
                instance: {
                    port: 27017,
                    dbPath: "./test/database",
                    dbName: "blogdb" // by default generate random dbName
                }
            });
            // Async Trick - this ensures the database is created before
            // we try to connect to it or start the server
            // await mongod.getConnectionString();

            mongoose.connect("mongodb://localhost:27017/blogdb", {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            server = require("../../../bin/www");
            db = mongoose.connection;
        } catch (error) {
            console.log(error);
        }
    });

    after(async () => {
        try {
            await db.dropDatabase();
        } catch (error) {
            console.log(error);
        }
    });

    beforeEach(async () => {
        try {
            await User.deleteMany({});
            let user = new User();
            user.name = "Owen";
            user.password = '980828';
            user.admin = true;
            await user.save();
            user = new User();
            user.name = "test1";
            user.password = '111111';
            await user.save();
            user = await User.findOne({name: 'Owen'});
            validID = user._id;
        } catch (error) {
            console.log(error);
        }
    });


    describe("POST /login", () => {
        const user = new User({
            name: 'Owen',
            password: '980828'
        })
        it("should return login information", () => {
            request(server)
                .post("/user/login")
                .send(user)
                .expect(200)
                .then(res => {
                    expect(res.body.message).equals("login successfully");
                    validID = res.body.data._id;
                });
        });


    })
})
