const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.RESCAL_PERSON_KEY });

(async () => {
  const databaseId = process.env.NOTION_RESCAL_PERSONAL_DATABASE;
  const response = await notion.databases.query({
    database_id: databaseId,
    
    filter:{
      "and": [
        {
          "property": "Tags",
          "contains": "tutoring job"
        },
        {
          "or": [
            {
              "property": "Tags",
              "contains": "explanation of experience (justification)"
            },
            {
              "property": "Tags",
              "contains": "Job questions [FAQ]"
            }
          ]
        }
      ]
    } ,
  
    sorts: [
      {
        property: 'Created',
        direction: 'ascending',
      },
    ],
  });
  console.log(response);
})();
