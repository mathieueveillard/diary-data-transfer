const parse = require('xml-parser')

/**
 * A function that transforms inline styles described as xml to markdown
 * Doesn't handle bold AND italic at the same time, e.g. **_text_**
 */
export const inlineStyleToMarkdown = function(xml) {

    const obj = parse(xml).root

    let children = obj.children.filter(node => node.name === "w:r")

    children = children.map(node => {

        if (node.children.length === 1
            && node.children[0].name === "w:t") {
            return node.children[0].content
        }

        else if (node.children.length === 2
            && node.children[0].name === "w:rPr"
            && node.children[1].name === "w:t") {

                switch (node.children[0].children[0].name) {

                    case "w:i":
                        return "_" + node.children[1].content + "_"
                        break
                
                    case "w:b":
                        return "__" + node.children[1].content + "__"
                        break
                
                    case "w:strike":
                        return "~~" + node.children[1].content + "~~"
                        break
                
                    case "w:u":
                    default:
                        return node.children[1].content
                        break
                }
        }

        else {
            return ""
        }
    })

    children = children.map(node => node.trim())
        .filter(node => node !== "")
        .join(" ")
        
    return children
}