import {extractEntries, FILE_PATH_ERROR} from "../src/extract"
import assert from "assert"
import fs from "fs"

describe("#extract", function(done) {

    this.timeout(60000)

    it("should throw an error if provided with a wrong file path", function() {
        assert.throws(() => extractEntries(".xml", 2017), new RegExp(FILE_PATH_ERROR))
    })

    it("should throw an error if provided with a wrong file path (2)", function() {
        assert.throws(() => extractEntries("file.xmz", 2017), new RegExp(FILE_PATH_ERROR))
    })

    it("should throw an error if provided with a wrong file path (3)", function() {
        assert.throws(() => extractEntries("file", 2017), new RegExp(FILE_PATH_ERROR))
    })

    it("should find 6 entries", function(done) {
        extractEntries("test/Journal\ 2017.xml", 2017)
            .then(result => assert.equal(result.success.length, 6))
            .then(() => done())
    })

    it("should find 2 rejects and write them in a separate file", function(done) {
        extractEntries("test/Journal\ 2017.xml", 2017)
            .then(() => new Promise((resolve, reject) => {
                fs.readFile(
                    "test/Journal\ 2017-extract-rejects.json",
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
            .then(data => assert.equal(data.length, 2))
            .then(() => done())
    })
})