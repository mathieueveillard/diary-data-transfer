import fs from "fs"
import parse from "xml-parser"
import {dispatch} from "./dispatch"
import {assemble} from "./assemble"

export const FILE_PATH_ERROR = "File extension must be .xml"

export const exportToJSON = function(path, year) {

    //Removes extension from file path
    path = path.split(".")
    if (path.length < 2 || path[path.length - 1] !== "xml") {
        throw Error(FILE_PATH_ERROR)
    }
    path.splice(path.length - 1, 1)
    path = path.join(".")

    const obj = parse(fs.readFileSync(path + ".xml", "utf8"))
    
    /**
     * Document hierarchy:
     *  <pkg:package> (root)
     *      <pkg:part pkg:name="/word/document.xml">
     *          <pkg:xmlData>
     *              <w:document>
     *                  <w:body>
     */

    const body = (obj.root //pkg:package
        .children.filter(child => child.attributes["pkg:name"] === "/word/document.xml"))[0] //pkg:part
        .children[0] //pkg:xmlData
        .children[0] //w:document
        .children[0] //w:body

    let paragraphs = body.children.map(paragraph => dispatch(paragraph, year))
        .filter(obj => obj)

    paragraphs = assemble(paragraphs)

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
}