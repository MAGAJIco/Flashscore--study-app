
import { Router } from 'express';
import { attachKidsModeFlag, filterGamblingContent } from '../middleware/kidsModeFilter';

const router = Router();

// Apply kids mode middleware to all payment routes
router.use(attachKidsModeFlag);

router.get('/transactions', async (req, res) => {
  try {
    // Fetch transactions from database
    const transactions: any[] = []; // TODO: Implement actual DB query
    
    // Filter gambling-related transactions if kids mode is active
    if ((req as any).kidsMode) {
      const filteredTransactions = transactions.filter(tx => {
        const isGambling = 
          tx.type?.toLowerCase().includes('bet') ||
          tx.type?.toLowerCase().includes('wager') ||
          tx.type?.toLowerCase().includes('deposit') ||
          tx.description?.toLowerCase().includes('gambling');
        return !isGambling;
      });
      return res.json({ success: true, data: filteredTransactions });
    }
    
    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch transactions' });
  }
});

router.post('/process', async (req, res) => {
  try {
    const { amount, type, description } = req.body;
    
    // Block gambling payments in kids mode
    if ((req as any).kidsMode) {
      const isGambling = 
        type?.toLowerCase().includes('bet') ||
        type?.toLowerCase().includes('wager') ||
        type?.toLowerCase().includes('deposit') ||
        description?.toLowerCase().includes('gambling');
      
      if (isGambling) {
        return res.status(403).json({ 
          success: false, 
          error: 'This payment type is not available in Kids Mode' 
        });
      }
    }
    
    // Process payment
    // TODO: Implement actual payment processing
    
    res.json({ success: true, message: 'Payment processed' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Payment processing failed' });
  }
});

export default router;
