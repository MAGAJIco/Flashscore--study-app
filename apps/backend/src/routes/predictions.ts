
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    
    // TODO: Fetch from database
    const predictions = [];
    
    res.json({
      success: true,
      data: predictions,
      count: predictions.length
    });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch predictions'
    });
  }
});

export default router;
