const express =require('express')
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user:'sakkarin',
    host: 'localhost',
    password: 'sakkarin2543',
    database: 'employeeSystem',

});

app.post('/create',(req, res) => {
    console.log(req.body);
    const name = req.body.name;
    const age = req.body.age;
    const country = req.body.country;
    const position = req.body.position;
    const wage = req.body.wage;

    db.query('INSERT INTO employees (name, age, country, position, wage) VALUES (?,?,?,?,?)',
    [name,age,country,position,wage],
    (err,result)=> {
        if(err){
            console.log(err);
        }else{
            res.send("Value Inserted");
        }
    })
    
})
app.listen(3001, ()=> {
    console.log('Yeah your server is running on port 3001');
});

