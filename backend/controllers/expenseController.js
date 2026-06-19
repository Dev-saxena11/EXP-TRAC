import expenseModel from "../models/expenseModel.js";
import getDateRange from "../utils/dateFilter.js";
import XLSX from "xlsx";
import { getExchangeRate } from "../utils/currency.js";



//add expense
export async function addExpense(req, res) {
  const userId = req.user._id;
  const { description, amount, category, date, currency, originalCurrency } = req.body;
  try {
    if (!description || !amount || !category || !date) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const finalCurrency = currency || originalCurrency || req.user.preferredCurrency || "INR";
    const baseCurrency = req.user.preferredCurrency || "INR";
    const originalAmount = parseFloat(amount);

    const rate = await getExchangeRate(finalCurrency, baseCurrency);
    const convertedAmount = originalAmount * rate;

    const newExpense = new expenseModel({
      description,
      amount: convertedAmount,
      originalAmount,
      originalCurrency: finalCurrency,
      conversionRate: rate,
      baseCurrency,
      category,
      date: new Date(date),
      userId,
    });
    await newExpense.save();
    res
      .status(201)
      .json({ success: true, message: "Expense added successfully" });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

//to get all expenses
export async function getAllExpense(req, res) {
  const userId = req.user._id;
  try {
    const expense = await expenseModel.find({ userId }).sort({ date: -1 });
    res.status(200).json({ success: true, expense });
  } catch (error) {
    console.error("Error fetching incomes:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
// update expense
export async function updateExpense(req, res) {
  const { id } = req.params;
  const userId = req.user._id;
  const { description, amount, category, date, currency, originalCurrency } = req.body;
  try {
    const expense = await expenseModel.findOne({ _id: id, userId });
    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }

    if (description !== undefined) expense.description = description;
    if (category !== undefined) expense.category = category;
    if (date !== undefined) expense.date = new Date(date);

    const inputCurrency = currency || originalCurrency;
    const isAmountUpdated = amount !== undefined && parseFloat(amount) !== expense.originalAmount;
    const isCurrencyUpdated = inputCurrency !== undefined && inputCurrency !== expense.originalCurrency;

    if (isAmountUpdated || isCurrencyUpdated || expense.originalAmount === undefined) {
      const finalAmount = amount !== undefined ? parseFloat(amount) : (expense.originalAmount != null ? expense.originalAmount : expense.amount);
      const finalCurrency = inputCurrency !== undefined ? inputCurrency : (expense.originalCurrency || expense.baseCurrency || req.user.preferredCurrency || "INR");
      const baseCurrency = expense.baseCurrency || req.user.preferredCurrency || "INR";

      const rate = await getExchangeRate(finalCurrency, baseCurrency);
      expense.originalAmount = finalAmount;
      expense.originalCurrency = finalCurrency;
      expense.conversionRate = rate;
      expense.amount = finalAmount * rate;
      expense.baseCurrency = baseCurrency;
    }

    await expense.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Expense updated successfully",
        data: expense,
      });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

//to delete expense
export async function deleteExpense(req, res) {
  try {
    const expense = await expenseModel.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
// to download expense data
export async function downloadExpenseExcel(req, res) {
  const userId = req.user._id;
  try {
    const expense = await expenseModel.find({ userId }).sort({ date: -1 });
    const plainData = expense.map((exp) => ({
      Description: exp.description,
      "Base Currency Amount": exp.amount,
      "Base Currency": exp.baseCurrency || "INR",
      "Original Amount": exp.originalAmount != null ? exp.originalAmount : exp.amount,
      "Original Currency": exp.originalCurrency || exp.baseCurrency || "INR",
      "Exchange Rate": exp.conversionRate != null ? exp.conversionRate : 1.0,
      Category: exp.category,
      Date: new Date(exp.date).toLocaleDateString(),
    }));
    const worksheet = XLSX.utils.json_to_sheet(plainData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "expenseModel");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    res.setHeader("Content-Disposition", 'attachment; filename="expense_details.xlsx"');
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);

  } catch (error) {
    console.error("Error downloading expense data:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
// to get overview of expense
export async function getExpenseOverview(req, res) {
  try {
    const userId = req.user._id;
    const { range = "monthly" } = req.query;
    const { start, end } = getDateRange(range);
    const expense = await expenseModel
      .find({
        userId,
        date: { $gte: start, $lte: end },
      })
      .sort({ date: -1 });

    const totalExpense = expense.reduce((acc, cur) => acc + cur.amount, 0);
    const averageExpense =
      expense.length > 0 ? totalExpense / expense.length : 0;
    const numberOfTransactions = expense.length;

    const recentTransactions = expense.slice(0, 5);
    res.status(200).json({
      success: true,
      data: {
        totalExpense,
        averageExpense,
        numberOfTransactions,
        recentTransactions,
        range,
      },
    });
  } catch (error) {
    console.error("Error fetching expense overview:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
