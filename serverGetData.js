  // Note: because this is a SERVER, after making changes to this file,
//       one must RESTART the task to see the changes

// Optimization opportunity: refactor code base to query the database
// only once and read through the local data each time a new page 
// is added
const express = require("express");

// Following line is where NodeJS server is coupled to the HTML
const moduleToFetch = require("./index");
const getDatabase = moduleToFetch.getDatabase;
// const queryBySource = moduleToFetch.queryDBBySourcePagination;
const queryDBBySourcePagination = moduleToFetch.queryDBBySourcePagination;
// const newEntryToDatabase = moduleToFetch.newEntryToDatabase;


const resCalModule = require("./indexResCal");
const getResCal = resCalModule.getResCal;

const foodTableModule = require("./indexNutrition");
const getFoodBrands = foodTableModule.getFoodBrands;

const jsonTestModule = require("./indexJSONExport");
const testObjInJSON = jsonTestModule.testObjInJSON;


const port = 8000;

const app = express();

// CHQ: already declared earlier
// const express = require("express");
// const app = express();
// Set middleware of CORS
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://react-api-use-test-2.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );
  //   res.setHeader(
  //   "Access-Control-Allow-Origin",
  //   *  
  // ); // resulted in "unexpected token"
  // res.setHeader(
  //   "Access-Control-Allow-Methods",
  //   "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  // );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
});

app.get("/", async (req, res) => {
  res.redirect("/pages");
  res.end();
});

app.get("/users", async (req, res) => {
  res.redirect("/pages");
  res.end();
});

// CHQ: Reads all data entries from the database (Read)
app.get("/pages", async (req, res) => {
  const pages = await getDatabase();
  res.json(pages);
});

app.get("/querytest2", async(req, res) => {
  const pages2 = await getResCal();
  res.json(pages2);
});

app.get("/foodtable", async(req, res) => {
  const foodPages = await getFoodBrands();
  res.json(foodPages);
});




app.get("/queryBySource", async (req, res) => {
  // const pagesWithSource = await queryDBBySourcePagination();

  const pagesWithSource = await queryDBBySourcePagination()
    .then(results => {
    console.log('Notion database query results:', results); 
  });
  res.json(pagesWithSource);
});



app.get("/jsontest", async (req, res) => {
  //  function replacer(key, value) {
  //   // Filtering out properties
  //   if (typeof value === "string") {
  //     return undefined;
  //   }
  //   return value;
  // }
  const testingJSON = await testObjInJSON()
    .then(results => {
    console.log('JSON object filtering results:', results); 
    // console.log('JSON object filtering results:', JSON.stringify(testingJSON, replacer)); 
  });
  res.json(testingJSON);
  // JSON.stringify(testingJSON, replacer)
});

app.listen(port, console.log(`Server started on ${port}`));
