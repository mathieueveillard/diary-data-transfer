const parse = require('xml-parser')

/**
 * A function that transforms inline styles described as xml to markdown
 * Doesn't handle bold AND italic at the same time, e.g. **_text_**
 */
export const inlineStyleToMarkdown = function(xml) {

    const obj = parse(xml).root

    /**
     * This will be used later
     */
    let children = obj.children.filter(node => node.name === "w:r")

    /**
     * Detects superscript and subscript
     */
    let combine = children.map(node => {
        if (node.children.length === 2
            && node.children[0].name === "w:rPr"
            && node.children[0].children.length > 0
            && node.children[0].children[0].name === "w:vertAlign") {
                return 1
        } else {
            return 0
        }
    })

    /**
     * Handles italic, bold, strike and underline styles
     */
    children = children.map(node => {

        if (node.children.length === 1
            && node.children[0].name === "w:t") {
            return node.children[0].content
        }

        else if (node.children.length === 2
            && node.children[0].name === "w:rPr"
            && node.children[0].children.length > 0
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

    /**
     * Detects final dots
     */
    for (let i = 0; i < children.length; i++) {
        if (children[i] !== "" && children[i].charAt(0) === ".") {
            combine[i] = 1
        }
    }

    /**
     * Handles superscript and subscript by combining children
     */
    if (children.length > 1) {
        let combinedChildren = []

        for (let i = 0; i < children.length; i++) {
            if (combine[i] === 0 && i + 1 < children.length && combine[i + 1] === 1) {
                combinedChildren[combinedChildren.length] = children[i] + children[i + 1]
                i++
            } else {
                combinedChildren[combinedChildren.length] = children[i]
            }
        }

        children = combinedChildren
    }

    /**
     * Clean and returns as a string
     */
    const text = children.map(node => node.trim())
        .filter(node => node !== "")
        .join(" ")
        
    return text
}