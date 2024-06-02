import httpErrors from 'http-errors';
import db from '../services/db.js';
import * as cache from '../middlewares/cache.js';

export const getProdutos = async (req, res, next) => {
  try {
    const produtos = await cache.getOrSet('produtos', () => {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM produtos', (error, results) => {
          if (error) {
            console.error('Erro ao obter produtos:', error);
            return reject(httpErrors(500, 'Erro interno do servidor'));
          }
          console.log('Database query executed for getProdutos');
          resolve(results);
        });
      });
    });
    res.json(produtos);
  } catch (error) {
    next(error);
  }
};

export const postProduto = (req, res, next) => {
  const { nome, descricao, preco } = req.body;

  db.query('INSERT INTO produtos (nome, descricao, preco) VALUES (?, ?, ?)', [nome, descricao, preco], (error) => {
    if (error) {
      console.error('Erro ao criar produto:', error);
      return next(httpErrors(500, 'Erro interno do servidor'));
    }
    console.log('Database query executed for postProduto');
    cache.del('produtos'); // Invalida o cache após inserção
    res.status(201).json({ message: 'Produto criado com sucesso' });
  });
};

export const putProduto = (req, res, next) => {
  const { id } = req.params;
  const { nome, descricao, preco } = req.body;

  if (!id) {
    return next(httpErrors(400, 'ID do produto não fornecido'));
  }

  db.query('SELECT * FROM produtos WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error('Erro ao buscar produto:', error);
      return next(httpErrors(500, 'Erro interno do servidor'));
    }

    if (results.length === 0) {
      return next(httpErrors(404, 'Produto não encontrado'));
    }

    const produtoAtual = results[0];

    const novosDadosProduto = {
      nome: nome || produtoAtual.nome,
      descricao: descricao || produtoAtual.descricao,
      preco: preco || produtoAtual.preco
    };

    db.query('UPDATE produtos SET nome = ?, descricao = ?, preco = ? WHERE id = ?', 
             [novosDadosProduto.nome, novosDadosProduto.descricao, novosDadosProduto.preco, id], 
             (error) => {
      if (error) {
        console.error('Erro ao atualizar produto:', error);
        return next(httpErrors(500, 'Erro interno do servidor'));
      }
      console.log('Database query executed for putProduto');
      cache.del('produtos'); // Invalida o cache após atualização
      res.status(200).json({ message: 'Produto atualizado com sucesso' });
    });
  });
};

export const deleteProdutos = (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(httpErrors(400, 'ID do produto não fornecido'));
  }

  db.query('DELETE FROM produtos WHERE id = ?', [id], (error) => {
    if (error) {
      console.error('Erro ao deletar produto:', error);
      return next(httpErrors(500, 'Erro interno do servidor'));
    }
    console.log('Database query executed for deleteProdutos');
    cache.del('produtos'); // Invalida o cache após exclusão
    res.status(200).json({ message: 'Produto deletado com sucesso' });
  });
};
