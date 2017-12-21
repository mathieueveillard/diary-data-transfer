import {inlineStyleToMarkdown} from '../parse'
var assert = require('assert')

describe('Array', function() {
    describe('#inlineStyleToMarkdown()', function() {
        it('should import function', function() {
            assert.equal(inlineStyleToMarkdown(), -1)
        });
    });
});