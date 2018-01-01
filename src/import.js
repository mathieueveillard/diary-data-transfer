import request from "request"
import fs from "fs"
import { resolveObject } from "url";
import { resolve } from "url";

const URL_ROOT = "http://localhost:4000/graphql"
export const FILE_PATH_ERROR = "FILE_PATH_ERROR: File extension must be .json"
export const DATE_MISSING_ERROR = "DATE_MISSING_ERROR: Entry's date is missing"
export const BODY_MISSING_ERROR = "BODY_MISSING_ERROR: Entry's body is missing"

const importSingleEntryFromJSON = function(entry) {

    if (!entry.date) {
        return Promise.reject({
            error: DATE_MISSING_ERROR,
            entry
        })
    }

    if (!entry.body) {
        return Promise.reject({
            error: BODY_MISSING_ERROR,
            entry
        })
    }

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
                        title
                        body
                    }
                }`
        }
    }

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                reject({
                    error,
                    entry
                })
            } else {
                if (body.errors) {
                    reject({
                        error: body.errors,
                        entry
                    })
                } else {
                    resolve(body.data.createEntryForDataRecovery)
                }
            }
        })
    })
}

export const importFromJSON = function(entries) {
    const SUCCESS = "Success"
    const ERROR = "Error"
    return Promise.all(entries.map(entry => importSingleEntryFromJSON(entry)
        .then(entry => ({
            status: SUCCESS,
            entry
        }))
        .catch(error => ({
            status: ERROR,
            error
        }))
    ))
    .then(results => ({
        success: results
            .filter(result => result.status === SUCCESS)
            .map(result => result.entry),
        errors: results
            .filter(result => result.status === ERROR)
            .map(result => result.error)
    }))
}

export const importEntries = function(path) {

    //Removes extension from file path
    path = path.split(".")
        .filter(s => s)
    if (path.length < 2 || path[path.length - 1] !== "json") {
        throw Error(FILE_PATH_ERROR)
    }
    path.splice(path.length - 1, 1)
    path = path.join(".")

    return new Promise((resolve, reject) => {
        fs.readFile(
            path + ".json",
            "utf8",
            (error, data) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(JSON.parse(data))
                }
            }
        )
    })
    .then(entries => importFromJSON(entries))
    .then(result => {
        return new Promise((resolve, reject) => {
            fs.writeFile(
                path + "-import-rejects.json",
                JSON.stringify(result.errors),
                "utf8",
                error => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(result)
                    }
                }
            )
        })
    })
}