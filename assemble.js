/**
 * A function that accepts an array of objects and returns another array of objects, reassembled.
 * Reassembles date, title and body paragraphs into entries
 */
export const assemble = function(parsed) {

    const DEFAULT_TITLE = ""
    let date,
        title = DEFAULT_TITLE,
        body,
        result = []

    for (let obj of parsed) {

        if (obj.hasOwnProperty("date")) {
            if (isNaN(obj.date)) {
                date = (new Date(
                    obj.date.year,
                    obj.date.month - 1,
                    obj.date.day,
                    obj.date.hours,
                    obj.date.minutes
                )).getTime() //Beware: local time
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