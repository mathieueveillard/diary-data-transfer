import request from "request"
import fs from "fs"

const URL_ROOT = "http://localhost:4000/graphql"
export const FILE_PATH_ERROR = "File extension must be .json"

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

    //Removes extension from file path
    path = path.split(".")
    if (path.length < 2 || path[path.length - 1] !== "json") {
        throw Error(FILE_PATH_ERROR)
    }
    path.splice(path.length - 1, 1)
    path = path.join(".")

    return new Promise((resolve, reject) => {
        fs.readFile(
            path + ".json",
            "utf8",
            (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(JSON.parse(data))
                }
            }
        )
    }).then(entries => importFromJSON(entries))
}