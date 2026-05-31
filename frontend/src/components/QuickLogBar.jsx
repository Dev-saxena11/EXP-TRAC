import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, X, Check, Loader2, Calendar, DollarSign, Tag, FileText, ArrowRight } from 'lucide-react';
import { API_URL } from '../config.js';

const API_BASE = `${API_URL}/api`;

const CATEGORIES = [
  "Food",
  "Housing",
  "Transport",
  "Shopping",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Salary",
  "Freelance",
  "Savings",
  "Other"
];

const QuickLogBar = ({ onTransactionAdded }) => {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Parsed transaction state (for preview/verification)
  const [parsedData, setParsedData] = useState(null);
  const [saving, setSaving] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleParse = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    setError(null);
    setParsedData(null);

    const clientDate = new Date().toISOString().split("T")[0];

    try {
      const response = await axios.post(
        `${API_BASE}/ai/parse`,
        { text: inputText, clientDate },
        { headers: getHeaders() }
      );

      if (response.data?.success && response.data?.data) {
        setParsedData(response.data.data);
      } else {
        setError(response.data?.message || "Failed to parse query.");
      }
    } catch (err) {
      console.error("AI Parsing failed:", err);
      setError(
        err.response?.data?.message || 
        "Failed to connect to the AI service. Please make sure GEMINI_API_KEY is configured."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setParsedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirmSave = async () => {
    if (!parsedData) return;
    
    // Validations
    if (!parsedData.description.trim()) return alert("Description is required");
    if (!parsedData.amount || Number(parsedData.amount) <= 0) return alert("Amount must be positive");
    if (!parsedData.date) return alert("Date is required");

    setSaving(true);
    try {
      const endpoint = parsedData.type === "income" ? "income/add" : "expense/add";
      const payload = {
        description: parsedData.description,
        amount: Number(parsedData.amount),
        category: parsedData.category,
        date: parsedData.date
      };

      const res = await axios.post(`${API_BASE}/${endpoint}`, payload, {
        headers: getHeaders()
      });

      if (res.data?.success) {
        // Clear input and modal
        setInputText("");
        setParsedData(null);
        // Trigger dashboard/page refresh
        if (onTransactionAdded) {
          onTransactionAdded();
        }
      } else {
        alert(res.data?.message || "Failed to save transaction.");
      }
    } catch (err) {
      console.error("Saving parsed transaction failed:", err);
      alert(err.response?.data?.message || "Failed to save transaction.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full mb-6">
      {/* Quick Log Input Form */}
      <form onSubmit={handleParse} className="relative">
        <div className="relative flex items-center bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm transition-all focus-within:border-teal-500/50 focus-within:shadow-md focus-within:bg-white/60 p-1.5 pr-2 gap-2">
          
          <div className="flex items-center pl-3 text-teal-600/80">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          <input
            type="text"
            placeholder="Type here to log with AI... (e.g., 'Spent $15 on pizza yesterday')"
            className="flex-1 bg-transparent border-0 outline-none text-gray-800 placeholder-gray-500/70 py-2.5 text-sm md:text-base w-full focus:ring-0"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="flex items-center gap-1.5 bg-linear-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-4 py-2.5 rounded-xl transition-all shadow font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Log with AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error banner */}
      {error && (
        <div className="mt-2.5 p-3.5 bg-orange-50 border border-orange-200 text-orange-800 rounded-xl text-xs md:text-sm flex items-start gap-2 shadow-sm animate-fadeIn">
          <span className="font-semibold">Notice:</span>
          <span>{error}</span>
        </div>
      )}

      {/* Verification / Confirmation Card Overlay */}
      {parsedData && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Verify AI Extraction</h3>
                  <p className="text-xs text-gray-500">Tweak details if anything is off</p>
                </div>
              </div>
              <button 
                onClick={() => setParsedData(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Editable Form */}
            <div className="space-y-4">
              
              {/* Type Switcher */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => handleFieldChange("type", "expense")}
                  className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all ${
                    parsedData.type === "expense"
                      ? "bg-orange-500 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => handleFieldChange("type", "income")}
                  className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all ${
                    parsedData.type === "income"
                      ? "bg-teal-500 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Income
                </button>
              </div>

              {/* Description Input */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Description
                </label>
                <input
                  type="text"
                  value={parsedData.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  placeholder="e.g., Grocery shopping"
                />
              </div>

              {/* Amount & Date Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Amount */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" /> Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={parsedData.amount}
                    onChange={(e) => handleFieldChange("amount", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                    placeholder="0.00"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Date
                  </label>
                  <input
                    type="date"
                    value={parsedData.date}
                    onChange={(e) => handleFieldChange("date", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Category
                </label>
                <select
                  value={parsedData.category}
                  onChange={(e) => handleFieldChange("category", e.target.value)}
                  className="w-full border border-gray-200 bg-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 appearance-none cursor-pointer"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setParsedData(null)}
                className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                className={`flex-1 py-3 text-white font-semibold rounded-xl text-sm shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  parsedData.type === "income"
                    ? "bg-teal-500 hover:bg-teal-600"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm & Save</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default QuickLogBar;
