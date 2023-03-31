import express, { Request, ErrorRequestHandler } from 'express';
import * as http from 'http';
import handlebars from 'express-handlebars';
import compression from 'compression';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import Config from '../config';
import { Logger } from '../utils/logger';
import routersIndex from '../routes/index';
import { hbsOptions } from '../utils/hbsOptions';
import cors from 'cors';

const app = express();
// const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// paths
const publicFolderPath = process.cwd() + '/public';
const uploadsFolderPath = process.cwd() + '/assets/images';
const layoutDirPath = process.cwd() + '/views/layouts';
const defaultLayerPth = process.cwd() + '/views/layouts/index.hbs';
const partialDirPath = process.cwd() + '/views/partials';

//Error Handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  Logger.error(`HUBO UN ERROR ${err}`);
  res.status(500).json({
    err: err.message
  });
};
app.use(errorHandler);

// Setea el uso de compresion.
app.use(compression());

// Setea el uso de cors.
app.use(cors());

// Express & Handlebars Setup
app.use(express.static(publicFolderPath));
app.use(express.static(uploadsFolderPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
app.engine(
  'hbs',
  handlebars({ layoutsDir: layoutDirPath, extname: 'hbs', defaultLayout: defaultLayerPth, partialsDir: partialDirPath })
);

//Login
const unMinuto = 1000 * 60;

// const StoreOptions = {
//   store: MongoStore.create({
//     mongoUrl: mongoURL,
//     dbName: 'kwikemartonline-users',
//     stringify: false,
//     autoRemove: 'interval',
//     autoRemoveInterval: 1
//   }),
//   secret: 'APU_S3CR3T_K3Y',
//   resave: false,
//   saveUninitialized: false,
//   rolling: true,
//   cookie: { maxAge: Number(Config.SESSION_COOKIE_TIMEOUT_MIN) * 60 * 1000 }
// };

// app.use(cookieParser());
// app.use(session(StoreOptions));

// Main Page
app.get('/', (req: Request, res) => {
  res.render('main', hbsOptions);
});

// Use routers
app.use('/api', routersIndex);

// Swagger Documentation
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kwik-E-Mart Online / Backend API',
      version: '0.0.1',
      description: 'This is a simple CRUD API application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html'
      },
      contact: {
        name: 'Facundo Creus',
        url: 'https://github.com/fakush',
        email: 'fcreus@gmail.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${Config.PORT}`,
        description: 'Development server'
      },
      {
        url: `https://fcreus-backend-proyect.herokuapp.com/`,
        description: 'Heroku server'
      }
    ]
  },
  apis: ['src/routes/*']
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const myServer = new http.Server(app);
export default myServer;
