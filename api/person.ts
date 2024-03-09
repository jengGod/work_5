import express from "express";
import {conn, queryAsync }  from "../dbconnect"
import { mvReq } from "./model/movie_post_req";
import mysql from "mysql";
import { personReq } from "./model/person_post_req";

export const router = express.Router();

// router.get('/', (req, res)=>{
//     res.send('Get in person.ts');
// });

//select person all 
router.get("/", (req, res) => {
   
    const sql ="select * from Person "
    conn.query(sql,(err,result)=>{
        res.json(result);
    });
  });
//select person all by id
router.get("/:id", (req, res) => {
    const id =req.params.id;
    const sql ="select * from Person where person_id =?"
    conn.query(sql,[id],(err,result)=>{
        res.json(result);
    });
  });

  //insert person
router.post("/insertperson", (req, res) => {
    const person:  personReq= req.body;
    console.log(person);
    //  res.status(201);
    let sql =
        "INSERT INTO Person (person_name,person_picture,person_age,person_info) VALUES (?,?,?,?)";
    sql = mysql.format(sql, [

        person.person_name,
        person.person_picture,
        person.person_age,
        person.person_info
      


    ]);
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json({
            affected_row: result.affectedRows,
            last_idx: result.insertId
        });
    });
});


//delete person
router.delete("/persondelete/:id", (req, res) => {
    const id = +req.params.id;
    let sql = 'Delete from Person where person_id = ?';
    conn.query(sql, [id], (err, result) => {
        res.status(200).json({
            affected_row: result.affectedRows
        });
    });
});

//update dinamic
router.put("/updateperson/:id", async (req, res) => {
    let id = +req.params.id;
    let person: personReq = req.body;
    let userOriginal: personReq | undefined;
  
    let sql = mysql.format("select * from Person where person_id = ?", [id]);
  
    let result = await queryAsync(sql);
    const rawData = JSON.parse(JSON.stringify(result));
    console.log(rawData);
    userOriginal = rawData[0] as personReq;
    console.log( userOriginal);
  
    let updateperson = {... userOriginal, ...person};
    console.log(person);
    console.log(updateperson);
  
      sql =
      "update  `Person` set `person_name`=?, `person_picture`=?, `person_age`=?,`person_info`=? where `person_id`=?";
      sql = mysql.format(sql, [
        updateperson.person_name,
        updateperson.person_picture,
        updateperson.person_age,
        updateperson.person_info,
          id,
      ]);
      conn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json({ affected_row: result.affectedRows });
      });
  });