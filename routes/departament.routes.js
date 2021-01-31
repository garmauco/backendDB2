module.exports = app => {
    const departaments = require("../controllers/departament.controller.js");
  
    var router = require("express").Router();
  
    // recupera todos los registros
    router.get("/", departaments.findAll);
  

    app.use('/api/departaments', router);
  };