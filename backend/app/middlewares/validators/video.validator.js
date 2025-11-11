// Video validator

// Import modules
const {body, validationResult, param} = require('express-validator');
//const { expressjwt: jwt }  = require('express-jwt');
const path = require('path');
const Video = require('../../models/db').Video;

// Video data validation
module.exports.create = [
  body('nombre')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('El nombre del video no puede estar vacío')
    .bail()
    .custom(async (value, { req }) => {
      const video = await Video.findOne({ where: { nombre: value } });
      if (video) {
          throw new Error('Oh no, copiaste el nombre de otro video!');
      }
  }),
  body('metrica')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('La métrica del video no puede estar vacía')
    .bail()
    .isInt({ min: 0 }).withMessage('La métrica debe ser un número entero positivo')
    .bail(),
  body('videoFile')
    .custom((value, { req }) => {
      const file = req.files?.videoFile;
      if (!file) return true; // opcional
      const ext = path.extname(file.name).toLowerCase();
      if (!['.mp4', '.mkv', '.avi', '.webm'].includes(ext)) {
        throw new Error('Formato de vídeo no soportado');
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({errors: errors.array()});
    next();
  },
];
