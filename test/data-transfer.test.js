import {
    transferData,
    EXPORT_OR_IMPORT_ERROR,
    NO_EXPORT_PATH_PROVIDED_ERROR,
    WRONG_EXPORT_EXTENSION_ERROR,
    NO_IMPORT_PATH_PROVIDED_ERROR,
    WRONG_IMPORT_EXTENSION_ERROR
} from "../src/data-transfer"

import assert from "assert"

describe("#transferData()", function() {

    it("should throw error if neither -e nor -i option is provided", function() {
        const options = {}
        assert.throws(() => transferData(options), Error, EXPORT_OR_IMPORT_ERROR)
    })

    it("should throw error if -e and -i options are both set to true", function() {
        const options = {
            export: true,
            import: true
        }
        assert.throws(() => transferData(options), Error, EXPORT_OR_IMPORT_ERROR)
    })

    it("should throw error if -e option is set and no -p provided", function() {
        const options = {
            export: true
        }
        assert.throws(() => transferData(options), Error, NO_EXPORT_PATH_PROVIDED_ERROR)
    })

    it("should throw error if -e option is set and -p provided with wrong file extension", function() {
        const options = {
            export: true,
            path: "Journal"
        }
        assert.throws(() => transferData(options), Error, WRONG_EXPORT_EXTENSION_ERROR)
    })

    it("should throw error if -e option is set and -p provided with wrong file extension (2)", function() {
        const options = {
            export: true,
            path: "Journal.doc"
        }
        assert.throws(() => transferData(options), Error, WRONG_EXPORT_EXTENSION_ERROR)
    })

    it("should throw error if -e option is set and -p provided with wrong file extension (3)", function() {
        const options = {
            export: true,
            path: "Journal.test.doc"
        }
        assert.throws(() => transferData(options), Error, WRONG_EXPORT_EXTENSION_ERROR)
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

    it("should return true if correct arguments are provided", function() {
        const options = {
            export: true,
            path: "Journal\ 2017.docx"
        }
        assert.equal(transferData(options), true)
    })

})