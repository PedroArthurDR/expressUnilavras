import httpErrors from 'http-errors';
import db from '../services/db.js';
import * as validation from '../middlewares/validation.js';
import * as cache from '../middlewares/cache.js';

export const getClientes = async (req, res, next) => {
  try {
    const clientes = await cache.getOrSet('clientes', () => {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM clientes', (error, results) => {
          if (error) {
            console.error('Erro ao obter clientes:', error);
            return reject(httpErrors(500, 'Erro interno do servidor'));
          }
          console.log('Database query executed for getClientes');
          resolve(results);
        });
      });
    });
    res.json(clientes);
  } catch (error) {
    next(error);
  }
};

export const postClientes = (req, res, next) => {
  const { nome, sobrenome, email, idade } = req.body;
  validation.isValidEmail(email);
  
  // Inserir novo cliente no banco de dados
  db.query('INSERT INTO clientes (nome, sobrenome, email, idade) VALUES (?, ?, ?, ?)', [nome, sobrenome, email, idade], (error) => {
    if (error) {
      console.error('Erro ao criar cliente:', error);
      return next(httpErrors(500, 'Erro interno do servidor'));
    }
    cache.del('clientes'); // Invalida o cache após inserção
    res.status(201).json({ message: 'Cliente criado com sucesso' });
  });
};

export const deleteClientes = (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(httpErrors(400, 'ID do cliente não fornecido'));
  }

  // Deletar cliente do banco de dados
  db.query('DELETE FROM clientes WHERE id = ?', [id], (error) => {
    if (error) {
      console.error('Erro ao deletar cliente:', error);
      return next(httpErrors(500, 'Erro interno do servidor'));
    }
    cache.del('clientes'); // Invalida o cache após exclusão
    res.status(200).json({ message: 'Cliente deletado com sucesso' });
  });
};

export const putClientes = (req, res, next) => {
  const { id } = req.params;
  const { nome, sobrenome, email, idade } = req.body;

  if (!id) {
    return next(httpErrors(400, 'ID do cliente não fornecido'));
  }

  let query = 'UPDATE clientes SET ';
  const values = [];
  const fieldsToUpdate = [];

  if (nome) {
    fieldsToUpdate.push('nome = ?');
    values.push(nome);
  }

  if (sobrenome) {
    fieldsToUpdate.push('sobrenome = ?');
    values.push(sobrenome);
  }

  if (email) {
    fieldsToUpdate.push('email = ?');
    values.push(email);
  }

  if (idade) {
    fieldsToUpdate.push('idade = ?');
    values.push(idade);
  }

  if (fieldsToUpdate.length === 0) {
    return next(httpErrors(400, 'Nenhum parâmetro fornecido para atualização'));
  }

  query += fieldsToUpdate.join(', ') + ' WHERE id = ?';
  values.push(id);

  // Atualizar cliente no banco de dados
  db.query(query, values, (error) => {
    if (error) {
      console.error('Erro ao atualizar cliente:', error);
      return next(httpErrors(500, 'Erro interno do servidor'));
    }
    cache.del('clientes'); // Invalida o cache após atualização
    res.status(200).json({ message: 'Cliente atualizado com sucesso' });
  });
};
