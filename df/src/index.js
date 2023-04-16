const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()
const config = require("./config/devKey")
const dialogflow = require("dialogflow")

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const project_id = config.project_id;

const credentials = {
    client_email : config.client_email,
    private_key: config.private_key

}

const sessionClient = new dialogflow.SessionsClient({project_id, credentials});


app.post("/chatbot/query", async function(req, res) {

    console.log(`project_id: ${project_id}`);

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
        console.log(responses)
        console.log('Detected intent');
        res.json({data: responses[0].queryResult.fulfillmentText, success: true});
    } catch (e) {
        console.log(e);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(3000, function(){
    console.log("localhost runnint at 3000")
})