import express from 'express';
import * as clientesController from '../controllers/clientesController.js';
import * as validation from '../middlewares/validation.js';

const router = express.Router();

router.get('/', clientesController.getClientes);
router.post('/', validation.validateCliente, clientesController.postClientes);
router.put('/:id', validation.checkClienteExists, clientesController.putClientes);
router.delete('/:id', validation.checkClienteExists, clientesController.deleteClientes);

export default router;
