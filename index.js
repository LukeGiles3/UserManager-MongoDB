const express = require('express')
const app = express()
const port = 3000
//configure the db connection
const mongoose = require('mongoose');
const dbConnectionString= 'mongodb://localhost/cohort10fr'; 
mongoose.connect(dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }); 
const db = mongoose.connection; //connecting to the Database
//Here is a mini sample on how to provide requirements for a student document
const studentSchema = new mongoose.Schema({
    // student_id:{type:String, default: uuidv4()},
    first_name: String,
    last_name: String,
    email: String,
    age: { type: Number, min: 18, max: 70 },
    createdDate: { type: Date, default: Date.now }
 });
//Use this student object to perform your CRUD operations. See app.get()
const student = mongoose.model('Students', studentSchema);

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

app.get('/getStudent', (req, res) => {
    student.find({}, (err, data) => {
        let result = JSON.stringify(data)
        res.send(result)
    })
})

app.post('/updateStudentAge', (req, res) => {
    let newAge = req.body.age
    let searchFirstName = req.body.first_name 

    student.findOneAndUpdate( {first_name: searchFirstName}, {age: newAge}, { new: true }, //return the updated version instead of the pre-updated document
        (err, data) => {
            res.send(`${data}`)
    });
    
    // res.send('updated!')
})

app.post('/deleteStudent', (req, res) => {
    let findToDelete = req.body.first_name
    student.findOneAndDelete({first_name: findToDelete}, (err, data) => {
        res.send(`${data}`)
    })
})

app.post('/addStudents', (req, res) => {
    const newStudent = new student()
    newStudent.first_name = req.body.first_name;
    newStudent.last_name = req.body.last_name;
    newStudent.age = req.body.age;
    newStudent.email = req.body.email;

    newStudent.save((err, data) => {
    res.send(`${data}`)
    })
})

app.post('/searchStudent', (req, res) => {
    first_name = req.body.first_name;
    last_name = req.body.last_name;

    student.findOne({first_name: first_name, last_name: last_name}, (err, data) => {
    res.send(`${data}`)
    })
})

app.post('/sortStudent', (req, res) => {
    attrSort = req.body.students
    orderSort = req.body.order

    student.find({}, (err, data) => {res.send(data)}).sort({ attrSort: orderSort})
})

app.listen(port, (err) => {
    if(err) {
        console.log(err);
    }
    console.log('listening on port 3000');
})

