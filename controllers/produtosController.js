import httpErrors from 'http-errors';
import db from '../services/db.js'

export const getProdutos = (req, res, next) => {
  db.query('SELECT * FROM produtos', (error, results) => {
    if (error) {
      console.error('Erro ao obter produtos:', error);
      return next(httpErrors(500, 'Erro interno do servidor'));
    }
    res.json(results);
  });
};

export const postProduto = (req, res, next) => {
    const { nome, descricao, preco } = req.body;
  
    // Insere os dados na tabela produtos
    db.query('INSERT INTO produtos (nome, descricao, preco) VALUES (?, ?, ?)', 
             [nome, descricao, preco], 
             (error) => {
               if (error) {
                 console.error('Erro ao criar produto:', error);
                 return next(httpErrors(500, 'Erro interno do servidor'));
               }
               res.status(201).json({ message: 'Produto criado com sucesso' });
             });
  };

  export const putProduto = (req, res, next) => {
    const { id } = req.params;
    const { nome, descricao, preco } = req.body;
  
    // Verifica se o ID foi fornecido
    if (!id) {
      return next(httpErrors(400, 'ID do produto não fornecido'));
    }
  
    // Busca os dados atuais do produto no banco de dados
    db.query('SELECT * FROM produtos WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error('Erro ao buscar produto:', error);
            return next(httpErrors(500, 'Erro interno do servidor'));
        }
        
        if (results.length === 0) {
            return next(httpErrors(404, 'Produto não encontrado'));
        }
        
        // Obtém os dados atuais do produto
        const produtoAtual = results[0];
        
        // Mescla os dados atuais com os novos dados da requisição
        const novosDadosProduto = {
            nome: nome || produtoAtual.nome,
            descricao: descricao || produtoAtual.descricao,
            preco: preco || produtoAtual.preco
        };
        
        // Atualiza o produto no banco de dados
        db.query('UPDATE produtos SET nome = ?, descricao = ?, preco = ? WHERE id = ?', 
                 [novosDadosProduto.nome, novosDadosProduto.descricao, novosDadosProduto.preco, id], 
                 (error) => {
                     if (error) {
                         console.error('Erro ao atualizar produto:', error);
                         return next(httpErrors(500, 'Erro interno do servidor'));
                     }
                     res.status(200).json({ message: 'Produto atualizado com sucesso' });
                 });
    });
};

  
  export const deleteProdutos = (req, res, next) => {
    const { id } = req.params;

    if (!id) {
      return next(httpErrors(400, 'ID do cliente não fornecido'));
    }
    // Deletar cliente do banco de dados
    db.query('DELETE FROM produtos WHERE id = ?', [id], (error) => {
      if (error) {
        console.error('Erro ao deletar cliente:', error);
        return next(httpErrors(500, 'Erro interno do servidor'));
      }
      res.status(200).json({ message: 'Cliente deletado com sucesso' });
    });
  };