import { Router } from 'express';
import * as VehicleController from '../controllers/vehicle.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, VehicleController.listVehicles);
router.post('/', authMiddleware, VehicleController.addVehicle);
router.get('/:id', authMiddleware, VehicleController.getVehicle);
router.put('/:id', authMiddleware, VehicleController.updateVehicle);
router.delete('/:id', authMiddleware, VehicleController.deleteVehicle);
router.patch('/:id/activate', authMiddleware, VehicleController.activateVehicle);

export default router;
