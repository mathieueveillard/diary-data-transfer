import {exportToJSON, FILE_PATH_ERROR} from "../src/exportToJSON"
import assert from "assert"

describe("#exportToJSON()", function(done) {

    this.timeout(60000)

    it("should throw an error if provided with a wrong file path", function() {
        assert.throws(() => exportToJSON(".xml", 2017), Error, FILE_PATH_ERROR)
    })

    it("should throw an error if provided with a wrong file path (2)", function() {
        assert.throws(() => exportToJSON("file.xmz", 2017), Error, FILE_PATH_ERROR)
    })

    it("should throw an error if provided with a wrong file path (3)", function() {
        assert.throws(() => exportToJSON("file", 2017), Error, FILE_PATH_ERROR)
    })

    it("should find 6 entries", function(done) {
        exportToJSON("test/Journal\ 2017.xml", 2017)
            .then(result => assert.equal(result.length, 6))
            .then(() => done())
    })
})