if (process.env.NODE_ENV != 'production'){
  require('dotenv').config()
}

var express=require('express');
var ibmdb = require('ibm_db');
var http = require('http');
var app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.set('port', process.env.PORT || 3002);
app.set('view engine', 'ejs')
var connString = "DRIVER={DB2};DATABASE=" + process.env.DB_DATABASE + ";UID=" + process.env.DB_UID + ";PWD=" + process.env.DB_PWD + ";HOSTNAME=" + process.env.DB_HOSTNAME + ";port=" + process.env.DB_PORT;

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
app.get('/departaments', (req, res) => {
  //res.sendFile(__dirname + '/public/index.html')
ibmdb.open(connString, function (err,conn) {
  if (err) return console.log("errrp"+err);
  conn.query('SELECT * from '+process.env.DB_SCHEMA+'.departament', function (err, data) {
    if (err) console.log(err);
    else console.log(data);
    res.render('index.ejs', { departaments: data })
    conn.close(function () {
      console.log('Listar Registros');
    });
  });
});
});

app.get('/departaments/:id' , (req, res) => {
  ibmdb.open(connString, function (err,conn) {
    if (err) return console.log("errrp"+err);
    conn.query('SELECT * from '+process.env.DB_SCHEMA+'.departament WHERE DEPTCODE =?',[req.params.id], function (err, data) {
      console.log('SELECT * from '+process.env.DB_SCHEMA+'.departament WHERE DEPTCODE =?'+[req.params.id])
      if (err) console.log(err);
      else console.log(data);
      res.render('index.ejs', { departaments: data })
      conn.close(function () {
        console.log('Registro consultado '+req.params.id);
      });
    });
  });
});

app.post('/departaments', (req, res) => {
  console.log(req.body.nameDept)
  ibmdb.open(connString, function (err,conn) {
    if (err) return console.log("errrp"+err);
    let dept = req.body
    var sql="INSERT INTO "+process.env.DB_SCHEMA+".departament (DEPTCODE, DEPTNAME) VALUES ('"+dept.codeDept+"', '"+dept.nameDept+"')"
    conn.query(sql, function (err, data) {
      if (err) console.log(err);
      else console.log(data);
      res.redirect('/departaments')
      conn.close(function () {
        console.log('Registro Insertado correctamente');
      });
    });
  });
})

app.put('/departaments', (req, res) => {
  console.log(req.body.nameDept)
  ibmdb.open(connString, function (err,conn) {
    if (err) return console.log("errrp"+err);
    let dept = req.body
    var sql="UPDATE "+process.env.DB_SCHEMA+".departament SET DEPTNAME='"+dept.nameDept+"' WHERE DEPTCODE='"+dept.codeDept+"'"
    conn.query(sql, function (err, data) {
      if (err) console.log(err);
      else{ console.log(data);
      //res.redirect('/departaments')
      }
      conn.close(function () {
        console.log('Registro '+dept.nameDept+' Actualizado correctamente');
      });
    });
  });
})

app.delete('/departaments/:id' , (req, res) => {
  ibmdb.open(connString, function (err,conn) {
    if (err) return console.log("errrp"+err);
    conn.query('DELETE FROM '+process.env.DB_SCHEMA+'.departament WHERE DEPTCODE =?',[req.params.id], function (err, data) {
      if (err) console.log(err);
      else console.log(data);
      res.render('index.ejs', { departaments: data })
      conn.close(function () {
        console.log('Registro eliminado '+req.params.id);
      });
    });
  });
});