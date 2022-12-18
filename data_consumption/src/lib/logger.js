const fs = require("fs/promises");
const path = require("path");

const logFile = path.resolve(__dirname, "../../log");

async function logToFile(logMessage) {
  try {
    fs.appendFile(logFile, `${getDateTime()} => ${logMessage}\n`);
  } catch (error) {
    console.log(error);
  }
}

function getDateTime() {
  return new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
}

exports.logToFile = logToFile;
