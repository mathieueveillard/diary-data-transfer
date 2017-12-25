import {importFromJSON, importFromJSONFile} from "../importFromJSON"
import assert from "assert"

describe("#importFromJSON()", function(done) {

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
        .then(entries => assert.equal(entries[0].date, 1514050100))
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
        .then(entries => assert.equal(entries.length, 3))
        .then(() => done())
    })

    it("should import an array of entries from a file", function(done) {
        importFromJSONFile("test/2017.json")
        .then(entries => assert.equal(entries.length, 3))
        .then(() => done())
    })
})