const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const Blog = require("../../../app/modules/blog")
const mongoose = require("mongoose");

const _ = require("lodash");
let server;
let mongod;
let db, validID;

describe("Blog", () => {
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
            await Blog.deleteMany({});
            let blog = new Blog();
            blog.title = "title1";
            blog.body = "body1";
            blog.author = "Owen";
            blog.tags = [{title: 'test'}];
            blog.category = "test";
            await blog.save();
            blog = await Blog.findOne({title: 'title1'});
            validID = blog._id;
        } catch (error) {
            console.log(error);
        }
    });


    describe("POST /Add blog", () => {
        const blog = {
            title: "title2",
            body: "body2",
            author: "Owen",
            tags: "test",
            category: "test"
        };
        const invalidBlog = {
            title: "t",
            body: "body2",
            author: "Owen",
            tags: "test",
            category: "test"
        };

        it("should return blog added confirmation message", done => {
            request(server)
                .post("/blog/")
                .send(blog)
                .expect(200)
                .end((err, res) => {
                    expect(res.body.message).equals("Succeed to publish");
                    done(err)
                });
        });

        it("should return blog not added message", done => {
            request(server)
                .post("/blog/")
                .send(invalidBlog)
                .expect(200)
                .end((err,res) => {
                    expect(res.body.message).equals("The length of title should more than 3");
                    done(err)
                });
        });
    })


    describe("GET /View all blogs", () => {
        it("should get all blogs", done => {
            request(server)
                .get("/blog/")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    try {
                        expect(res.body.data).to.be.a("array");
                        expect(res.body.data.length).to.equal(1);
                        let result = _.map(res.body.data, blog => {
                            return {
                                title: blog.title,
                            };
                        });
                        expect(result).to.deep.include({
                            title: "title1"
                        });
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });
    })


    describe("PUT /blog/", () => {
        describe("when the new title is valid", () => {
            it("should change the title to new title and send a message", () => {
                return request(server)
                    .put(`/blog/`)
                    .send({
                        title: "title1",
                        body: "body1",
                        author: "Owen",
                        newTitle: "updatedTitle1",
                        newBody: "updatedBody1",
                        newAuthor: "Owen1",
                    })
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.include({
                            message: "Succeed to update"
                        });
                    });
            });
            after(() => {
                return request(server)
                    .get(`/blog/`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(res => {
                        expect(res.body.data).to.be.a("array");
                        expect(res.body.data.length).to.equal(1);
                        let result = _.map(res.body.data, blog => {
                            return {
                                title: blog.title,
                            };
                        });
                        expect(result).to.deep.include({
                            title: "updatedTitle1"
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
    });
    describe("DELETE /blog", () => {
        it('should delete blog', done => {
            request(server)
                .delete(`/blog/`)
                .set("Accept", "application/json")
                .send({
                    title: 'title1'
                })
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body.message).equals("Succeed to delete");
                    done(err);
                });

        });
    })
});