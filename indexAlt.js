const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.RESCAL_PERSON_KEY });

(async () => {
  const databaseId = process.env.NOTION_RESCAL_PERSONAL_DATABASE;
  const response = await notion.databases.query({
    database_id: databaseId,
    
body: {

  filter: {

    "title": {

      "contains": "Search Term" 

    }

  }

},
  });
  console.log(response);
})();
