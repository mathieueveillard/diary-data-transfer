import {exportToJSON} from "../src/exportToJSON"
import assert from "assert"

describe.skip("#exportToJSON()", function() {

    this.timeout(60000)

    it("should find 7 entries", function() {
        const result = exportToJSON("test/2017.xml", 2017)
        console.log(result)
        assert.equal(result.length, 7)
    })
})