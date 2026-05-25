import { Router } from 'express';
import * as ChallengeController from '../controllers/challenge.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * /challenges:
 *   get:
 *     tags: [Challenges]
 *     summary: Lista los retos del piloto autenticado
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Listado paginado de retos del piloto
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Challenge' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/challenges', authMiddleware, ChallengeController.listChallenges);

/**
 * @openapi
 * /challenges:
 *   post:
 *     tags: [Challenges]
 *     summary: Envía un nuevo reto a otro piloto
 *     description: Aplica reglas de negocio mismo rango, mismo tipo de vehículo, no auto-reto, sin reto activo previo.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [retado_id, vehiculo_retador_id, tipo_carrera]
 *             properties:
 *               retado_id: { type: string, format: uuid }
 *               vehiculo_retador_id: { type: string, format: uuid }
 *               tipo_carrera: { type: string, enum: [cuarto_milla, vueltas, derrape] }
 *               ubicacion_acordada: { type: string }
 *               fecha_acordada: { type: string, format: date-time }
 *               notas: { type: string }
 *     responses:
 *       201:
 *         description: Reto enviado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Challenge'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       409:
 *         description: Violación de regla de negocio (mismo rango, vehículo, reto activo, etc.)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.post('/challenges', authMiddleware, ChallengeController.sendChallenge);

/**
 * @openapi
 * /challenges/{id}:
 *   get:
 *     tags: [Challenges]
 *     summary: Devuelve un reto por id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Reto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Challenge'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/challenges/:id', authMiddleware, ChallengeController.getChallenge);

/**
 * @openapi
 * /challenges/{id}/accept:
 *   patch:
 *     tags: [Challenges]
 *     summary: Acepta un reto pendiente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Reto aceptado
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Challenge'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/challenges/:id/accept', authMiddleware, ChallengeController.acceptChallenge);

/**
 * @openapi
 * /challenges/{id}/reject:
 *   patch:
 *     tags: [Challenges]
 *     summary: Rechaza un reto pendiente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Reto rechazado
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Challenge'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/challenges/:id/reject', authMiddleware, ChallengeController.rejectChallenge);

/**
 * @openapi
 * /challenges/{id}/cancel:
 *   patch:
 *     tags: [Challenges]
 *     summary: Cancela un reto creado por el piloto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Reto cancelado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/challenges/:id/cancel', authMiddleware, ChallengeController.cancelChallenge);

/**
 * @openapi
 * /challenges/{id}/start:
 *   patch:
 *     tags: [Challenges]
 *     summary: Inicia un reto aceptado
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Reto iniciado
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Challenge'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/challenges/:id/start', authMiddleware, ChallengeController.startChallenge);

/**
 * @openapi
 * /challenges/{id}/result:
 *   post:
 *     tags: [Challenges]
 *     summary: Registra el resultado de un reto en curso
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
 *             required: [ganador_id]
 *             properties:
 *               ganador_id: { type: string, format: uuid }
 *               notas_resultado: { type: string }
 *     responses:
 *       200:
 *         description: Resultado registrado
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Challenge'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/challenges/:id/result', authMiddleware, ChallengeController.registerResult);

/**
 * @openapi
 * /challenges/{id}/confirm:
 *   post:
 *     tags: [Challenges]
 *     summary: Confirma el resultado registrado (se requieren ambas confirmaciones para completar)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Resultado confirmado
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Challenge'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/challenges/:id/confirm', authMiddleware, ChallengeController.confirmResult);

export default router;
