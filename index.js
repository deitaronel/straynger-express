import express from "express";
import bodyParser from "body-parser";
import env from "dotenv";
import pg from "pg";

const app = express();
const port = 3000;
env.config();


const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT
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
})
  
app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})