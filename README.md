# diary-data-transfer
Scripts allowing to extract data from text files (.docx/.xml) and import them into `diary` app.

## Purpose
This script analyses a `.docx` (`.xml`) file where entries might be found thanks to styles (`MaDate`, `MonTitre`, `MonTweet`, `MonParagraphe`, `MaCitation`) and outputs a `.json` where entries are objects with `date`, `title` and `body`.

Then this scripts allows to import the `.json` file through the `diary`'s API.

```
file.xml –––––––––––————————––––– > file.json   –––––––––––————————––––– > API
                    |                                       |
                    file-extract-rejects.json               |
                                                            file-import-rejects.json
```

## Documentation
[Issue #1](https://github.com/mathieueveillard/diary-data-transfer/issues/1)


## Usage
Prepare `.xml` file: remove `<?mso-application progid="Word.Document"?>`

Build: `npm run build`

Help: `node lib/data-transfer -h`

Example (.xml -> .json): `node lib/data-transfer -p test.xml -e -y 2017`

Example (.json -> API): `node lib/data-transfer -p test.json -i`