import { Router } from 'express';
import * as VehicleController from '../controllers/vehicle.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/vehicles', authMiddleware, VehicleController.listVehicles);
router.post('/vehicles', authMiddleware, VehicleController.addVehicle);
router.get('/vehicles/:id', authMiddleware, VehicleController.getVehicle);
router.put('/vehicles/:id', authMiddleware, VehicleController.updateVehicle);
router.delete('/vehicles/:id', authMiddleware, VehicleController.deleteVehicle);
router.patch('/vehicles/:id/activate', authMiddleware, VehicleController.activateVehicle);

export default router;
