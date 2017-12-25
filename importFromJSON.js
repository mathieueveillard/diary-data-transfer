const request = require("request")
const fs = require('fs')

const URL_ROOT = "http://localhost:4000/graphql"

const importSingleEntryFromJSON = function(entry) {

    const options = {
        method: "POST",
        uri: URL_ROOT,
        json: true,
        body: {
            "query":
                `mutation {
                    createEntryForDataRecovery(input: {
                        date: ${entry.date},
                        title: "${entry.title}",
                        body: "${entry.body}"
                    }) {
                        _id
                        date
                    }
                }`
        }
    }

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                reject(error)
            } else {
                resolve(body.data.createEntryForDataRecovery)
            }
        })
    })

    return true
}

export const importFromJSON = function(entries) {
    return Promise.all(entries.map(entry => importSingleEntryFromJSON(entry)))
}

export const importFromJSONFile = function(path) {
    return importFromJSON(JSON.parse(fs.readFileSync(path, "utf8")))
}