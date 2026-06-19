import React, { useState } from "react";
import { transactionItemStyles } from "../assets/dummyStyles.js";
import { colorClasses } from "../assets/color.jsx";
import { DollarSign, Edit, Save, Trash2, X } from "lucide-react";
import { formatCurrency } from "../utils/currencyHelper.js";

const TransactionItem = ({
  transaction,
  isEditing,
  editForm,
  setEditForm,
  onSave,
  onCancel,
  onDelete,
  type = "expense",
  categoryIcons,
  setEditingId,
  amountClass = "font-bold truncate block text-right",
  iconClass = "p-3 rounded-xl flex-shrink-0",
}) => {
  const [errors, setErrors] = useState({ description: "", amount: "" });

  const classes = colorClasses[type];
  const sign = type === "income" ? "+" : "-";

  const validate = () => {
    const nextErrors = { description: "", amount: "" };
    const desc = String(editForm.description ?? "").trim();
    const amtRaw = editForm.amount;
    const amt =
      amtRaw === "" || amtRaw === null || amtRaw === undefined
        ? ""
        : String(amtRaw).trim();

    if (!desc) {
      nextErrors.description = "Description is required.";
    }

    if (amt === "") {
      nextErrors.amount = "Amount is required.";
    } else if (Number(amt) <= 0) {
      nextErrors.amount = "Amount must be greater than 0.";
    }

    setErrors(nextErrors);
    return !nextErrors.description && !nextErrors.amount;
  };

  const handleSaveClick = () => {
    if (validate()) {
      setErrors({ description: "", amount: "" });
      onSave();
    }
  }; //to save desc and amount

  return (
    <div className={transactionItemStyles.container(isEditing, classes)}>
      <div className={transactionItemStyles.mainContainer}>
        <div
          className={transactionItemStyles.iconContainer(iconClass, classes)}
        >
          {categoryIcons[transaction.category] || (
            <DollarSign className="w-5 h-5" />
          )}
        </div>
        <div className={transactionItemStyles.contentContainer}>
          {isEditing ? (
            <>
              <input
                type="text"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className={transactionItemStyles.input(
                  !!errors.description,
                  classes,
                )}
              />
              {errors.description && (
                <p
                  className={transactionItemStyles.errorText}
                  id={`desc-error-${transaction.id}`}
                >
                  {errors.description}
                </p>
              )}
            </>
          ) : (
            <p className={transactionItemStyles.description}>
              {transaction.description}
            </p>
          )}
          <p className={transactionItemStyles.details}>
            {new Date(transaction.date).toLocaleDateString()} •{" "}
            {transaction.category}
          </p>
        </div>
      </div>
      <div className={transactionItemStyles.actionsContainer}>
        <div className={transactionItemStyles.amountContainer}>
          {isEditing ? (
            <>
              <input
                type="number"
                value={editForm.amount}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, amount: e.target.value }))
                }
                className={transactionItemStyles.amountInput(
                  !!errors.amount,
                  classes,
                )}
                placeholder="Amount"
              />
              <select
                value={editForm.currency || "INR"}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, currency: e.target.value }))
                }
                className="mt-1 block w-full text-xs border border-gray-200 bg-white rounded-lg p-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CAD">CAD (CA$)</option>
                <option value="AUD">AUD (A$)</option>
              </select>
              {errors.amount && (
                <p
                  id={`amt-error-${transaction.id}`}
                  className={transactionItemStyles.errorText}
                >
                  {errors.amount}
                </p>
              )}
            </>
          ) : (
            <div className="flex flex-col items-end">
              <span
                className={transactionItemStyles.amountText(amountClass, classes)}
              >
                {sign}{formatCurrency(transaction.amount, transaction.baseCurrency || "INR")}
              </span>
              {transaction.originalCurrency && transaction.baseCurrency && transaction.originalCurrency.toUpperCase() !== transaction.baseCurrency.toUpperCase() && (
                <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
                  ({formatCurrency(transaction.originalAmount != null ? transaction.originalAmount : transaction.amount, transaction.originalCurrency)})
                </span>
              )}
            </div>
          )}
        </div>

        <div className={transactionItemStyles.buttonsContainer}>
          {isEditing ? (
            <>
              <button
                onClick={handleSaveClick}
                className={transactionItemStyles.saveButton(classes)}
                title="Save"
              >
                <Save size={16} />
              </button>

              <button
                onClick={() => {
                  setErrors({ description: "", amount: "" });
                  onCancel();
                }}
                className={transactionItemStyles.cancelButton}
                title="Cancel"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setEditForm({
                    description: transaction.description ?? "",
                    amount: transaction.originalAmount != null ? transaction.originalAmount : (transaction.amount ?? ""),
                    currency: transaction.originalCurrency || transaction.baseCurrency || "INR",
                    category: transaction.category ?? "",
                    date: transaction.date ?? "",
                    type: transaction.type ?? "expense",
                  });
                  setErrors({ description: "", amount: "" });
                  setEditingId(transaction.id);
                }}
                className={transactionItemStyles.editButton(classes)}
                title="Edit"
              >
                <Edit size={16} />
              </button>

              <button
                onClick={() => onDelete(transaction.id)}
                className={transactionItemStyles.deleteButton(classes)}
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
