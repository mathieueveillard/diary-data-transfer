/**
 * A function that accepts an array of objects and returns another array of objects, reassembled.
 * Groups paragraphs of same style (MonParagraphe, MaCitation).
 * Reassembles date, title and body paragraphs into entries.
 */
export const assemble = function(parsed) {

    if (parsed.length === 0) {
        return []
    }

    /**
     * Group
     */
    const grouped = parsed.reduce((acc, cur) => {

        if (cur.style === undefined || cur.style === "MonTweet") {
            delete acc.style
            delete cur.style
            acc.grouped.push(cur)
        }
        else if (cur.style !== acc.style) {
            acc.style = cur.style
            delete cur.style
            acc.grouped.push(cur)
        }
        else {
            acc.grouped[acc.grouped.length - 1] = {
                body: `${acc.grouped[acc.grouped.length - 1].body}

            ${cur.body}`
            }
        }

        return acc
    }, {
        grouped: []
    })
    .grouped


    /**
     * Propagates date and title
     */

    const DEFAULT_TITLE = ""
    let date,
        title = DEFAULT_TITLE,
        body,
        result = []

    for (let obj of grouped) {

        if (obj.hasOwnProperty("date")) {
            if (isNaN(obj.date)) {
                date = (new Date(
                    obj.date.year,
                    obj.date.month,
                    obj.date.day,
                    obj.date.hours,
                    obj.date.minutes
                )).getTime() / 1000 //Beware: local time
            } else {
                date = obj.date
            }
            title = DEFAULT_TITLE
            body = undefined
        }

        if (obj.hasOwnProperty("title")) {
            title = obj.title
            body = undefined
        }

        if (obj.hasOwnProperty("body")) {
            body = obj.body
        }

        if (date && body) {
            result.push({
                date,
                title,
                body
            })
        }
    }

    return result
}