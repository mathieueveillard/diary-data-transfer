import {importEntries, importFromJSON, FILE_PATH_ERROR} from "../src/import"
import assert from "assert"

describe("#import", function(done) {

    it("should throw an error if provided with a wrong file path", function() {
        assert.throws(() => importEntries(".json"), Error, FILE_PATH_ERROR)
    })

    it("should throw an error if provided with a wrong file path (2)", function() {
        assert.throws(() => importEntries("file.jso"), Error, FILE_PATH_ERROR)
    })

    it("should throw an error if provided with a wrong file path (3)", function() {
        assert.throws(() => importEntries("file"), Error, FILE_PATH_ERROR)
    })

    it("should import one entry", function(done) {
        const entries = [
            {
                "date": 1514050100,
                "title": "Mon titre",
                "body": "Lorem ipsum dolor sit amet"
            },
            {
                "date": 1514050200,
                "title": "Mon titre2",
                "body": "consectetur adipiscing elit"
            },
            {
                "date": 1514050203,
                "body": "Sed ut perspiciatis unde omnis iste natus"
            }
        ]
        importFromJSON([entries[0]])
        .then(result => assert.equal(result[0].date, 1514050100))
        .then(() => done())
    })

    it("should import an array of entries", function(done) {
        const entries = [
            {
                "date": 1514050100,
                "title": "Mon titre",
                "body": "Lorem ipsum dolor sit amet"
            },
            {
                "date": 1514050200,
                "title": "Mon titre2",
                "body": "consectetur adipiscing elit"
            },
            {
                "date": 1514050203,
                "body": "Sed ut perspiciatis unde omnis iste natus"
            }
        ]
        importFromJSON(entries)
        .then(result => assert.equal(result.length, 3))
        .then(() => done())
    })

    it("should import an array of entries from a file", function(done) {
        importEntries("test/Journal\ 2017.json")
        .then(result => assert.equal(result.length, 6))
        .then(() => done())
    })
})