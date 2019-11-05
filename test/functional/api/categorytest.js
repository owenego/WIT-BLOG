const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const Category = require("../../../app/modules/category")
const mongoose = require("mongoose");

const _ = require("lodash");
let server;
let mongod;
let db, validID;

describe("Category", () => {
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
            await Category.deleteMany({});
            let category = new Category();
            category.title = "Sport";
            await category.save();
            category = await Category.findOne({name: 'Sport'});
            validID = category._id;
        } catch (error) {
            console.log(error);
        }
    });


    describe("POST /Add category", () => {
        it("should return category added confirmation message", () => {
            const category = {
                title: "Sport"
            };
            return request(server)
                .post("/category/")
                .send(category)
                .expect(200)
                .then(res => {
                    expect(res.body.message).equals("success to add category");

                });
        });
    })


    describe("GET /View all categories", () => {
        it("should get all categories", done => {
            request(server)
                .get("/category/")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    try {
                        expect(res.body.data).to.be.a("array");
                        expect(res.body.data.length).to.equal(1);
                        let result = _.map(res.body.data, category => {
                            return {
                                title: category.title,
                            };
                        });
                        expect(result).to.deep.include({
                            title: "Sport"
                        });
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });
    })


    describe("PUT /category/", () => {
        describe("when the new title is valid", () => {
            it("should change the title to new title and send a message", () => {
                return request(server)
                    .put(`/category/`)
                    .send({
                        title: 'Sport',
                        newtitle: 'New Sport'
                    })
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.include({
                            message: "Success to update category"
                        });
                    });
            });
            after(() => {
                return request(server)
                    .get(`/category/`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(res => {
                        expect(res.body.data).to.be.a("array");
                        expect(res.body.data.length).to.equal(1);
                        let result = _.map(res.body.data, category => {
                            return {
                                title: category.title,
                            };
                        });
                        expect(result).to.deep.include({
                            title: "New Sport"
                        });
                    });
            });
        });
        // describe("when the id is invalid", () => {
        //     it("should return a 404 and a message for invalid donation id", () => {
        //         return request(server)
        //             .put("/donations/1100001/vote")
        //             .expect(404);
        //     });
        // });
        describe("DELETE /category", () => {
            it('should delete category', done => {
                request(server)
                    .delete(`/category/`)
                    .send({
                        title: 'Sport'
                    })
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("Success to delete category");
                        done(err);
                    });

            });
        })




    });
});