import incomeModel from "../models/incomeModel.js";
import XLSX from "xlsx";
import getDateRange from "../utils/dateFilter.js";
import { getExchangeRate } from "../utils/currency.js";

//add income
export async function addIncome(req, res) {
    const userId = req.user._id
    const { description, amount, category, date, currency, originalCurrency } = req.body
    try {
        if (!description || !amount || !category || !date) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const finalCurrency = currency || originalCurrency || req.user.preferredCurrency || "INR";
        const baseCurrency = req.user.preferredCurrency || "INR";
        const originalAmount = parseFloat(amount);

        const rate = await getExchangeRate(finalCurrency, baseCurrency);
        const convertedAmount = originalAmount * rate;

        const newIncome = new incomeModel({
            description,
            amount: convertedAmount,
            originalAmount,
            originalCurrency: finalCurrency,
            conversionRate: rate,
            baseCurrency,
            category,
            date: new Date(date),
            userId
        });
        await newIncome.save();
        res.status(201).json({ success: true, message: "Income added successfully" });
    } catch (error) {
        console.error("Error adding income:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}
//to get income(all)
export async function getAllIncome(req, res) {
    const userId = req.user._id
    try {
        const income = await incomeModel.find({ userId }).sort({ date: -1 });
        res.status(200).json({ success: true, income });
    } catch (error) {
        console.error("Error fetching incomes:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

//update income 
export async function updateIncome(req, res) {
    const { id } = req.params;
    const userId = req.user._id;
    const { description, amount, category, date, currency, originalCurrency } = req.body;
    try {
        const income = await incomeModel.findOne({ _id: id, userId });
        if (!income) {
            return res.status(404).json({ success: false, message: "Income not found" });
        }

        if (description !== undefined) income.description = description;
        if (category !== undefined) income.category = category;
        if (date !== undefined) income.date = new Date(date);

        const inputCurrency = currency || originalCurrency;
        const isAmountUpdated = amount !== undefined && parseFloat(amount) !== income.originalAmount;
        const isCurrencyUpdated = inputCurrency !== undefined && inputCurrency !== income.originalCurrency;

        if (isAmountUpdated || isCurrencyUpdated || income.originalAmount === undefined) {
            const finalAmount = amount !== undefined ? parseFloat(amount) : (income.originalAmount != null ? income.originalAmount : income.amount);
            const finalCurrency = inputCurrency !== undefined ? inputCurrency : (income.originalCurrency || income.baseCurrency || req.user.preferredCurrency || "INR");
            const baseCurrency = income.baseCurrency || req.user.preferredCurrency || "INR";

            const rate = await getExchangeRate(finalCurrency, baseCurrency);
            income.originalAmount = finalAmount;
            income.originalCurrency = finalCurrency;
            income.conversionRate = rate;
            income.amount = finalAmount * rate;
            income.baseCurrency = baseCurrency;
        }

        await income.save();

        res.status(200).json({ success: true, message: "Income updated successfully", data: income });

    } catch (error) {
        console.error("Error updating income:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

//to delete income
export async function deleteIncome(req, res) {
    try {
        const income = await incomeModel.findByIdAndDelete({ _id: req.params.id });
        if (!income) {
            return res.status(404).json({ success: false, message: "Income not found" });
        }
        res.status(200).json({ success: true, message: "Income deleted successfully" });

    } catch (error) {
        console.error("Error deleting income:", error);
        return res.status(500).json({ success: false, message: "Server error" });

    }
}

//to download data in excel sheet
export async function downloadIncomeExcel(req, res) {
    const userId = req.user._id;
    try {
        const income = await incomeModel.find({ userId }).sort({ date: -1 });
        const plainData = income.map((inc) => ({
            Description: inc.description,
            "Base Currency Amount": inc.amount,
            "Base Currency": inc.baseCurrency || "INR",
            "Original Amount": inc.originalAmount != null ? inc.originalAmount : inc.amount,
            "Original Currency": inc.originalCurrency || inc.baseCurrency || "INR",
            "Exchange Rate": inc.conversionRate != null ? inc.conversionRate : 1.0,
            Category: inc.category,
            Date: new Date(inc.date).toLocaleDateString()
        }));
        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "incomeModel");
        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
        res.setHeader("Content-Disposition", 'attachment; filename="income_details.xlsx"');
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(buffer);


    } catch (error) {
        console.error("Error downloading income data:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}
//to get income overview
export async function getIncomeOverview(req, res) {
    try {
        const userId = req.user._id;
        const { range = "monthly" } = req.query;
        const { start, end } = getDateRange(range);
        const incomes = await incomeModel.find({
            userId,
            date: { $gte: start, $lte: end },
        }).sort({ date: -1 });
        const totalIncome = incomes.reduce((acc, cur) => acc + cur.amount, 0);
        const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;
        const numberOfTransactions = incomes.length;

        const recentTransactions = incomes.slice(0, 9);
        res.status(200).json({
            success: true,
            data: {
                totalIncome,
                averageIncome,
                numberOfTransactions,
                recentTransactions,
                range
            }
        });

    } catch (error) {
        console.error("Error fetching income overview:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}