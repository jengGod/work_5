import express from "express";
import {conn, queryAsync }  from "../dbconnect"
import { creatorReq } from "./model/person_post_req";
import mysql from "mysql";

export const router = express.Router();

router.get("/", (req, res) => {
   
    const sql ="select * from Creators "
    conn.query(sql,(err,result)=>{
        res.json(result);
    });
  });
  //select star all by id
  router.get("/:id", (req, res) => {
      const id =req.params.id;
      const sql ="select * from Creators where creator_id =?"
      conn.query(sql,[id],(err,result)=>{
          res.json(result);
      });
    });

       
  //insert creators
router.post("/insertcreator", (req, res) => {
    const cast:  creatorReq= req.body;
    console.log(cast);
    //  res.status(201);
    let sql =
        "INSERT INTO Creators (movie_id,person_id,type) VALUES (?,?,?)";
    sql = mysql.format(sql, [

        cast.movie_id,
        cast.person_id,
        cast.type
       
    ]);
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json({
            affected_row: result.affectedRows,
            last_idx: result.insertId
        });
    });
});

//delete creator
router.delete("/creatordelete/:id", async (req, res) => {
    const id = +req.params.id;

    let sqlDeletecreator = "DELETE FROM Creators WHERE person_id = ?";
    conn.query(sqlDeletecreator, [id], (err, resultDeleteCreator) => {
        if (err) throw err;

        // เมื่อลบข้อมูลในตาราง "Creators" เสร็จสิ้น จึงทำการลบข้อมูลในตาราง "Person"
        let sqlDeletePerson = "DELETE FROM Person WHERE person_id = ?";
        conn.query(sqlDeletePerson, [id], (err, resultDeletePerson) => {
            if (err) throw err;

            res.status(201).json({
                deleted_star: resultDeleteCreator.affectedRows,
                deleted_person: resultDeletePerson.affectedRows
            });
        });
    });
});


//update dinamic
router.put("/updatecreator/:id", async (req, res) => {
    let id = +req.params.id;
    let creator: creatorReq = req.body;
    let creatorOriginal: creatorReq | undefined;
  
    let sql = mysql.format("select * from Creators where creator_id = ?", [id]);
  
    let result = await queryAsync(sql);
    const rawData = JSON.parse(JSON.stringify(result));
    console.log(rawData);
    creatorOriginal = rawData[0] as creatorReq;
    console.log( creatorOriginal);
  
    let updatcreator = {... creatorOriginal, ...creator};
    console.log(creator);
    console.log(updatcreator);
  
      sql =
      "update  `Creators set `movie_id`=?, `person_id`=?, `type`=? where `creator_id`=?";
      sql = mysql.format(sql, [
        updatcreator.movie_id,
        updatcreator.person_id,
        updatcreator.type,
          id,
      ]);
      conn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json({ affected_row: result.affectedRows });
      });
  });