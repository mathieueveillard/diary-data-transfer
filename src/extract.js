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

                    let paragraphs = body.children.map(paragraph => handle(paragraph, year, relations))
                        .filter(obj => obj)

                    resolve(assemble(paragraphs))
                }
            })
    })

    .then(paragraphs => {
        return new Promise((resolve, reject) => {
            fs.writeFile(
                path + ".json",
                JSON.stringify(paragraphs).replace(/\\n/g, "\\\\n"),
                "utf8",
                (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(paragraphs)
                    }
                }
            )
        })
    })
}