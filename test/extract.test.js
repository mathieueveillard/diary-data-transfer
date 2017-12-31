import {extractEntries, FILE_PATH_ERROR} from "../src/extract"
import assert from "assert"

describe("#extract", function(done) {

    this.timeout(60000)

    it("should throw an error if provided with a wrong file path", function() {
        assert.throws(() => extractEntries(".xml", 2017), Error, FILE_PATH_ERROR)
    })

    it("should throw an error if provided with a wrong file path (2)", function() {
        assert.throws(() => extractEntries("file.xmz", 2017), Error, FILE_PATH_ERROR)
    })

    it("should throw an error if provided with a wrong file path (3)", function() {
        assert.throws(() => extractEntries("file", 2017), Error, FILE_PATH_ERROR)
    })

    it("should find 6 entries", function(done) {
        extractEntries("test/Journal\ 2017.xml", 2017)
            .then(result => assert.equal(result.length, 6))
            .then(() => done())
    })
})