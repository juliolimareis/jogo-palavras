const fs = require("fs");

const FILE_DIR = "dictionary-en.txt";
const FILE_RESULT = "game/dictionary-en.json";

const array = fs.readFileSync(FILE_DIR).toString().split("\n");

fs.writeFileSync(FILE_RESULT, JSON.stringify(array), "utf8");
