
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  try {
    // TODO: Fetch from database
    const authors = [];
    
    res.json({
      success: true,
      data: authors,
      count: authors.length
    });
  } catch (error) {
    console.error('Error fetching authors:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch authors'
    });
  }
});

export default router;
