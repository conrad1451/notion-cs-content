require("dotenv").config();
const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.RESCAL_PERSON_KEY });
const databaseId = process.env.NOTION_RESCAL_CSLEARN_DATABASE;

// const notion2 = new Client({ auth: process.env.NOTION_GAME_PERSON_KEY });
// const databaseId2 = process.env.NOTION_BSS_GAME_PERSONAL_DATABASE;

// CHQ: Gemini helepd with the optional chaining in the ase that these fields 
// were blank in a page -saving 1-1.5 hours of debugging

exports.getNotionPageContent = async function (pageId) {
// async function getNotionPageContent(pageId) {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100, // Adjust page size as needed
    });

    let pageText = "";

    for (const block of response.results) {
      if (block.type === "paragraph" && block.paragraph.rich_text && block.paragraph.rich_text.length > 0) {
        for (const richText of block.paragraph.rich_text) {
          if (richText.plain_text) {
            pageText += richText.plain_text;
          }
        }
        pageText += " "; // Add space between paragraphs
      } else if (block.type === 'heading_1' && block.heading_1.rich_text && block.heading_1.rich_text.length >0){
          for(const richText of block.heading_1.rich_text){
              if(richText.plain_text){
                  pageText += richText.plain_text;
              }
          }
          pageText += " ";
      }
        else if (block.type === 'heading_2' && block.heading_2.rich_text && block.heading_2.rich_text.length >0){
          for(const richText of block.heading_2.rich_text){
              if(richText.plain_text){
                  pageText += richText.plain_text;
              }
          }
          pageText += " ";
      }
        else if (block.type === 'heading_3' && block.heading_3.rich_text && block.heading_3.rich_text.length >0){
          for(const richText of block.heading_3.rich_text){
              if(richText.plain_text){
                  pageText += richText.plain_text;
              }
          }
          pageText += " ";
      }
      else if (block.type === 'bulleted_list_item' && block.bulleted_list_item.rich_text && block.bulleted_list_item.rich_text.length >0){
        for(const richText of block.bulleted_list_item.rich_text){
            if(richText.plain_text){
                pageText += richText.plain_text;
            }
        }
        pageText += " ";
      }
      // Add more block types as needed (lists, headings, etc.)
    }

    return pageText.trim();
  } catch (error) {
    console.error("Error in getDatabase:", error);
    throw error; // Throw the error to the calling function
  }
}

// Example usage:
const pageUrl = "https://www.notion.so/9-red-flags-in-job-interviews-1c945c5d7d888056a4d2d003e74bd726";
const pageId = "1c945c5d7d888056a4d2d003e74bd726"; // Extract the page ID from the URL.

// getNotionPageContent(pageId).then((text) => {
//   if (text) {
//     console.log("Page Text:", text);
//   } else {
//     console.log("Could not retrieve page text.");
//   }
// });


// getNotionPageContent(databaseId).then((text) => {
//   if (text) {
//     console.log("Database Text:", text); // This will most likely return very little or nothing useful.
//   } else {
//     console.log("Could not retrieve database text.");
//   }
// });

exports.getDatabase = async function () {
    let allResults = [];
    let hasMore = true;
    let nextCursor = undefined; // Initialize nextCursor
  
    // CHQ: error handling suggested by Gemini AI
    try {
      console.log("lemme print!")
      while (hasMore) {
        const response = await notion.databases.query({
          database_id: databaseId,
          start_cursor: nextCursor, // Pass the cursor for subsequent requests
        });
    
        allResults = allResults.concat(response.results);
        hasMore = response.has_more;
        nextCursor = response.next_cursor;
      }

//       export default function getURL({
//         object
//     }) { 
//       let taginfo = object.properties.Tags["multi_select"];
    
//       return taginfo;
//     }
//       const urlInfo = object.properties["Link (If Applicable)"];
//       return urlInfo.url;
//   }
    
      const responseResults = allResults.map((page) => {
        return {
          id: page.id,
          Name: page.properties.Name?.title?.[0]?.plain_text ?? null,
          CreatedTime: page.properties["Created time"]?.created_time ?? null,
          EditedTime: page.properties["Last edited time"]?.last_edited_time ?? null,
          CreatedStart: page.properties.Created?.date?.start ?? null,
          CreatedEnd: page.properties.Created?.date?.end ?? null,
          PublishedStart: page.properties.Published?.date?.start ?? null,
          PublishedEnd: page.properties.Published?.date?.end ?? null,
          Source: page.properties.Source?.select?.name ?? null,
          Link: page.properties["Link (If Applicable)"]?.url ?? null,
          Area: page.properties.Area?.select?.name ?? null,
          Type: page.properties.Type?.select?.name ?? null,
          Tags: page.properties.Tags?.multi_select?.map((Tag) => Tag.name) ?? [], 
          PageURL: page.url ?? null,
        };
      });
    
      return responseResults;
    } catch (error) {
      console.error("Error in getDatabase:", error);
      throw error; // Throw the error to the calling function
      // return []; // Or throw the error, depending on your needs
    }
  };


  
exports.getPagesWithText = async function () {
    let allResults = [];
    let hasMore = true;
    let nextCursor = undefined; // Initialize nextCursor
  
    // CHQ: error handling suggested by Gemini AI
    try {
      console.log("pages with text!")
      while (hasMore) {
        const response = await notion.databases.query({
          database_id: databaseId,
          start_cursor: nextCursor, // Pass the cursor for subsequent requests
        });
    
        allResults = allResults.concat(response.results);
        hasMore = response.has_more;
        nextCursor = response.next_cursor;
      }

//       export default function getURL({
//         object
//     }) { 
//       let taginfo = object.properties.Tags["multi_select"];
    
//       return taginfo;
//     }
//       const urlInfo = object.properties["Link (If Applicable)"];
//       return urlInfo.url;
//   }
    
      const responseResults = allResults.map((page) => {
        return {
          id: page.id,
          Name: page.properties.Name?.title?.[0]?.plain_text ?? null,
          Source: page.properties.Source?.select?.name ?? null,
          Link: page.properties["Link (If Applicable)"].url ?? null,
          Area: page.properties.Area?.select?.name ?? null,
          Type: page.properties.Type?.select?.name ?? null,
          Tags: page.properties.Tags?.multi_select?.map((Tag) => Tag.name) ?? [], 
          PageURL: page.url ?? null,
          pageText: "test text",
          // pageText: getNotionPageContent(page.id) ?? null,
        };
      });
    
      return responseResults;
    } catch (error) {
      console.error("Error in getDatabase:", error);
      throw error; // Throw the error to the calling function
      // return []; // Or throw the error, depending on your needs
    }
  };

// exports.postNewEntry = async function (formData) {
//   try {
//     const response = await notion2.pages.create({
//       parent: {
//         database_id: databaseId2,
//       },
//       properties: {
//         myName: {
//           // title: [{ text: { content: "testmenow" } }], // Use formData.name or an empty string
//           title: [{ text: { content: formData.myName || "" } }], // Use formData.name or an empty string
//         }
//       },
//     });
//     return response;
//   } catch (error) {
//     console.error("Error in postNewEntry:", error);
//     throw error;
//   }
// };

exports.queryDBBySourcePagination = async function () {
  // const { databaseId, pageSize = 100 } = payload; 
  let hasMore = true;
  let nextCursor = null;
  let allResults = [];

  while (hasMore) {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Source',
        rich_text: {
          contains: 'LinkedIn'
        }
      },
      page_size: 2,
      start_cursor: nextCursor
    });

    allResults = allResults.concat(response.results); 
    hasMore = response.has_more;
    nextCursor = response.next_cursor;
  }

  return allResults;
}

exports.getPageById = function(cachedDatabase, pageId) {
  if (!cachedDatabase) {
    return null; // Or throw an error, depending on your error handling policy
  }

  const page = cachedDatabase.find(p => p.id === pageId);
  return page;
}

// Example route to get page content by ID
exports.getPageContent = async function (req, res) {
  const { pageId } = req.params;

  // 1. Check if the data is in the cache
  if (cachedDatabase[pageId]) {
    // 2.  If it's in the cache, return it immediately
    return res.status(200).json({ 
        message: "Data retrieved from cache",
        data: cachedDatabase[pageId]
    });
  }

  // 3. If it's not in the cache, fetch it from the database
  try {
    const db = await connectToDatabase();
    const collection = db.collection('pages'); // Adjust 'pages' to your actual collection name.  Type annotation removed.
    const page = await collection.findOne({ id: pageId }); // Assuming you're querying by id

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    // 4. Store the fetched data in the cache
    cachedDatabase[pageId] = page;

    // 5. Return the data
    return res.status(200).json({ 
        message: "Data retrieved from database",
        data: page
    });
  } catch (error) {
    console.error('Error fetching page content:', error);
    return res.status(500).json({ error: 'Failed to fetch page content' });
  }
};

// New endpoint to list properties of a cached element
exports.listCachedProperties = async function (req, res) {
     const { pageId } = req.params;

    if (!cachedDatabase[pageId]) {
        return res.status(404).json({ error: 'Page not found in cache' });
    }

    const page = cachedDatabase[pageId];
    const properties = Object.keys(page);

    return res.status(200).json({
        message: `Properties of page ${pageId} from cache:`,
        properties: properties
    });
};
