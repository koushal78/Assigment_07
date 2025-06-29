import express from 'express';
import Expense from '../models/Expense.js';


const router = express.Router();

// GET /api/expenses - Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ 
      error: 'Failed to fetch expenses',
      message: error.message 
    });
  }
});

// POST /api/expenses - Create new expense
router.post('/', async (req, res) => {
  try {
    const { description, amount, category } = req.body;
    
    const expense = new Expense({
      description: description?.trim(),
      amount: parseFloat(amount),
      category: category?.trim() || 'Other'
    });

    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation failed',
        messages 
      });
    }
    
    console.error('Error creating expense:', error);
    res.status(500).json({ 
      error: 'Failed to create expense',
      message: error.message 
    });
  }
});

// DELETE /api/expenses/:id - Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExpense = await Expense.findByIdAndDelete(id);
    
    if (!deletedExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json({ 
      message: 'Expense deleted successfully', 
      id: deletedExpense._id 
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ 
      error: 'Failed to delete expense',
      message: error.message 
    });
  }
});

export default router;