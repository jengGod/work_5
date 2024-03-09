import express from "express";
//สร้าง เราเตอร์ขึ้นมา
export const router = express.Router();

router.get("/",(req,res)=>{
    res.send("Method Get in index.ts");
});

