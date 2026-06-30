import { Router } from 'express';
import {
  getAllEquipamentos,
  getEquipamentoById,
  createEquipamento,
  updateEquipamento,
  deleteEquipamento,
} from '../controllers/equipamentoController.js';

const router = Router();

router.get('/', getAllEquipamentos);
router.get('/:id', getEquipamentoById);
router.post('/', createEquipamento);
router.put('/:id', updateEquipamento);
router.delete('/:id', deleteEquipamento);

export default router;
