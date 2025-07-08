import Router from 'express';
import produceRouter from './produce.routes.js';
import farmerRouter from './farmer.routes.js';
import buyerRouter from './buyer.routes.js';

const router = Router();

router.use('/farmers', farmerRouter);
router.use('/buyers', buyerRouter);
router.use('/produce', produceRouter);

export default router;
