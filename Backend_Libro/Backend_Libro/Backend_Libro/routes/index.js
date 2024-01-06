var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hola/:name/:lastname/user', function(req, res, next) {
  console.log(req.params)
  //parametros con /: solo con get puedes utilizar
  //res.render("index", {data: 'hola como estas'.});
});

router.post('/hola', function(req, res, next) {
  console.log(req.body)
  
});

module.exports = router;
