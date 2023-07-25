const express = require("express");
const app = express();
const cors = require("cors");
const dbConnection = require("./database");
const port = 3001;

app.use(cors());
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/select", (req, res) => {
  dbConnection
    .execute("SELECT * FROM folder")
    .then(([results]) => {
      if (results.length > 0) {
        console.log(results);
        res.json(results);
      } else {
        res.json({ status: "Error", msg: "ไม่พบข้อมูล" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/filesinsert", (req, res) => {
  const { files, parcelCode } = req.body;
  var insertValue = [];
  var insertSQL = "INSERT INTO file (parcel_code,type,path,note) ";
  if (files?.length > 0) {
    files.forEach((element, index) => {
      if (index === 0) {
        insertSQL += "VALUES(?,?,?,?)";
      } else {
        insertSQL += ",(?,?,?,?)";
      }
      insertValue.push(parcelCode, element.type, "path", element.note);
    });
    console.log(insertValue);
    console.log(insertSQL);
    dbConnection
      .execute(insertSQL, insertValue)
      .then((results) => {
        res.json({ status: "OK", parcelCode, results });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.json({ status: "Error", msg: "ไม่พบไฟล์ที่ส่งมา" });
  }
});

app.post("/search", (req, res) => {
  const { parcelCodeSearch } = req.body;
  if (parcelCodeSearch !== undefined) {
    dbConnection
      .execute("SELECT * FROM `file` WHERE `parcel_Code` = ?", [
        parcelCodeSearch,
      ])
      .then(([data]) => {
        // console.log(data)
        res.json({ status: "OK", data: data });
      })
      .catch((err) => {
        res.json({ status: "Error", msg: "ดำเนินการดึงข้อมูลไม่สำเร็จ" });
      });
  } else {
    res.json({
      status: "error",
      msg: "ไม่พบ Survey ID",
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
