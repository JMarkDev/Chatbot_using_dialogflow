const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const Database = require("./config/database");
require("dotenv/config");
const config = require("./config/devKey");
const dialogflow = require("dialogflow");
const PORT = process.env.PORT
const userRoute = require("./routes/User");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());;

app.use("/api/user", userRoute);

app.get('/', (req, res) => {
    res.send("API is Running....");
});


const project_id = config.project_id;

const credentials = {
    client_email : config.client_email,
    private_key: config.private_key

}

const sessionClient = new dialogflow.SessionsClient({project_id, credentials});


app.post("/chatbot/query", async function(req, res) {

    const {user_query} = req.body
    // console.log(user_query)

    const sessionPath = sessionClient.sessionPath(project_id, "user_session");

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: user_query,
                // The language used by the client (en-US)
                languageCode: 'en-US',
            },
        },
    };

    try {
        const responses = await sessionClient.detectIntent(request);
        res.json({data: responses[0].queryResult.fulfillmentText, success: true});
    } catch (e) {
        res.status(500).send('Internal Server Error');
    }
});


app.listen(PORT, function(){
    const db = new Database();
    db.TestConnection();
    console.log(`localhost running at ${PORT}`)
})