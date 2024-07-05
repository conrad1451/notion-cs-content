# NotionAPI JavaScript SDK Example

This project showcases one of the many possibilities of NotionAPI.

Here I created an Express server and connected to a database on Notion via the Notion API.

The end result is a web page that displays information from our Notion database and also allows users to create new records.

## Requirements

* [Node.js](http://nodejs.org/)
* A [Notion](https://www.notion.so/) account

## Running the app

If you would like to run this project, you'll need to create a `.env` file in the root directory

In this file you should add your Notion API key and your Database ID like so:

```bash
NOTION_API_KEY = [Here you should insert your key]
NOTION_API_DATABASE = [Here you should insert your key]
```

If you don't know how to get your key, go to [developers.notion.com](https://developers.notion.com/), press _My Integrations_, choose _New Integration_ and once you fill all the info, you should get an `Internal Integration Token`.

If you don't know how to get your Database id, check the **Where can I find my database's ID?** section of this [NotionAPI doc](https://developers.notion.com/docs/working-with-databases)

## See it in action!

https://user-images.githubusercontent.com/30603437/124970496-e2e1f800-e01f-11eb-9055-a93a25d8689a.mp4

## License

SitePoint's code archives and code examples are licensed under the MIT license.

Copyright © 2021 SitePoint

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
