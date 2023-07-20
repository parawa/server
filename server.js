const express = require("express");
const app = express();
const cors = require("cors");
const dbConnection = require("./database");
const port = 3001;

function verifyToken(req, res, next) {
  if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1]
      // console.log(token)
      if (!token) {
          // console.log('ไม่มีโทเค่นส่งมาด้วย')
          return res.json({ status: 'Error', msg: 'ไม่มีโทเค่นส่งมาด้วย' })
      }
      jwt.verify(token, secret, (err, decoded) => {
          if (err) {
              // console.log('โทเค่นไม่ถูกต้อง')
              return res.json({ status: 'Error', msg: 'โทเค่นไม่ถูกต้อง' })
          }
          req.decoded = decoded;
          next()
      })
  } else {
      // console.log('ไม่มีโทเค่นส่งมาด้วย')
      res.json({ status: 'Error', msg: 'ไม่มีโทเค่นส่งมาด้วย' })
  }
}

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

app.post('/search', verifyToken, (req, res) =>{
  const { parcelCode } = req.body;
  if (parcelCode){
    dbConnection.execute("SELECT * FROM `e_property_folder` WHERE `parcel_Code` = ?",[parcelCode])
    .then(([data]) => {
      // console.log(data)
      res.json({ data: data })
  }).catch((err) => {
      res.json({ status: 'Error', msg: 'ดำเนินการดึงข้อมูลไม่สำเร็จ' })
  })
  } else {
    res.json({
        status: 'error',
        msg: 'ไม่พบ Survey ID'
    })
}
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
