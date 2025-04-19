const express = require("express");

const moduleToFetch = require("./altIndex");
const getDatabase = moduleToFetch.getDatabase;
const getNotionPageContent = moduleToFetch.getNotionPageContent;

const port = 8400;
const app = express();
app.use(express.json());

// Global variable to store the fetched database
let cachedDatabase = null;

https://notion-cs-content.onrender.com/

// Middleware to fetch and cache the database on any GET request
app.use(async (req, res, next) => {
    const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "https://cslearnings.vercel.app"];
    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
        );
        res.setHeader("Access-Control-Allow-Credentials", true);
        res.setHeader("Access-Control-Max-Age", 7200);
    }

    if (req.method === 'GET' && !cachedDatabase) {
        try {
            cachedDatabase = await getDatabase();
            console.log('Database fetched and cached.');
        } catch (error) {
            console.error("Error fetching initial database:", error);
            return res.status(500).json({ error: "Failed to fetch initial database" });
        }
    }
    next();
});

app.options("/submitformhere", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.sendStatus(204);
});

app.get("/", (req, res) => {
    res.redirect("/pages");
    // res.end();

    // if (!cachedDatabase) {
    //     return res.status(500).json({ error: "Database not yet loaded." });
    // }
    // try {
    //     const careerPages = cachedDatabase;
    //     res.json(careerPages);
    // } catch (error) {
    //     console.error("Error filtering career adjacent pages:", error);
    //     res.status(500).json({ error: "Internal server error" });
    // }
});

function filtersApplied(thePages) {
    return thePages.filter((page) => page.Source === "Career" && page.Tags.length === 3);
} 

app.get("/cstools", (req, res) => {
    if (!cachedDatabase) {
        return res.status(500).json({ error: "Database not yet loaded." });
    }
    try {
        const cstools = cachedDatabase.filter((page) => page.Tags.some((str) => typeof str === 'string' && str.includes("CS Tools")));
        // .includes("(LinkedIn) Mike Peditto"));
        res.json(cstools);
    } catch (error) {
        console.error("Error filtering cs tools pages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/reactjs", (req, res) => {
    if (!cachedDatabase) {
        return res.status(500).json({ error: "Database not yet loaded." });
    } 
    try {
        const reactjspages = cachedDatabase.filter((page) => page.Tags.some((str) => typeof str === 'string' && str.includes("ReactJS")));
        // .includes("(LinkedIn) Mike Peditto"));
        res.json(reactjspages);
    } catch (error) {
        console.error("Error filtering ReactJS pages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/onetag", (req, res) => {
    if (!cachedDatabase) {
        return res.status(500).json({ error: "Database not yet loaded." });
    } 
    try {
        const careerPages = cachedDatabase.filter((page) => page.Tags.length === 1);
        res.json(careerPages);
    } catch (error) {
        console.error("Error filtering interview pages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/potentialresources", (req, res) => {
    if (!cachedDatabase) {
        return res.status(500).json({ error: "Database not yet loaded." });
    } 
    try {
        const potentialResources = cachedDatabase.filter((page) => page.Tags.some((str) => typeof str === 'string' && str.includes("Potential Resource")));
        // .includes("(LinkedIn) Mike Peditto"));
        res.json(potentialResources);
    } catch (error) {
        console.error("Error filtering Potential Resource pages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// CHQ: Reads all data entries from the cached database
app.get("/pages", (req, res) => {
    if (!cachedDatabase) {
        return res.status(500).json({ error: "Database not yet loaded." });
    }
    try {
        res.json(cachedDatabase);
    } catch (error) {
        console.error("Error serving cached pages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/pagecontent/:pageId", (req, res) => {
    if (!cachedDatabase) {
        return res.status(500).json({ error: "Database not yet loaded." });
    }
    try {
        const { pageId } = req.params;
        // const { pageId } = req.params.pageId 
        // Assuming your database structure has a unique identifier for each page
        const page = cachedDatabase.find(p => p.id === pageId);  
        if (page && page.id) {
            res.json({ pageText: page.id });
        } else {
            if(page)
            {
                res.status(404).json({ error: `Page found but content could not be retrieved`});
            }
            else{
                res.status(404).json({ error: `Neither Page nor content could be retrieved`});
            }
        }
    } catch (error) {
        console.error("Error fetching page content from cached data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/testme/:pageId", (req, res) => {
    if (!cachedDatabase) {
        return res.status(500).json({ error: "Database not yet loaded." });
    }
    try {
        const { pageId } = req.params;
        const foundPage = cachedDatabase.find(p => p.id === pageId); //  Corrected way to find by ID

        if (foundPage) {
            res.json(foundPage); //  Return the found page
        } else {
            res.status(404).json({ error: "Page not found." });
        }
    } catch (error) {
        console.error("Error fetching page:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
 

// Endpoint to manually reset the cache
app.post('/admin/reset-cache', (req, res) => {
    cachedDatabase = null;
    console.log('Database cache has been reset.');
    res.json({ message: 'Database cache has been reset.' });
  });
 

app.listen(port, () => console.log(`Server started on ${port}`));
