import express from 'express';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fetch from 'node-fetch';
import * as checker from './checker.js';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../../')));

const apiUrl = 'https://newsapi.org/v2/everything?q=';

app.post('/domain',async (req,res)=>{
    try{
        const mainUrl=req.body.Domain;  
        const url=new URL(mainUrl);
        const domain=url.host;
        if(!mainUrl){
            return res.status(400).json();
       }
       console.log("Searching about the domain");
       const record = await checker.domainReport(domain);
       res.json(record);
    }
    catch(err){
        console.log(`Error in reporting ${err.message}`);
    }
});
app.get('/news/:query', async (req, res) => {
    const query = req.params.query;
    const apiKey=process.env.News_key;
    try {
        const response = await fetch(`${apiUrl}${query}&apiKey=${apiKey}`);

        if (!response.ok) {
            throw new Error(`Network response was not ok (status: ${response.status})`);
        }

        const data = await response.json();
        res.json(data.articles);
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ error: "An error occurred while fetching news. Please try again later." });
    }
});
app.listen(port,()=>{
    console.log(`Server is running on ${port}`)
});

