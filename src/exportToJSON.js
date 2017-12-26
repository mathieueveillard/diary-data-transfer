import fs from "fs"
import parse from "xml-parser"
import {dispatch} from "./dispatch"
import {assemble} from "./assemble"

export const exportToJSON = function(path, year) {

    const obj = parse(fs.readFileSync(path, "utf8"))
    
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

    fs.writeFileSync(year + ".json", JSON.stringify(paragraphs))
    
    return paragraphs
}