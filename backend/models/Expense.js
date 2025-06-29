import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [100, 'Description cannot exceed 100 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  category: {
    type: String,
    default: 'Other',
    trim: true
  }
}, {
  timestamps: true
});

// Add a virtual for formatted amount
expenseSchema.virtual('formattedAmount').get(function() {
  return `₹${this.amount.toFixed(2)}`;
});

// Ensure virtual fields are serialized
expenseSchema.set('toJSON', { virtuals: true });

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;