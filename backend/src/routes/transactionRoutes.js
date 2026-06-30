import express from "express";
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
	adapter,
});

const router = express.Router();

router.post("/", async (req, res)=>{
	const transaction = req.body;
	
	const requiredFields = ["userId",
				"amount",
				"timestamp",
				"location",
				"deviceId",
				"merchantName"
				];

	const missingField = requiredFields.find((field)=> !transaction[field]);

	if(missingField){
	return res.status(400).json({
				success: false,
			
				error:	{
					message: `${missingField} is required`,
					},
});
}


if(typeof transaction.userId!== "string" || transaction.userId.trim()===""){
return res.status(400).json({
success: false,
error:{
message: "userId must be a non-empty string",
},
});
}	
	
	if(typeof transaction.amount!=="number" || transaction.amount<=0){
	return res.status(400).json({
	success: false,
	error: {
	message: "The entered amount should be a number greater than 0",
	},	
});
}
	const parsedTimestamp = new Date(transaction.timestamp);
	if(Number.isNaN(parsedTimestamp.getTime())){
		return res.status(400).json({
			success: false,
			error: {
				message: "timestamp must be a valid date",
			},
		});
	}

	if(typeof transaction.location!== "string" || transaction.location.trim()===""){
		return res.status(400).json({
			success: false,
			error: {
				message: "location must be non-empty string",
			},
		});
	}

	if(typeof transaction.deviceId!== "string" || transaction.deviceId.trim()===""){
		return res.status(400).json({
		success: false,
		error: {
			message: "deviceId must be a non-empty string", 
		},	
		});
	}

	if(typeof transaction.merchantName!== "string" || transaction.merchantName.trim()===""){
	return res.status(400).json({
	success: false,
	error:{
	message: "merchantName must be a non-empty string",
	},
});
}
try{
	const savedTransaction = await prisma.transaction.create({
		data: {
			userId: transaction.userId,
			amount: transaction.amount,
			timestamp: parsedTimestamp,
			location: transaction.location,
			deviceId: transaction.deviceId,
			merchantName: transaction.merchantName,
		},
	});

	return res.status(201).json({
		success:true,
		message:"Transaction received",
		data: {
		transaction: savedTransaction,		
			},
		meta: {
		
			receivedAt: new Date().toISOString(),
		},
	});

}
catch(error){
	return res.status(500).json({
		success: false,
		error:{
			message: "Failed to save transaction",
		},
	});
}

});

export default router;

