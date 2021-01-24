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
app.get('/', (req, res) => {
  //res.sendFile(__dirname + '/public/index.html')
  console.log('get/')
ibmdb.open(connString, function (err,conn) {
  if (err) return console.log("errrp"+err);
  conn.query('SELECT * from store2.departament', function (err, data) {
    if (err) console.log(err);
    else console.log(data);
    res.render('index.ejs', { departaments: data })
    conn.close(function () {
      console.log('done');
    });
  });
});
});
app.post('/departaments', (req, res) => {
  console.log(req.body)
})