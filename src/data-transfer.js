import commandLineArgs from "command-line-args"
import getUsage from "command-line-usage"

//Example: node lib/data-transfer -p Journal\ 2017.docx -e

export const EXPORT_OR_IMPORT_ERROR = "One must choose either export (-e: .docx -> .json) or import (-i: .json -> diary's API)"
export const NO_EXPORT_PATH_PROVIDED_ERROR = "A file path must be provided (*.docx) in order to export data"
export const WRONG_EXPORT_EXTENSION_ERROR = "When exporting data, the extension of the file must be .docx"
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
        description: "File path for export (.docx) or import (.json)",
        alias: "p",
        type: String
    },
    {
        name: "export",
        description: "Export mode: .docx -> .json",
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
        if (substr.length <= 1 || substr[substr.length - 1] !== "docx") {
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
    
    if (options.help) {
        console.log(usage)
    }
    //console.log(options)

    return true
}

/*
const options = commandLineArgs(optionDefinitions)
transferData(options)
*/