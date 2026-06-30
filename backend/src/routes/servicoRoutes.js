import { Router } from 'express';
import {
  getAllServicos,
  getServicoById,
  createServico,
  updateServico,
  deleteServico,
} from '../controllers/servicoController.js';

const router = Router();

router.get('/', getAllServicos);
router.get('/:id', getServicoById);
router.post('/', createServico);
router.put('/:id', updateServico);
router.delete('/:id', deleteServico);

export default router;
