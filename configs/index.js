import express from 'express';
import httpErrors from 'http-errors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import clientesRoutes from '../routes/clientesRoutes.js'
import produtosRoutes from '../routes/produtosRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/clientes', clientesRoutes);
app.use('/produtos', produtosRoutes);
app.get('/', (req, res) => {
  res.sendStatus(200);
});
app.use((req, res, next) => {
  next(httpErrors(404));
});

app.use((err, req, res) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  });
});
/* eslint-disable no-undef */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
