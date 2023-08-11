const express = require('express')
const router = express.Router()
const cors = require('cors')
const dbConnection = require('../database')
const multer = require ('multer')
const fs = require('fs')

router.use(cors())
router.use(express.urlencoded({ extended: false, limit: '50mb' }))
router.use(express.json({ limit: '50mb' }))

const storage = multer.diskStorage({
 destination: function (req, file, cb) {
     cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        const files = req.files
        const currentDate = moment().format('DD-MM-YYYY_HH-mm-ss')
        cb(null, `Image_${currentDate}_${uuidv4()}`)
    },
})
const upload = multer({ storage })
router.post("/upload", upload.array("files"),async (req, res) =>{
 var path =[]
 const files = req.files
 var {parcelcode} =res.body
 const imagesId = []
 if(files.length > 0 && parcelcode){
    parcelcode = parcelcode.toUpperCase()
    parcelcode = parcelcode.replace(`/`,'-')
    parcelcode = parcelcode.replace(/\..+$/,'')

if(!fs.existsSync(`upload/land_imges/${parcelcode}`)){
    fs.mkdir(`upload/land_imges/${parcelcode}`,(err) =>{
        if(err) throw err;
    })
    
}
files?.forEach((file, index) => {
    const currentDate = moment().format('DD-MM-YYYY_HH-mm-ss')
    const fileName = `P${parcelcode}_DT${currentDate}.${file.mimetype.substring(file.mimetype.indexOf("/") + 1)}`

    fs.rename()
})

 }
})

