import {
    transferData,
    EXTRACT_OR_IMPORT_ERROR,
    EXTRACT_PATH_PROVIDED_ERROR,
    EXTRACT_EXTENSION_ERROR,
    NO_IMPORT_PATH_PROVIDED_ERROR,
    WRONG_IMPORT_EXTENSION_ERROR
} from "../src/data-transfer"

import assert from "assert"

describe("#data-transfer", function(done) {

    this.timeout(60000)

    it("should throw error if neither -e nor -i option is provided", function() {
        const options = {}
        assert.throws(() => transferData(options), Error, EXTRACT_OR_IMPORT_ERROR)
    })

    it("should throw error if -e and -i options are both set to true", function() {
        const options = {
            extract: true,
            import: true
        }
        assert.throws(() => transferData(options), Error, EXTRACT_OR_IMPORT_ERROR)
    })

    it("should throw error if -e option is set and no -p provided", function() {
        const options = {
            extract: true
        }
        assert.throws(() => transferData(options), Error, EXTRACT_PATH_PROVIDED_ERROR)
    })

    it("should throw error if -e option is set and -p provided with wrong file extension", function() {
        const options = {
            extract: true,
            path: "Journal"
        }
        assert.throws(() => transferData(options), Error, EXTRACT_EXTENSION_ERROR)
    })

    it("should throw error if -e option is set and -p provided with wrong file extension (2)", function() {
        const options = {
            extract: true,
            path: "Journal.docx"
        }
        assert.throws(() => transferData(options), Error, EXTRACT_EXTENSION_ERROR)
    })

    it("should throw error if -e option is set and -p provided with wrong file extension (3)", function() {
        const options = {
            extract: true,
            path: "Journal.test.docx"
        }
        assert.throws(() => transferData(options), Error, EXTRACT_EXTENSION_ERROR)
    })

    it("should throw error if -i option is set and no -p provided", function() {
        const options = {
            import: true
        }
        assert.throws(() => transferData(options), Error, NO_IMPORT_PATH_PROVIDED_ERROR)
    })

    it("should throw error if -i option is set and -p provided with wrong file extension", function() {
        const options = {
            import: true,
            path: "Journal"
        }
        assert.throws(() => transferData(options), Error, WRONG_IMPORT_EXTENSION_ERROR)
    })

    it("should throw error if -i option is set and -p provided with wrong file extension (2)", function() {
        const options = {
            import: true,
            path: "Journal.jso"
        }
        assert.throws(() => transferData(options), Error, WRONG_IMPORT_EXTENSION_ERROR)
    })

    it("should throw error if -i option is set and -p provided with wrong file extension (3)", function() {
        const options = {
            import: true,
            path: "Journal.test.jso"
        }
        assert.throws(() => transferData(options), Error, WRONG_IMPORT_EXTENSION_ERROR)
    })

    it("should extract data from file", function(done) {
        const options = {
            extract: true,
            path: "test/Journal\ 2017.xml",
            year: 2017
        }
        transferData(options)
            .then(result => assert.equal(result, "6 entries have been found and saved in test/Journal\ 2017.json"))
            .then(() => done())
    })

    it("should import data from file", function(done) {
        const options = {
            import: true,
            path: "test/Journal\ 2017.json",
            year: 2017
        }
        transferData(options)
            .then(result => assert.equal(result, "6 entries have been found and inserted"))
            .then(() => done())
    })
})