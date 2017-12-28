# diary-data-transfer
Scripts allowing to extract data from text files (.docx/.xml) and import them into `diary` app.

## Usage
Help: `node lib/data-transfer -h`

Example (.xml -> .json): `node lib/data-transfer -p test.xml -e -y 2017`

Example (.json -> API): `node lib/data-transfer -p test.json -i`