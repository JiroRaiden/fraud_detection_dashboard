import "dotenv/config";

import express from "express";

import transactionRoutes from "./routes/transactionRoutes.js";

const app = express();

app.use(express.json());

app.use("/transactions", transactionRoutes);

const PORT = 5000;

app.get("/health", (req,res)=>{
	res.json({status:"ok"});
});

app.post("/echo", (req,res)=>{
	res.json(req.body);
});

app.listen(PORT,()=>{
	console.log(`Server is running on http://localhost:${PORT}`);
});