import express from "express";
import http from "http";
import https from "https";
import bodyParser from "body-parser";
import env from "dotenv";
import pg from "pg";
import fs from "fs";

const certificate = fs.readFileSync("/etc/letsencrypt/live/straynger.org-0001/fullchain.pem");
const privateKey = fs.readFileSync("/etc/letsencrypt/live/straynger.org-0001/privkey.pem");
const credentials = { key: privateKey, cert: certificate };

const app = express();
const httpPort = 3000;
const httpsPort = 3001;
env.config();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

  // Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/users", async (req, res) => {
    try{
      const users = await db.query("SELECT * from users");
      if(users.rows.length > 0){
        res.status(200).json(users);
      }else{
        res.status(404).json({message: "No Users Found"});
      }
    }catch(err){
      console.log(err)
    }
});
  
app.get("/", (req, res) => {
    res.send("Hello World!")
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

app.listen(httpPort, () => {
  console.log(`Http server is running on port ${httpPort}`);
});

app.listen(httpsPort, () => {
  console.log(`Https server is running on port ${httpsPort}`);
});