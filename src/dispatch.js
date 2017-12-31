export const NON_VALID_DATE_ERROR = "This is not a valid date format"

/**
 * A main function that parses xml and dispatches to the appropriate handling function.
 * Returns the paragraph as an object, either `{date}`, `{title}` or `{body}`
 * @param {*} obj An XML object parsed as JSON
 * @param {*} year Year
 * @param {*} relations The `<Relationships></Relationships>` tag parsed as JSON
 */
export const dispatch = function(obj, year, relations) {
    
    /**
     * Returns null for non-paragraphs or empty paragraphs
     */
    if (obj.name !== "w:p" || obj.children.length > 0
        && obj.children[0].name === "w:pPr"
        && obj.children[0].children.length > 0
        && obj.children[0].children[0].name === "w:jc") {

        return null
    }
    else if (obj.children.length > 0
        && obj.children[0].name === "w:pPr"
        && obj.children[0].children.length > 0
        && obj.children[0].children[0].name === "w:pStyle") {
        
        switch (obj.children[0].children[0].attributes["w:val"]) {
            case "MaDate":
                return handleDateParagraph(obj, year)
                break
        
            case "MonTitre":
                return handleTitleParagraph(obj)
                break
        
            case "MonTweet":
            case "MonParagraphe":
            case "MaCitation":
                return handleTextParagraph(obj, relations)
                break
            
            default:
                return null
                break
        }
    }
}


/**
 * A function that handles date paragraphs
 * @param {*} obj An XML object parsed as JSON
 */
const handleDateParagraph = function(obj, year) {

    let children = obj.children.filter(node => node.name === "w:r")
    
    const date = {}

    let grandChildren = children.map(child => child.children.filter(node => node.name === "w:t")[0])

    /**
     * Find day, hours and minutes
     */
    const numbers = (grandChildren.map(child => child.content)
        .join("")
        .match(/\d*/g) || [])
        .filter(s => s !== "")
        .map(s => parseInt(s))

    if (numbers.length === 0 || numbers.length > 3) {
        throw Error(NON_VALID_DATE_ERROR)
    }

    if (numbers.length === 1) {
        date.day = numbers[0]
    }

    if (numbers.length === 2) {
        //Day & hours or day & minutes won't happen due to good data quality
        date.hours = numbers[0]
        date.minutes = numbers[1]
    }

    if (numbers.length === 3) {
        date.day = numbers[0]
        date.hours = numbers[1]
        date.minutes = numbers[2]
    }

    /**
     * Find month
     */
    const months = (grandChildren.map(child => child.content)
        .join(" ")
        .match(/janvier|f[e|é]vrier|mars|avril|mai|juin|juillet|ao[u|û]t|septembre|octobre|novembre|d[e|é]cembre/i) || [])
        .filter(s => s !== "")
        .map(s => {
            s = s.toLowerCase()
            switch (s) {
                case "février":
                    s = "fevrier"
                    break
            
                case "août":
                    s = "aout"
                    break
            
                case "décembre":
                    s = "decembre"
                    break
            
                default:
                    break
            }
            const MONTHS = [
                "janvier",
                "fevrier",
                "mars",
                "avril",
                "mai",
                "juin",
                "juillet",
                "aout",
                "septembre",
                "octobre",
                "novembre",
                "decembre"
            ]
            return MONTHS.indexOf(s)
        })

    if (months.length > 0) {
        date.month = months[0]
    }

    /**
     * Set year
     */
    date.year = year || (new Date()).getFullYear()

    if (date.day === undefined || date.month === undefined) {
        throw Error(NON_VALID_DATE_ERROR)
    } else {
        return {date}
    }
}


/**
 * A function that handles title paragraphs
 * @param {*} obj An XML object parsed as JSON
 */
const handleTitleParagraph = function(obj) {

    let title = ""

    title += obj.children.filter(node => node.name === "w:r")
        .map(child => child.children[0].content.trim())
        .filter(s => s !== "")
        .join(" ")
    
    if (title === "") {
        return null
    } else {
        return {title}
    }
}


/**
 * A function that handles text paragraphs (MonTweet, MonParagraphe, MaCitation)
 * @param {*} obj An XML object parsed as JSON
 * @param {*} relations The `<Relationships></Relationships>` tag parsed as JSON
 */
const handleTextParagraph = function(obj, relations) {

    let body = ""

    const style = obj.children[0].children[0].attributes["w:val"]

    /**
     * Handles `MaCitation` paragraph's style
     */
    if (style === "MaCitation") {
        body += "> "
    }

    /**
     * Handles `MonParagraphe` style with (numbered) items
     */
    if (style === "MonParagraphe"
        && obj.children[0].children.length > 1
        && obj.children[0].children[1].name === "w:numPr") {
        
        body += "- "
    }

    /**
     * Filters on elements and handles hyperlinks
     */
    let children = obj.children
        .filter(node => node.name === "w:r" || node.name === "w:hyperlink")
        .map(node => {

            if (node.name === "w:r") {
                return node
            }
            else if (node.name === "w:hyperlink") {

                /*
                    <w:hyperlink r:id="rId5" w:history="1">
                        <w:r w:rsidRPr="006D35AA">
                            <w:rPr>
                                <w:rStyle w:val="Lienhypertexte"/>
                            </w:rPr>
                            <w:t>lien hypertexte</w:t>
                        </w:r>
                    </w:hyperlink>

                    Should transform in

                    <w:r>
                        <w:t>[lien hypertexte](URL)<w:t>
                    </w:r>
                */

                //Get URL
                const id = node.attributes["r:id"]
                const url = relations.children
                    .find(node => node.name === "Relationship" && node.attributes["Id"] === id)
                    .attributes["Target"]

                //Get displayed text
                const text = node.children
                    .filter(node => node.name === "w:r")
                    .map(node => node.children
                        .find(node => node.name === "w:t")
                        .content
                        .trim()
                    )
                    .filter(s => s !== "")
                    .join(" ")
                
                return {
                    name: "w:r",
                    children: [{
                        name: "w:t",
                        content: `[${text}](${url})`
                    }]
                    
                }
            }
        })

    /**
     * Detects superscript and subscript (will be managed later)
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
     * Handles superscript and subscript by combining children
     */
    if (children.length > 1) {
        let combinedChildren = []

        for (let i = 0; i < children.length; i++) {
            if (combine[i] === 0 && i + 1 < children.length && combine[i + 1] === 1) {
                combinedChildren.push(children[i] + children[i + 1])
                i++
            } else {
                combinedChildren.push(children[i])
            }
        }

        children = combinedChildren
    }

    /**
     * Cleans and returns as a string
     */
    body += children.map(node => node.trim())
        .filter(node => node !== "")
        .join(" ")
        .replace(/ \./g, ".")//In case a child would start with "."
        .replace(/ ,/g, ",")//In case a child would start with ","

    if (body === "") {
        return null
    } else {
        return {
            style,
            body
        }
    }
}