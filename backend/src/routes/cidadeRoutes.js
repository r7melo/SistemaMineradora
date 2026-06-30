import { Router } from 'express';
import {
  getAllCidades,
  getCidadeById,
  createCidade,
  updateCidade,
  deleteCidade,
} from '../controllers/cidadeController.js';

const router = Router();

router.get('/', getAllCidades);
router.get('/:id', getCidadeById);
router.post('/', createCidade);
router.put('/:id', updateCidade);
router.delete('/:id', deleteCidade);

export default router;
