import express from 'express';
import * as produtosController from '../controllers/produtosController.js';
import * as validation from '../middlewares/validation.js';

const router = express.Router();

router.get('/', produtosController.getProdutos);
router.post('/', validation.validateProduto, produtosController.postProduto);
router.put('/:id', validation.checkProdutoExists ,produtosController.putProduto);
router.delete('/:id', produtosController.deleteProdutos);
export default router;
