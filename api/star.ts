import express from "express";
import {conn, queryAsync }  from "../dbconnect"
import { starReq } from "./model/person_post_req";
import mysql from "mysql";

export const router = express.Router();

router.get("/", (req, res) => {
   
    const sql ="select * from Star "
    conn.query(sql,(err,result)=>{
        res.json(result);
    });
  });
  //select star all by id
  router.get("/:id", (req, res) => {
      const id =req.params.id;
      const sql ="select * from Star where star_id =?"
      conn.query(sql,[id],(err,result)=>{
          res.json(result);
      });
    });

    
  //insert star
router.post("/insertstar", (req, res) => {
    const star:  starReq= req.body;
    console.log(star);
    //  res.status(201);
    let sql =
        "INSERT INTO Star (movie_id,person_id,role) VALUES (?,?,?)";
    sql = mysql.format(sql, [

        star.movie_id,
        star.person_id,
        star.role
       
    ]);
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json({
            affected_row: result.affectedRows,
            last_idx: result.insertId
        });
    });
});

//delete star
router.delete("/stardelete/:id", (req, res) => {
    const id = +req.params.id;
    let sql = `DELETE Star
    FROM Star
    INNER JOIN Person
    ON Star.person_id = Person.person_id
    WHERE Star.star_id = [star_id_to_delete];`;

    conn.query(sql, [id], (err, result) => {
        res.status(200).json({
            affected_row: result.affectedRows
        });
    });
});
// Delete movie endpoint
router.delete("/delete_person/:id", async (req, res) => {
    const id = +req.params.id;

    let sqlDeleteStar = "DELETE FROM Star WHERE person_id = ?";
    conn.query(sqlDeleteStar, [id], (err, resultDeleteStar) => {
        if (err) throw err;

        // เมื่อลบข้อมูลในตาราง "Star" เสร็จสิ้น จึงทำการลบข้อมูลในตาราง "Person"
        let sqlDeletePerson = "DELETE FROM Person WHERE person_id = ?";
        conn.query(sqlDeletePerson, [id], (err, resultDeletePerson) => {
            if (err) throw err;

            res.status(201).json({
                deleted_star: resultDeleteStar.affectedRows,
                deleted_person: resultDeletePerson.affectedRows
            });
        });
    });
});



//update dinamic
router.put("/updateperson/:id", async (req, res) => {
    let id = +req.params.id;
    let star: starReq = req.body;
    let starOriginal: starReq | undefined;
  
    let sql = mysql.format("select * from Person where person_id = ?", [id]);
  
    let result = await queryAsync(sql);
    const rawData = JSON.parse(JSON.stringify(result));
    console.log(rawData);
    starOriginal = rawData[0] as starReq;
    console.log( starOriginal);
  
    let updatestar = {... starOriginal, ...star};
    console.log(star);
    console.log(updatestar);
  
      sql =
      "update  `Star` set `movie_id`=?, `person_id`=?, `role`=? where `star_id`=?";
      sql = mysql.format(sql, [
        updatestar.movie_id,
        updatestar.person_id,
        updatestar.role,
      
          id,
      ]);
      conn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json({ affected_row: result.affectedRows });
      });
  });