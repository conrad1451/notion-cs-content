// with extension of .js and export default myData, I got this error when deploying
// (node:68) Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.

// with mjs, got SyntaxError: Illegal return statement


const myData = [
  {
    text: "test1",
    value: 640,
  },
  {
    text: "test2",
    value: 20,
  },
  {
    text: "test3",
    value: 16,
  },
  {
    text: "test4",
    value: 170,
  },
  {
    text: "test5",
    value: 10,
  },
  {
    text: "test6",
    value: 540,
  },
  {
    text: "test7",
    value: 12,
  },
  {
    text: "test8",
    value: 777,
  },
  {
    text: "test9",
    value: 450,
  },
  {
    text: "test10",
    value: 19,
  }
];

// export default myData;

// return myData;

module.exports = myData;
