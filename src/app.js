const express = require('express')
const Userrouter = require("./route/user.router.js")
const Eventrouter = require("./route/event.router.js")
const Adminrouter = require("./route/admin.router.js")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Apply JSON body parser middleware only to specific routes that need it
app.use('/api/json', express.json());
app.use(express.json());
app.use(cors());
app.use(cookieParser())
// // Increase the file size limit
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Use the routes

app.use("/api/v1/user", Userrouter);
app.use("/api/v1/event", Eventrouter);
app.use("/api/v1/admin", Adminrouter);


module.exports = app