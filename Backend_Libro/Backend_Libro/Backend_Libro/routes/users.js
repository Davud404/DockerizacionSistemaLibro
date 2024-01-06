var express = require("express");
var router = express.Router();
const multer = require("multer");
let jwt = require("jsonwebtoken");
const personaC = require("../app/controls/PersonaControl");
let personaControl = new personaC();
const rolC = require("../app/controls/RolControl");
let rolControl = new rolC();
const cuentaC = require("../app/controls/CuentaControl");
let cuentaControl = new cuentaC();
const libroC = require("../app/controls/LibroControl");
let libroControl = new libroC();
const facturaC = require("../app/controls/FacturaControl");
let facturaControl = new facturaC();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
//middleware

var auth = function middleware(req, res, next) {
  const token = req.headers["TOKEN-API"];
  if (token) {
    require("dotenv").config();
    const llave = process.env.KEY_PRI;
    jwt.verify(token, llave, async (err, decoded) => {
      if (err) {
        res.status(401);
        res.json({ msg: "token expirado o no valido", code: 401 });
      } else {
        var models = require("../app/models");
        req.decoded = decoded;
        let aux = await models.cuenta.findOne({
          where: { external_id: req.decoded.external },
        });
        if (!aux) {
          res.status(401);
          res.json({ msg: "token no valido", code: 401 });
        } else {
          next();
        }
      }
    });
  } else {
    res.status(401);
    res.json({ msg: "No existe token", code: 401 });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/imagenes"); // Especifica la carpeta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo como nombre de archivo en el servidor
  },
});

const upload = multer({ storage: storage });
//api de libro
router.post('/admin/libros/guardar',upload.array('images', 5),libroControl.guardars);
router.get("/admin/libros", libroControl.listar);

//api de rol
router.get("/admin/rol", rolControl.listar);
router.post("/admin/rol/guardar", rolControl.guardar);

//api de personas
router.get("/admin/personas", personaControl.listar);
router.post("/admin/personas/guardar", personaControl.guardar);
router.post("/admin/personas/modificar", personaControl.modificar);


//ventas
router.post("/admin/factura/guardar", facturaControl.guardar);



//login
router.post("/login", cuentaControl.inicio_sesion);

module.exports = router;
