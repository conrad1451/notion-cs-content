require("dotenv").config();
const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.FOODTABLE_PERSON_KEY });
const databaseId = process.env.NOTION_FOODTABLE_PERSONAL_DATABASE;

exports.getFoodBrands = async function () {
  const response = await notion.databases.query({ database_id: databaseId });

  const responseResults = response.results.map((page) => {
    return {
      id: page.id,
      name: page.properties.Name.title[0]?.plain_text,

      // createdStartTime: page.properties["Created"]?.date.start, 
      // createdEndTime: page.properties["Created"]?.date.end, 
      
      // publishedStartTime: page.properties["Published"]?.date.start, 
      // publishedEndTime: page.properties["Published"]?.date.end, 
      
      // pageCreationTime: page.properties["Created time"]?.created_time, 

      nutritionFat: page.properties["Fat (g)"]?.number,
      nutritionSatFat: page.properties["Sat Fat (g)"]?.number,
      nutritionFiberFat: page.properties["Fiber (g)"]?.number,
      nutritionSugar: page.properties["Sugar (g)"]?.number,
      nutritionSodium: page.properties["Sodium (mg)"]?.number,
      nutritionProtein: page.properties["Protein (g)"]?.number,
      nutritionIron: page.properties["Iron DV%"]?.number,
      nutritionCalcium: page.properties["Calcium DV%"]?.number,
      nutritionCarbs: page.properties["Total Carbs (g)"]?.number,
      nutritionUnitCount: page.properties["Unit Count"]?.number, 
      nutritionVitaminC: page.properties["Vitamin C DV%"]?.number,
      nutritionVitaminD: page.properties["Vitamin D DV%"]?.number,
      nutritionMagnesium: page.properties["Magnesium DV%"]?.number,
      nutritionZinc: page.properties["Zinc DV%"]?.number,
       
      source: page.properties["Source"].multi_select.map((foodgroup) => foodgroup.name), 

      // servingSize: page.properties.["Serving size"].title[0]?.plain_text,

      // ingredients: page.properties.["Ingredients"].title[0]?.plain_text,

      // sourceLink: page.properties["Link (If Applicable)"]?.url, 
      // sourceConnection: page.properties["Connection"]?.url, 
      
      // area: page.properties["Area"]?.select.name,  
 
      foodGroups: page.properties["Food groups"].multi_select.map((foodgroup) => foodgroup.name), 
      tags: page.properties["Tags"].multi_select.map((tag) => tag.name), 
      // CHQ: unsure why the following lines did not work. Will debug later
      // link: page.properties["Link"].url,
      // created: page.properties.Created.date, 
      // broski: page.properties.Tags.multi_select.map((tag) => tag.name), // CHQ: confirmed I can name properties however I want like so
      // createdStartDate: page.properties.Created.date.start,
      // createdEndDate: page.properties.Created.date.end,
    };
  });

  return responseResults;
};
 
  
