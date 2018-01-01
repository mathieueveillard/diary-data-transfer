import {
    importEntries,
    importFromJSON,
    FILE_PATH_ERROR,
    DATE_MISSING_ERROR,
    BODY_MISSING_ERROR
} from "../src/import"
import assert from "assert"
import fs from "fs"

describe("#import", function(done) {

    this.timeout(60000)

    it("should throw an error if provided with a wrong file path", function() {
        assert.throws(() => importEntries(".json"), Error, FILE_PATH_ERROR)
    })

    it("should throw an error if provided with a wrong file path (2)", function() {
        assert.throws(() => importEntries("file.jso"), Error, FILE_PATH_ERROR)
    })

    it("should throw an error if provided with a wrong file path (3)", function() {
        assert.throws(() => importEntries("file"), Error, FILE_PATH_ERROR)
    })

    it("should fail if date is missing", function(done) {
        const entries = [{
            "title": "This should fail",
            "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet eros quis sem suscipit sollicitudin id at sem. Morbi sed suscipit ligula, at tincidunt lectus. Sed mollis iaculis augue, nec congue dolor sodales vitae. Phasellus pellentesque rhoncus elementum. Maecenas lobortis tristique sem sit amet blandit. Pellentesque sit amet ligula accumsan, pharetra sem vitae, eleifend lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sodales et ligula vitae molestie. Vivamus congue metus ex. Cras vitae tempor arcu, non condimentum ante. Sed iaculis erat lacus, non volutpat lectus sollicitudin quis."
        }]
        importFromJSON(entries)
            .then(result => assert.equal(result.errors[0].error, DATE_MISSING_ERROR))
            .then(() => done())
    })

    it("should fail if body is missing", function(done) {
        const entries = [{
            "date": 1514464620,
            "title": "This should fail"
        }]
        importFromJSON(entries)
            .then(result => assert.equal(result.errors[0].error, BODY_MISSING_ERROR))
            .then(() => done())
    })

    it("should fail if body is missing (2)", function(done) {
        const entries = [{
            "date": 1514464620,
            "title": "This should fail",
            "body": ""
        }]
        importFromJSON(entries)
            .then(result => assert.equal(result.errors[0].error, BODY_MISSING_ERROR))
            .then(() => done())
    })

    it("should fail if body contains wrong chars", function(done) {
        const entries = [{
            "date": 1514480400,
            "title": "This should fail",
            "body": "This should fail as well:\n "
        }]
        importFromJSON(entries)
            .then(result => assert.equal(result.errors[0].error.length, 1))
            .then(() => done())
    })

    it("should import one entry", function(done) {
        const entries = [{
            "date": 1514050100,
            "title": "Mon titre",
            "body": "Lorem ipsum dolor sit amet"
        }]
        importFromJSON(entries)
            .then(result => {
                const entry = result.success[0]
                delete entry._id
                assert.deepStrictEqual(entry, {
                    date: 1514050100,
                    title: "Mon titre",
                    body: "Lorem ipsum dolor sit amet"
                })
            })
            .then(() => done())
    })

    it("should import an array of entries", function(done) {
        const entries = [
            {
                "date": 1514248080,
                "title": "Lorem Ipsum",
                "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet eros quis sem suscipit sollicitudin id at sem. Morbi sed suscipit ligula, at tincidunt lectus. Sed mollis iaculis augue, nec congue dolor sodales vitae. Phasellus pellentesque rhoncus elementum. Maecenas lobortis tristique sem sit amet blandit. Pellentesque sit amet ligula accumsan, pharetra sem vitae, eleifend lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sodales et ligula vitae molestie. Vivamus congue metus ex. Cras vitae tempor arcu, non condimentum ante. Sed iaculis erat lacus, non volutpat lectus sollicitudin quis."
            },
            {
                "date": 1514248081,
                "title": "Lorem Ipsum",
                "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet eros quis sem suscipit sollicitudin id at sem. Morbi sed suscipit ligula, at tincidunt lectus. Sed mollis iaculis augue, nec congue dolor sodales vitae. Phasellus pellentesque rhoncus elementum. Maecenas lobortis tristique sem sit amet blandit. Pellentesque sit amet ligula accumsan, pharetra sem vitae, eleifend lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sodales et ligula vitae molestie. Vivamus congue metus ex. Cras vitae tempor arcu, non condimentum ante. Sed iaculis erat lacus, non volutpat lectus sollicitudin quis."
            }
        ]
        importFromJSON(entries)
            .then(result => assert.equal(result.success.length, 2))
            .then(() => done())
    })

    it("should sort success and errors", function(done) {
        const entries = [
            {
                "date": 1514248080,
                "title": "Lorem Ipsum",
                "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet eros quis sem suscipit sollicitudin id at sem. Morbi sed suscipit ligula, at tincidunt lectus. Sed mollis iaculis augue, nec congue dolor sodales vitae. Phasellus pellentesque rhoncus elementum. Maecenas lobortis tristique sem sit amet blandit. Pellentesque sit amet ligula accumsan, pharetra sem vitae, eleifend lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sodales et ligula vitae molestie. Vivamus congue metus ex. Cras vitae tempor arcu, non condimentum ante. Sed iaculis erat lacus, non volutpat lectus sollicitudin quis."
            },
            {
                "date": 1514248081,
                "title": "Lorem Ipsum",
                "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet eros quis sem suscipit sollicitudin id at sem. Morbi sed suscipit ligula, at tincidunt lectus. Sed mollis iaculis augue, nec congue dolor sodales vitae. Phasellus pellentesque rhoncus elementum. Maecenas lobortis tristique sem sit amet blandit. Pellentesque sit amet ligula accumsan, pharetra sem vitae, eleifend lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sodales et ligula vitae molestie. Vivamus congue metus ex. Cras vitae tempor arcu, non condimentum ante. Sed iaculis erat lacus, non volutpat lectus sollicitudin quis."
            },
            {
                "title": "This should fail",
                "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet eros quis sem suscipit sollicitudin id at sem. Morbi sed suscipit ligula, at tincidunt lectus. Sed mollis iaculis augue, nec congue dolor sodales vitae. Phasellus pellentesque rhoncus elementum. Maecenas lobortis tristique sem sit amet blandit. Pellentesque sit amet ligula accumsan, pharetra sem vitae, eleifend lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sodales et ligula vitae molestie. Vivamus congue metus ex. Cras vitae tempor arcu, non condimentum ante. Sed iaculis erat lacus, non volutpat lectus sollicitudin quis."
            },
            {
                "date": 1514464620,
                "title": "This should fail"
            },
            {
                "date": 1514464620,
                "title": "This should fail",
                "body": ""
            },
            {
                "date": 1514480400,
                "title": "This should fail",
                "body": "This should fail as well:\n "
            }
        ]
        importFromJSON(entries)
            .then(result => {
                assert.equal(result.success.length, 2)
                assert.equal(result.errors.length, 4)
            })
            .then(() => done())
    })

    it("should import an array of entries from a file", function(done) {
        importEntries("test/test.json")
            .then(result => assert.equal(result.success.length, 2))
            .then(() => done())
    })

    it("should write rejects in a separate file", function(done) {
        importEntries("test/test.json")
            .then(() => new Promise((resolve, reject) => {
                fs.readFile(
                    "test/test-rejects.json",
                    "utf8",
                    (err, data) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(JSON.parse(data))
                        }
                    }
                )
            }))
            .then(data => assert.equal(data.length, 4))
            .then(() => done())
    })
})