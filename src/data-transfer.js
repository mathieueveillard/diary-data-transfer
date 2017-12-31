import commandLineArgs from "command-line-args"
import getUsage from "command-line-usage"
import {exportToJSON} from "./exportToJSON"
import {importFromJSONFile} from "./importFromJSON"

/**
 * Example:
 * node lib/data-transfer -p test.xml -e
 * node lib/data-transfer -p test.json -i
 */
export const EXPORT_OR_IMPORT_ERROR = "One must choose either to export (-e: .xml -> .json) or import (-i: .json -> diary's API) data"
export const NO_EXPORT_PATH_PROVIDED_ERROR = "A file path must be provided (*.xml) in order to export data"
export const WRONG_EXPORT_EXTENSION_ERROR = "When exporting data, the extension of the file must be .xml"
export const NO_IMPORT_PATH_PROVIDED_ERROR = "A file path must be provided (*.json) in order to import data"
export const WRONG_IMPORT_EXTENSION_ERROR = "When importing data, the extension of the file must be .json"

const optionDefinitions = [
    {
        name: "help",
        description: "Help",
        alias: "h",
        type: Boolean
    },
    {
        name: "path",
        description: "File path for export (.xml) or import (.json)",
        alias: "p",
        type: String
    },
    {
        name: "export",
        description: "Export mode: .xml -> .json",
        alias: "e",
        type: Boolean
    },
    {
        name: "import",
        description: "Import mode: .json -> diary's API",
        alias: "i",
        type: Boolean
    },
    {
        name: "year",
        description: "Year (default: current year)",
        alias: "y",
        type: Number,
        defaultOption: true,
        defaultValue: (new Date()).getFullYear()
    }
]

const sections = [
    {
        header: "Data transfer",
        content: "Data transfer script for the [italic]{diary} project"
    },
    {
        header: "Options",
        optionList: optionDefinitions
    }
]

const usage = getUsage(sections)

export const transferData = function(options) {

    if (options.help) {
        console.log(usage)
        return
    }

    if (!options.export && !options.import) {
        console.log(usage)
        throw Error(EXPORT_OR_IMPORT_ERROR)
    }

    if (options.export && options.import) {
        console.log(usage)
        throw Error(EXPORT_OR_IMPORT_ERROR)
    }

    if (options.export && options.path === undefined) {
        console.log(usage)
        throw Error(NO_EXPORT_PATH_PROVIDED_ERROR)
    }

    if (options.export && options.path) {
        const substr = options.path.split(".")
        if (substr.length <= 1 || substr[substr.length - 1] !== "xml") {
            console.log(usage)
            throw Error(WRONG_EXPORT_EXTENSION_ERROR)
        }
    }
    
    if (options.import && options.path === undefined) {
        console.log(usage)
        throw Error(NO_IMPORT_PATH_PROVIDED_ERROR)
    }

    if (options.import && options.path) {
        const substr = options.path.split(".")
        if (substr.length <= 1 || substr[substr.length - 1] !== "json") {
            console.log(usage)
            throw Error(WRONG_IMPORT_EXTENSION_ERROR)
        }
    }
    
    //Removes extension from file path
    let path = options.path.split(".")
    path.splice(path.length - 1, 1)
    path = path.join(".")

    if (options.export) {
        return exportToJSON(path + ".xml", options.year)
            .then(paragraphs => {
                const confirmation = `${paragraphs.length} entries have been found and saved in ${path}.json`
                console.log(confirmation)
                return confirmation
            })
    }

    if (options.import) {
        return importFromJSONFile(path + ".json")
            .then(result => {
                const confirmation = `${result.length} entries have been found and inserted`
                console.log(confirmation)
                return confirmation        
            })
    }
}
/*
const options = commandLineArgs(optionDefinitions)
transferData(options)*/