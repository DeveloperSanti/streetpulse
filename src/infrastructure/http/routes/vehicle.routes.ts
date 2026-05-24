import { Router } from 'express';
import * as VehicleController from '../controllers/vehicle.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * /vehicles:
 *   get:
 *     tags: [Vehicles]
 *     summary: Lista los vehículos del piloto autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de vehículos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Vehicle' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', authMiddleware, VehicleController.listVehicles);

/**
 * @openapi
 * /vehicles:
 *   post:
 *     tags: [Vehicles]
 *     summary: Registra un nuevo vehículo (máximo 5 por piloto)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tipo_vehiculo, marca, modelo, anio, placa]
 *             properties:
 *               tipo_vehiculo: { type: string, enum: [auto, moto, monopatin_electrico] }
 *               marca: { type: string, example: Honda }
 *               modelo: { type: string, example: Civic Type R }
 *               anio: { type: integer, minimum: 1900, maximum: 2100, example: 2023 }
 *               placa: { type: string, maxLength: 10, example: ABC123 }
 *               color: { type: string, example: Rojo }
 *               foto: { type: string, format: uri }
 *               modificaciones: { type: string }
 *     responses:
 *       201:
 *         description: Vehículo agregado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Vehicle'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       409:
 *         description: Placa duplicada o se alcanzó el máximo de 5 vehículos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post('/', authMiddleware, VehicleController.addVehicle);

/**
 * @openapi
 * /vehicles/{id}:
 *   get:
 *     tags: [Vehicles]
 *     summary: Devuelve un vehículo por id (solo si pertenece al piloto autenticado)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Vehículo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Vehicle'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', authMiddleware, VehicleController.getVehicle);

/**
 * @openapi
 * /vehicles/{id}:
 *   put:
 *     tags: [Vehicles]
 *     summary: Actualiza un vehículo del piloto autenticado
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo_vehiculo: { type: string, enum: [auto, moto, monopatin_electrico] }
 *               marca: { type: string }
 *               modelo: { type: string }
 *               anio: { type: integer, minimum: 1900, maximum: 2100 }
 *               placa: { type: string, maxLength: 10 }
 *               color: { type: string }
 *               foto: { type: string, format: uri }
 *               modificaciones: { type: string }
 *     responses:
 *       200:
 *         description: Vehículo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Vehicle'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/:id', authMiddleware, VehicleController.updateVehicle);

/**
 * @openapi
 * /vehicles/{id}:
 *   delete:
 *     tags: [Vehicles]
 *     summary: Elimina un vehículo del piloto autenticado
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Vehículo eliminado exitosamente
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id', authMiddleware, VehicleController.deleteVehicle);

/**
 * @openapi
 * /vehicles/{id}/activate:
 *   patch:
 *     tags: [Vehicles]
 *     summary: Marca un vehículo como activo (desactiva los demás del piloto)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Vehículo activado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Vehicle'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/:id/activate', authMiddleware, VehicleController.activateVehicle);

export default router;
