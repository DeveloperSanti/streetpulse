import { Router } from 'express';
import * as RanksController from '../controllers/ranks.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * /ranks:
 *   get:
 *     tags: [Ranks]
 *     summary: Devuelve el listado de rangos disponibles (S, A, B, C, D)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de rangos
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           rango: { type: string, enum: [S, A, B, C, D] }
 *                           descripcion: { type: string }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/ranks', authMiddleware, RanksController.listRanks);

/**
 * @openapi
 * /ranks/global-leaderboard:
 *   get:
 *     tags: [Ranks]
 *     summary: Devuelve la tabla de clasificación global de pilotos
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
 *         description: Listado paginado de pilotos ordenados por victorias
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/User' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/ranks/global-leaderboard', authMiddleware, RanksController.globalLeaderboard);

/**
 * @openapi
 * /ranks/{rango}/leaderboard:
 *   get:
 *     tags: [Ranks]
 *     summary: Devuelve la tabla de clasificación de un rango específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rango
 *         required: true
 *         schema: { type: string, enum: [S, A, B, C, D] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Listado paginado de pilotos del rango indicado
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/User' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/ranks/:rango/leaderboard', authMiddleware, RanksController.getLeaderboard);

/**
 * @openapi
 * /categories:
 *   get:
 *     tags: [Ranks]
 *     summary: Lista las categorías disponibles para retos
 *     responses:
 *       200:
 *         description: Listado de categorías
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: string, format: uuid }
 *                           nombre: { type: string }
 *                           descripcion: { type: string, nullable: true }
 *                           activo: { type: boolean }
 */
router.get('/categories', RanksController.listCategories);

export default router;
