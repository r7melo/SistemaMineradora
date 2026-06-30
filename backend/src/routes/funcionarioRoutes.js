import { Router } from 'express';
import {
  getAllFuncionarios,
  getFuncionarioById,
  createFuncionario,
  updateFuncionario,
  deleteFuncionario,
} from '../controllers/funcionarioController.js';

const router = Router();

router.get('/', getAllFuncionarios);
router.get('/:id', getFuncionarioById);
router.post('/', createFuncionario);
router.put('/:id', updateFuncionario);
router.delete('/:id', deleteFuncionario);

export default router;
