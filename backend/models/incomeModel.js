import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
    description : {
    type : String,
    required : true
  },
  amount : {
    type : Number,
    required : true
  },
  originalAmount: {
    type: Number
  },
  originalCurrency: {
    type: String
  },
  conversionRate: {
    type: Number
  },
  baseCurrency: {
    type: String
  },
  category: {
    type: String,
    required : true,
  },
  date: {
    type: Date,
    required : true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  type: {
    type: String,
    default: "income",  
  },
},{
    timestamps: true
  
});

const incomeModel = mongoose.models.income || mongoose.model("income", incomeSchema);

export default incomeModel;
