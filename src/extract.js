import fs from "fs"
import parse from "xml-parser"
import {handle} from "./handle"
import {assemble} from "./assemble"

export const FILE_PATH_ERROR = "File extension must be .xml"

export const extractEntries = function(path, year) {

    //Removes extension from file path
    path = path.split(".")
        .filter(s => s)
    if (path.length < 2 || path[path.length - 1] !== "xml") {
        throw Error(FILE_PATH_ERROR)
    }
    path.splice(path.length - 1, 1)
    path = path.join(".")


    return new Promise((resolve, reject) => {

        fs.readFile(
            path + ".xml",
            "utf8",
            (err, data) => {

                if (err) {
                    reject(err)
                } else {
                    /**
                     * Document hierarchy:
                     *  <pkg:package> (root)
                     *      <pkg:part pkg:name="/word/document.xml">
                     *          <pkg:xmlData>
                     *              <w:document>
                     *                  <w:body>
                     */

                    const obj = parse(data)

                    const body = (obj.root //pkg:package
                        .children.filter(child => child.attributes["pkg:name"] === "/word/document.xml"))[0] //pkg:part
                        .children[0] //pkg:xmlData
                        .children[0] //w:document
                        .children[0] //w:body

                    /**
                     * Document hierarchy:
                     *  <pkg:package> (root)
                     *      <pkg:part pkg:name="/word/_rels/document.xml.rels">
                     *          <pkg:xmlData>
                     *              <Relationships>
                     */

                    const relations = (obj.root //pkg:package
                        .children.filter(child => child.attributes["pkg:name"] === "/word/_rels/document.xml.rels"))[0] //pkg:part
                        .children[0] //pkg:xmlData
                        .children[0] //Relationships

                    const SUCCESS = "Success"
                    const ERROR = "Error"

                    const results = body.children.map(paragraph => {
                        try {
                            return {
                                status: SUCCESS,
                                paragraph: handle(paragraph, year, relations)
                            }
                        } catch (error) {
                            return {
                                status: ERROR,
                                error: {
                                    error: error.toString(),
                                    paragraph
                                }
                            }
                        }
                    })

                    resolve({
                        success: results
                            .filter(result => result.status === SUCCESS && result.paragraph)
                            .map(result => result.paragraph),
                        errors: results
                            .filter(result => result.status === ERROR)
                            .map(result => result.error)
                    })
                }
            })
    })

    .then(result => ({
        success: assemble(result.success),
        errors: result.errors
    }))

    .then(result => {
        return Promise.all([

            //Success
            new Promise((resolve, reject) => {
                fs.writeFile(
                    path + ".json",
                    JSON.stringify(result.success).replace(/\\n/g, "\\\\n"),
                    "utf8",
                    error => {
                        if (error) {
                            reject(error)
                        } else {
                            resolve(result.success)
                        }
                    }
                )
            }),

            //Errors
            new Promise((resolve, reject) => {
                fs.writeFile(
                    path + "-extract-rejects.json",
                    JSON.stringify(result.errors),
                    "utf8",
                    error => {
                        if (error) {
                            reject(error)
                        } else {
                            resolve(result.errors)
                        }
                    }
                )
            })
        ])
    })
    .then(results => ({
        success: results[0],
        errors: results[1]
    }))
}