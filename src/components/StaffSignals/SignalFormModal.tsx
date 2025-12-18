// ============================================================================
// FILE: src/components/StaffSignals/SignalFormModal.tsx
// ============================================================================

import React, { useState, useEffect } from "react";
import {
  X,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import {
  StaffSignalResponse,
  StaffSignalCreateRequest,
  StaffSignalUpdateRequest,
  PositionType,
  OrderType,
} from "../../types/staffSignals.types";

interface SignalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StaffSignalCreateRequest) => Promise<void>;
  editSignal?: StaffSignalResponse | null;
  isLoading?: boolean;
}

interface FormData {
  symbol: string;
  position_type: PositionType;
  order_type: OrderType;
  current_price: string;
  entry_price: string;
  stop_loss: string;
  take_profits: string[];
  leverage: string;
  notes: string;
  expires_in_hours: string;
  risk_percentage: string;
}

const initialFormData: FormData = {
  symbol: "",
  position_type: "buy",
  order_type: "limit",
  current_price: "",
  entry_price: "",
  stop_loss: "",
  take_profits: ["", "", "", ""],
  leverage: "10",
  notes: "",
  expires_in_hours: "24",
  risk_percentage: "",
};

const SignalFormModal: React.FC<SignalFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editSignal,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = !!editSignal;

  useEffect(() => {
    if (editSignal) {
      setFormData({
        symbol: editSignal.symbol,
        position_type: editSignal.position_type as PositionType,
        order_type: editSignal.order_type as OrderType,
        current_price: editSignal.current_price.toString(),
        entry_price: editSignal.entry_price.toString(),
        stop_loss: editSignal.stop_loss.toString(),
        take_profits: editSignal.take_profits.map((tp) => tp.price.toString()),
        leverage: editSignal.leverage.toString(),
        notes: editSignal.notes || "",
        expires_in_hours: "24",
        risk_percentage: editSignal.risk_percentage?.toString() || "",
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [editSignal, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTpChange = (index: number, value: string) => {
    const newTps = [...formData.take_profits];
    newTps[index] = value;
    setFormData((prev) => ({ ...prev, take_profits: newTps }));
  };

  const addTpField = () => {
    if (formData.take_profits.length < 10) {
      setFormData((prev) => ({
        ...prev,
        take_profits: [...prev.take_profits, ""],
      }));
    }
  };

  const removeTpField = (index: number) => {
    if (formData.take_profits.length > 1) {
      const newTps = formData.take_profits.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, take_profits: newTps }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.symbol.trim()) {
      newErrors.symbol = "Symbol is required";
    }

    if (
      !formData.current_price ||
      isNaN(parseFloat(formData.current_price)) ||
      parseFloat(formData.current_price) <= 0
    ) {
      newErrors.current_price = "Valid current price is required";
    }

    if (
      !formData.entry_price ||
      isNaN(parseFloat(formData.entry_price)) ||
      parseFloat(formData.entry_price) <= 0
    ) {
      newErrors.entry_price = "Valid entry price is required";
    }

    if (
      !formData.stop_loss ||
      isNaN(parseFloat(formData.stop_loss)) ||
      parseFloat(formData.stop_loss) <= 0
    ) {
      newErrors.stop_loss = "Valid stop loss is required";
    }

    // Validate at least one TP
    const validTps = formData.take_profits.filter(
      (tp) => tp && !isNaN(parseFloat(tp)) && parseFloat(tp) > 0
    );
    if (validTps.length === 0) {
      newErrors.take_profits = "At least one take profit is required";
    }

    // Validate price logic
    const entry = parseFloat(formData.entry_price);
    const sl = parseFloat(formData.stop_loss);

    if (!isNaN(entry) && !isNaN(sl)) {
      if (formData.position_type === "buy") {
        if (sl >= entry) {
          newErrors.stop_loss = "Stop loss must be below entry for BUY";
        }
        validTps.forEach((tp, idx) => {
          const tpPrice = parseFloat(tp);
          if (tpPrice <= entry) {
            newErrors[`tp_${idx}`] = "TP must be above entry for BUY";
          }
        });
      } else {
        if (sl <= entry) {
          newErrors.stop_loss = "Stop loss must be above entry for SELL";
        }
        validTps.forEach((tp, idx) => {
          const tpPrice = parseFloat(tp);
          if (tpPrice >= entry) {
            newErrors[`tp_${idx}`] = "TP must be below entry for SELL";
          }
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const validTps = formData.take_profits
      .filter((tp) => tp && !isNaN(parseFloat(tp)))
      .map((tp) => parseFloat(tp));

    const submitData: StaffSignalCreateRequest = {
      symbol: formData.symbol.toUpperCase(),
      position_type: formData.position_type,
      order_type: formData.order_type,
      current_price: parseFloat(formData.current_price),
      entry_price: parseFloat(formData.entry_price),
      stop_loss: parseFloat(formData.stop_loss),
      take_profits: validTps,
      leverage: parseFloat(formData.leverage) || 1,
      notes: formData.notes || undefined,
      expires_in_hours: parseInt(formData.expires_in_hours) || 24,
      risk_percentage: formData.risk_percentage
        ? parseFloat(formData.risk_percentage)
        : undefined,
    };

    await onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl m-4">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white">
            {isEditMode ? "Edit Signal" : "Create New Signal"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Symbol & Position Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Symbol *
              </label>
              <input
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={handleInputChange}
                placeholder="e.g. BTCUSDT"
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors ${
                  errors.symbol ? "border-red-500" : "border-gray-700"
                }`}
              />
              {errors.symbol && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.symbol}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Position Type *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, position_type: "buy" }))
                  }
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border font-medium transition-all ${
                    formData.position_type === "buy"
                      ? "bg-green-500/20 border-green-500 text-green-400"
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                  }`}
                >
                  <TrendingUp size={18} /> BUY
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, position_type: "sell" }))
                  }
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border font-medium transition-all ${
                    formData.position_type === "sell"
                      ? "bg-red-500/20 border-red-500 text-red-400"
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                  }`}
                >
                  <TrendingDown size={18} /> SELL
                </button>
              </div>
            </div>
          </div>

          {/* Order Type & Leverage */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Order Type *
              </label>
              <select
                name="order_type"
                value={formData.order_type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="limit">LIMIT</option>
                <option value="market">MARKET</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Leverage
              </label>
              <input
                type="number"
                name="leverage"
                value={formData.leverage}
                onChange={handleInputChange}
                min="1"
                max="125"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Current Price *
              </label>
              <input
                type="number"
                name="current_price"
                value={formData.current_price}
                onChange={handleInputChange}
                step="any"
                placeholder="0.00"
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors ${
                  errors.current_price ? "border-red-500" : "border-gray-700"
                }`}
              />
              {errors.current_price && (
                <p className="mt-1 text-xs text-red-400">{errors.current_price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Entry Price *
              </label>
              <input
                type="number"
                name="entry_price"
                value={formData.entry_price}
                onChange={handleInputChange}
                step="any"
                placeholder="0.00"
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors ${
                  errors.entry_price ? "border-red-500" : "border-gray-700"
                }`}
              />
              {errors.entry_price && (
                <p className="mt-1 text-xs text-red-400">{errors.entry_price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Stop Loss *
              </label>
              <input
                type="number"
                name="stop_loss"
                value={formData.stop_loss}
                onChange={handleInputChange}
                step="any"
                placeholder="0.00"
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-red-400 placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors ${
                  errors.stop_loss ? "border-red-500" : "border-gray-700"
                }`}
              />
              {errors.stop_loss && (
                <p className="mt-1 text-xs text-red-400">{errors.stop_loss}</p>
              )}
            </div>
          </div>

          {/* Take Profits */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-400">
                Take Profits *
              </label>
              <button
                type="button"
                onClick={addTpField}
                disabled={formData.take_profits.length >= 10}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={14} /> Add TP
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {formData.take_profits.map((tp, index) => (
                <div key={index} className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                    TP{index + 1}
                  </div>
                  <input
                    type="number"
                    value={tp}
                    onChange={(e) => handleTpChange(index, e.target.value)}
                    step="any"
                    placeholder="0.00"
                    className={`w-full pl-12 pr-10 py-3 bg-gray-800 border rounded-lg text-cyan-400 placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors ${
                      errors[`tp_${index}`] ? "border-red-500" : "border-gray-700"
                    }`}
                  />
                  {formData.take_profits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTpField(index)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.take_profits && (
              <p className="mt-1 text-xs text-red-400">{errors.take_profits}</p>
            )}
          </div>

          {/* Optional Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Expires In (hours)
              </label>
              <input
                type="number"
                name="expires_in_hours"
                value={formData.expires_in_hours}
                onChange={handleInputChange}
                min="1"
                max="720"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Risk % (optional)
              </label>
              <input
                type="number"
                name="risk_percentage"
                value={formData.risk_percentage}
                onChange={handleInputChange}
                step="0.1"
                min="0.1"
                max="100"
                placeholder="e.g. 2"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Notes / Analysis
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Add your analysis or notes here..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 font-medium hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg text-white font-medium hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Update Signal"
              ) : (
                "Create Signal"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignalFormModal;