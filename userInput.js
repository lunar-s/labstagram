const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
const filters = ["greyscale", "sepia"];

function userInput(pathProcessed) {
  return new Promise((res, rej) => {
    console.log("Please choose a filter: ");
    for (let f in filters) {
      console.log(
        `${parseInt(f) + 1}. ${
          filters[f].charAt(0).toUpperCase() + filters[f].slice(1)
        }`
      );
    }
    readline.question("Enter number: ", (choice) => {
      readline.close();
      res(choice, pathProcessed);
    });
  });
}

module.exports = { userInput };
