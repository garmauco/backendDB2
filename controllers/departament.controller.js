if (process.env.NODE_ENV != 'production'){
    require('dotenv').config() //configuración conexion base de datos y puerto
}
var ibmdb = require('ibm_db');//librería DB2 

var connString = "DRIVER={DB2};DATABASE=" + process.env.DB_DATABASE + ";UID=" + process.env.DB_UID + ";PWD=" + process.env.DB_PWD + ";HOSTNAME=" + process.env.DB_HOSTNAME + ";port=" + process.env.DB_PORT;

//función que lista todos los registros
exports.findAll = (req, res) => {
    ibmdb.open(connString, function (err,conn) {
        if (err) return console.log("Error: "+err);
        conn.query('SELECT DEPTCODE AS CODE, DEPTNAME AS NAME from '+process.env.DB_SCHEMA+'.departament', function (err, data) {
          if (err) console.log(err);
          else console.log(data);
          res.send(data)
          conn.close(function () {
            console.log('Listar Registros');
          });
        });
      });
  };