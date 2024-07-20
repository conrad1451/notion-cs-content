// Optimization opportunity: refactor code base to query the database
// only once and read through the local data each time a new user
// is added
const express = require("express");

// Following line is where NodeJS server is coupled to the HTML
const moduleToFetch = require("./index");
const getDatabase = moduleToFetch.getDatabase;
// const newEntryToDatabase = moduleToFetch.newEntryToDatabase;
const port = 8000;

const app = express();


type WordFrequencies = {
  text: string;
  value: number;
};

interface Page {
  name: string;
  tags: string[];
}

const PageDataTransform = function (listOfPages: Page[]) {
  const theOtherTagList: Map<string, number> = new Map();

  const theThirdTagList: WordFrequencies[] = [];

  const theData: Page[] = listOfPages;

  for (let i = 0; i < theData.length; i++) {
    const curPage = theData[i];

    for (let j = 0; j < curPage.tags.length; j++) {
      const curTag = curPage.tags[j];
      if (theOtherTagList[curTag] === undefined) {
        theOtherTagList[curTag] = 1;
        theThirdTagList[curTag] = 1;
      } else {
        theOtherTagList[curTag] += 1;
        theThirdTagList[curTag] += 1;
      }
    }
  }
  // const lastData: Map<string, number> = JSON.parse(JSON.stringify(theOtherTagList));
  // setTagList(lastData);
  console.log(theThirdTagList);
  // setTagList(JSON.parse(JSON.stringify(theOtherTagList)));
  // setRealTagList(theThirdTagList);
  // return "yes";
  return theThirdTagList;
};

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
  res.redirect("/users");
  res.end();
});

// CHQ: Reads all data entries from the database (Read)
app.get("/users", async (req, res) => {
  const users = await getDatabase();
  res.json(users);
});


// CHQ: Reads all data entries from the database (Read)
app.get("/users-json", async (req, res) => {
  const response = await getDatabase();
  const userJSON = await response.json();
  const myData = await PageDataTransform(userJSON);
  
  res.json(myData);
});



app.listen(port, console.log(`Server started on ${port}`));
