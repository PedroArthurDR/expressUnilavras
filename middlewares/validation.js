import httpErrors from 'http-errors';
import db from '../services/db.js'
export const validateCliente = (req, res, next) => {
  const { nome, sobrenome, email, idade } = req.body;
  if (!nome || !sobrenome || !email || !idade) {
    return next(httpErrors(400, 'Todos os campos são obrigatórios'));
  }

  if (!isValidEmail(email)) {
    return next(httpErrors(400, 'Email inválido'));
  }

  next();
};

export const validateProduto = (req, res, next) => {
  const { nome, descricao, preco } = req.body;

  if (!nome || !descricao || !preco) {
    return next(httpErrors(400, 'Todos os campos são obrigatórios'));
  }

  next();
};

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const checkClienteExists = async (req, res, next) => {
  const { id } = req.params;
  
  try {
      const [rows] = await db.promise().query('SELECT * FROM clientes WHERE id = ?', [id]);
      
      if (rows.length === 0) {
          return next(httpErrors(404, 'Cliente não encontrado'));
      }

      next();
  } catch (error) {
      console.error('Erro ao verificar a existência do cliente:', error);
      return next(httpErrors(500, 'Erro interno do servidor'));
  }
};

export const checkProdutoExists = async (req, res, next) => {
  const { id } = req.params;
  
  try {
      const [rows] = await db.promise().query('SELECT * FROM produtos WHERE id = ?', [id]);
      
      if (rows.length === 0) {
          return next(httpErrors(404, 'Produto não encontrado'));
      }

      next();
  } catch (error) {
      console.error('Erro ao verificar a existência do produto:', error);
      return next(httpErrors(500, 'Erro interno do servidor'));
  }
};