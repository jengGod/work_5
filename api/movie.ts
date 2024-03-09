import express from "express";
import { conn, queryAsync } from "../dbconnect"
import { mvReq } from "./model/movie_post_req";
import mysql from "mysql";

export const router = express.Router();
router.get("/", (req, res) => {

    const sql = "select * from Movie "
    conn.query(sql, (err, result) => {
        res.json(result);
    });
});
//select movie all by id
router.get("/:id", (req, res) => {
    const id = req.params.id;
    const sql = "select * from Movie where movie_id =?"
    conn.query(sql, [id], (err, result) => {
        res.json(result);
    });
});

//insert movie
router.post("/insertmovie", (req, res) => {
    const mv: mvReq = req.body;
    console.log(mv);
    //  res.status(201);
    let sql =
        "INSERT INTO Movie (movie_name,movie_picture,movie_rating,movie_vdo,movie_detail,movie_time) VALUES (?,?,?,?,?,?)";
    sql = mysql.format(sql, [

        mv.movie_name,
        mv.movie_picture,
        mv.movie_rating,
        mv.movie_vdo,
        mv.movie_detail,
        mv.movie_time


    ]);
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json({
            affected_row: result.affectedRows,
            last_idx: result.insertId
        });
    });
});


//delete mv
router.delete("/mvdelete/:id", (req, res) => {
    const id = +req.params.id;
    let sql = 'Delete from Movie where movie_id = ?';
    conn.query(sql, [id], (err, result) => {
        res.status(200).json({
            affected_row: result.affectedRows
        });
    });
});

//update dinamic
router.put("/updatemv/:id", async (req, res) => {
    let id = +req.params.id;
    let mv: mvReq = req.body;
    let userOriginal: mvReq | undefined;

    let sql = mysql.format("select * from Movie where movie_id = ?", [id]);

    let result = await queryAsync(sql);
    const rawData = JSON.parse(JSON.stringify(result));
    console.log(rawData);
    userOriginal = rawData[0] as mvReq;
    console.log(userOriginal);

    let updatemovie = { ...userOriginal, ...mv };
    console.log(mv);
    console.log(updatemovie);

    sql =
        "update  `Movie` set `movie_name`=?, `movie_picture`=?, `movie_rating`=?,`movie_vdo`=?,`movie_detail`=?,`movie_time`=? where `movie_id`=?";
    sql = mysql.format(sql, [
        updatemovie.movie_name,
        updatemovie.movie_picture,
        updatemovie.movie_rating,
        updatemovie.movie_vdo,
        updatemovie.movie_detail,
        updatemovie.movie_time,
        id,
    ]);
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json({ affected_row: result.affectedRows });
    });
});

//ค้นหา ชื่อ หนัง
router.get("/search/fields", (req, res) => {
    if (req.query) {
        const id = req.query.id;
        const name = req.query.name;

        //Movie
        //Star
        //Creators
        // ปรับแต่งคิวรี่ SQL
        let sql = `
        SELECT
    m.movie_id,
    m.movie_name,
    m.movie_picture,
    m.movie_rating,
    m.movie_vdo,
    m.movie_detail,
    m.movie_time,
    GROUP_CONCAT(DISTINCT CONCAT_WS(' ', p.person_id, p.person_name, ' (', s.role, ')') ORDER BY s.star_id ASC SEPARATOR ', ') AS stars,
    GROUP_CONCAT(DISTINCT CONCAT_WS(' ', cp.person_id, cp.person_name, ' (', c.type, ')') ORDER BY c.creator_id ASC SEPARATOR ', ') AS creators
    FROM Movie m
    INNER JOIN Star s ON m.movie_id = s.movie_id
    INNER JOIN Person p ON s.person_id = p.person_id
    INNER JOIN Creators c ON m.movie_id = c.movie_id
    INNER JOIN Person cp ON c.person_id = cp.person_id
    WHERE m.movie_name LIKE '%${name}%'
    GROUP BY m.movie_id
      `;

        conn.query(sql, [id, "%" + name + "%"], (err, result) => {
            if (err) {

                console.error(err);
                res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูลภาพยนตร์");
            } else {
                res.json(result);
            }
        });
    } else {
        res.send("ส่งข้อมูลบางอย่างเพื่อค้นหาภาพยนตร์");
    }
});

router.get("/join", (req, res) => {

    const sql = "SELECT * FROM Movie JOIN Star ON Movie.movie_id = Star.movie_id  "
    conn.query(sql, (err, result) => {
        res.json(result);
    });
});


