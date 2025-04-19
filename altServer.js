const express = require("express");

const moduleToFetch = require("./altIndex");
const getDatabase = moduleToFetch.getDatabase;
const getNotionPageContent = moduleToFetch.getNotionPageContent;

const port = 8400;
const app = express();
app.use(express.json());

// Global variable to store the fetched database
let cachedDatabase = null;

// Middleware to fetch and cache the database on any GET request
app.use(async (req, res, next) => {
    const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "https://personaldatafrontend.vercel.app", "https://careerinfo.vercel.app"];
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
    res.redirect("/careeradjacent");
    // res.end();
});

function filtersApplied(thePages) {
    return thePages.filter((page) => page.Source === "Career" && page.Tags.length === 3);
}

app.get("/careeradjacent", (req, res) => {
    if (!cachedDatabase) {
        return res.status(500).json({ error: "Database not yet loaded." });
    }
    try {
        const careerPages = cachedDatabase.filter((page) => page.Tags.includes("Career adjacent work"));
        res.json(careerPages);
    } catch (error) {
        console.error("Error filtering career adjacent pages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
 
app.get("/potentialresources", (req, res) => {
    if (!cachedDatabase) {
        return res.status(500).json({ error: "Database not yet loaded." });
    }
    const bonnieOptions = [
        "(LinkedIn) Bonnie Dilber",
        "(LinkedIn) Bonnie Dilber comments"
    ];
    try {
        const careerPages = cachedDatabase.filter((page) =>
            bonnieOptions.some((interviewTag) => page.Tags.includes(interviewTag))
        );
        res.json(careerPages);
    } catch (error) {
        console.error("Error filtering bonnie pages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/cstools", (req, res) => {
    if (!cachedDatabase) {
        return res.status(500).json({ error: "Database not yet loaded." });
    }
    try {
        const careerPages = cachedDatabase.filter((page) => page.Tags.includes("(LinkedIn) Mike Peditto"));
        res.json(careerPages);
    } catch (error) {
        console.error("Error filtering mikepeditto pages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/reactjs", (req, res) => {
    if (!cachedDatabase) {
        return res.status(500).json({ error: "Database not yet loaded." });
    }
    const interviewOptions = [
        "job interviews",
        "interview questions",
        "Job Search Prep: Job interviews: tricks and traps",
        "Job Search Prep: job interviews: tips",
        "Job questions [FAQ]",
        "asking good questions"
    ];
    try {
        const careerPages = cachedDatabase.filter((page) =>
            interviewOptions.some((interviewTag) => page.Tags.includes(interviewTag))
        );
        res.json(careerPages);
    } catch (error) {
        console.error("Error filtering interview pages:", error);
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

app.get("/interviewpagecontent", (req, res) => {
    if (!cachedDatabase) {
        return res.status(500).json({ error: "Database not yet loaded." });
    }
    const interviewOptions = [
        "job interviews",
        "interview questions",
        "Job Search Prep: Job interviews: tricks and traps",
        "Job Search Prep: job interviews: tips",
        "Job questions [FAQ]",
        "asking good questions",
    ];
    try {
        const careerPages = cachedDatabase.filter((page) =>
            interviewOptions.some((interviewTag) => page.Tags.includes(interviewTag))
        );
        res.json(careerPages);
    } catch (error) {
        console.error("Error filtering interview page content:", error);
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