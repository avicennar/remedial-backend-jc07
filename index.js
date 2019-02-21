const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

var port = 2000;

var app = express({defaultErrorHandler:false});

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static('public'));

const conn = mysql.createConnection({
    host:'localhost',
    user:'avis',
    password:'haidar123',
    database:'hotelbertasbih',
    port: 3306
});

//homepage
app.get('/',(req,res) => {
    res.send('<a><center>Welcome To HotelBertasbih Database</center></a>')
});

//lihat semua kamar
app.get('/listkamar',(req,res) => {
    var sql = 'select * from tablekamar;'
    conn.query(sql,(err,result)=> {
        res.send(result)
    })
})

//filter berdasarkan kategory
app.get('/kategorikamar/:jenis',(req,res) => {
    var kategori = req.body;
    var sql = `select
    tk.nomorKamar as kamar,
    tc.namacategory as jenis,
    tk.harga as price
    from tablekamar tk join tablecategory tc on tk.categoryid = tc.id
    having jenis like '${req.body}'`
    conn.query(sql,kategori,(err,result) => {
        res.send(result)
        console.log(result)
    })
})

//buat kamar baru
app.post('/addkamar', (req,res) => {
    var newRoom = req.body;
    var sql = `insert into tablekamar set ?`;
    conn.query(sql, newRoom,(err,result) => {
        res.send(result)
    })
})

//buat kategori baru
app.post('/addkategori', (req,res) => {
    var newKat = req.body;
    var sql = `insert into tablecategory set ?`;
    conn.query(sql,newKat,(err,result) => {
        res.send(result)
    })
})

//update kamar
app.post('/editkamar',(req,res) => {
    var editKamar = req.body
    var sql = `update tablekamar set ? where id=${req.params.id}`;
    conn.query(sql,editKamar,(err,result)=> {
        res.send(result)
    })
})

//update kategori
app.post('/editkategori',(req,res) => {
    var editKategori = req.body
    var sql = `update tablecategory set ? where id=${req.params.id}`;
    conn.query(sql,editKategori,(err,result)=> {
        res.send(result)
    })
})

//delete kamar
app.post('/deletekamar/:id',(req,res) => {
    var sql = `delete from tablekamar where id=${req.params.id}`;
    conn.query(sql,(err,result) => {
        res.send(result)
    })
})
//delete kategori
app.post('/deletekategori/:id',(req,res) => {
    var sql = `delete from tablecategory where id=${req.params.id}`;
    conn.query(sql,(err,result) => {
        res.send(result)
    })
})

//login user
app.get('/login',(req,res) => {
    var data = req.body;
    var sql = `select * from tableuser tb
     where tb.username = '${req.body.username}' and tb.password = '${req.body.password}';`;
    conn.query(sql,data,(err,result) => {
        res.send('welcome' + result)
    })
})

//register
app.get('/register',(req,res) => {
    var data = req.body;
    var sql = `insert into tableuser set ?`;
    conn.query(sql,data,(err,result) => {
        res.send(result)
        console.log('registrasi berhasil!')
    })
})

app.listen(port, ()=> console.log('API AKTIF DI PORT ' + port));