import {assemble} from "../src/assemble"
import assert from "assert"

describe("#assemble()", function() {

    it("should calculate timestamp based on date object", function() {
        const parsed = [
            {
                date: {
                    year: 2017,
                    month: 11,
                    day: 23,
                    hours: 19,
                    minutes: 30
                }
            },
            {title: "Mon titre"},
            {body: "Lorem ipsum dolor sit amet"},
        ]
        assert.deepStrictEqual(assemble(parsed)[0], {
            date: 1514053800,
            title: "Mon titre",
            body: "Lorem ipsum dolor sit amet"
        })
    })

    it("should re-assemble objects by date", function() {
        const parsed = [
            {date: 1514050100},
            {title: "Mon titre"},
            {body: "Lorem ipsum dolor sit amet"},
            {title: "Mon titre2"},
            {body: "consectetur adipiscing elit"},
            {date: 1514050300},
            {title: "Mon titre3"},
            {body: "Sed ut perspiciatis unde omnis iste natus"},
        ]
        assert.deepStrictEqual(assemble(parsed)[1], {
            date: 1514050100,
            title: "Mon titre2",
            body: "consectetur adipiscing elit"
        })
    })

    it("should re-assemble objects by date and title", function() {
        const parsed = [
            {date: 1514050100},
            {title: "Mon titre"},
            {body: "Lorem ipsum dolor sit amet"},
            {body: "consectetur adipiscing elit"},
            {date: 1514050300},
            {title: "Mon titre3"},
            {body: "Sed ut perspiciatis unde omnis iste natus"},
        ]
        assert.deepStrictEqual(assemble(parsed)[1], {
            date: 1514050100,
            title: "Mon titre",
            body: "consectetur adipiscing elit"
        })
    })

    it("should set a default title if none is provided", function() {
        const parsed = [
            {date: 1514050100},
            {body: "Lorem ipsum dolor sit amet"},
        ]
        assert.deepStrictEqual(assemble(parsed)[0], {
            date: 1514050100,
            title: "",
            body: "Lorem ipsum dolor sit amet"
        })
    })

    it("should re-assemble objects (integration)", function() {
        const parsed = [
            {
                date: {
                    year: 2017,
                    month: 11,
                    day: 23,
                    hours: 19,
                    minutes: 30
                }
            },
            {body: "Lorem ipsum dolor sit amet"},
            {body: "consectetur adipiscing elit"},
            {date: 1514050300},
            {title: "Mon titre3"},
            {body: "Sed ut perspiciatis unde omnis iste natus"},
        ]
        assert.deepStrictEqual(assemble(parsed)[1], {
            date: 1514053800,
            title: "",
            body: "consectetur adipiscing elit"
        })
    })
})