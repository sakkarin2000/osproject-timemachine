const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");

app.use(cors());
app.use(express.json());

const thumbnailStorageEngine = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "/var/www/html/files_uploaded/thumbnails");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const videoStorageEngine = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "/var/www/html/files_uploaded/videos");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const thumbnailUpload = multer({ storage: thumbnailStorageEngine });
const videoUpload = multer({ storage: videoStorageEngine });

app.post("/uploadThumbnail", thumbnailUpload.single("image"), (req, res) => {
  console.log(req.file);
  res.send({ status: "single thumbnail upload success",path:req.file.path.substring(13)
 });
});

app.post("/uploadVideo", videoUpload.single("video"), (req, res) => {
  console.log(req.file);
  res.send({ status: "single video upload success",path:req.file.path.substring(13)
});
});

const db_old = mysql.createConnection({
  user: "sakkarin",
  host: "localhost",
  password: "sakkarin2543",
  database: "employeeSystem",
});

const db = mysql.createConnection({
  user: "sakkarin",
  host: "localhost",
  password: "sakkarin2543",
  database: "timeMachineSystem",
});

app.post("/create", (req, res) => {
  console.log(req.body);
  const name = req.body.name;
  const age = req.body.age;
  const country = req.body.country;
  const position = req.body.position;
  const wage = req.body.wage;

  db_old.query(
    "INSERT INTO employees (name, age, country, position, wage) VALUES (?,?,?,?,?)",
    [name, age, country, position, wage],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Value Inserted");
      }
    }
  );
});

app.post("/addVideo", (req, res) => {
  console.log(req.body);
  const videoName = req.body.videoName;
  const description = req.body.description;
  const thumbnailPath = req.body.thumbnailPath;
  const videoPath = req.body.videoPath;

  db.query(
    "INSERT INTO videos(videoName, publishDateTime, thumbnailPath, filePath, description, editDateTime) VALUES (?,CURRENT_TIMESTAMP,?,?,?,CURRENT_TIMESTAMP)",
    [videoName, thumbnailPath, videoPath, description],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Value Inserted");
      }
    }
  );
});

app.put('/update',(req,res) => {
  const id = req.body.id;
  const videoName = req.body.videoName;
  const description = req.body.description ;
  db.query("UPDATE videos SET description = ?, videoName = ?,editDateTime = CURRENT_TIMESTAMP WHERE id =?", [description, videoName, id], (err, result)=> {
    if(err){
      console.log(err);
    }else{
      console.log(res);
      res.send(result);
    }
  });
});
// UPDATE 
app.delete('/delete/:id',(req,res)=>{
  const id = req.params.id;
  db.query("DELETE FROM videos WHERE id = ?",id, (err,result)=>{
    if(err){
      console.log(err);
    }else{
      console.log(res);
      res.send(result);
    }
  });
});


app.get("/videos", (req, res) => {
  db.query("SELECT * FROM videos", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});


app.listen(3001, () => {
  console.log("Yeah your server is running on port 3001");
});

//INSERT INTO videos(videoName, publishDateTime, thumbnailPath, filePath, description, editDateTime) VALUES ('testname',CURRENT_TIMESTAMP,'testThmbPath','testFilePath','HelloDescribe',CURRENT_TIMESTAMP);
