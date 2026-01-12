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
  Info,
} from "lucide-react";
import {
  StaffSignalResponse,
  StaffSignalCreateRequest,
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
  take_profits: [""],
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
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    setSubmitError(null);
  }, [editSignal, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    setSubmitError(null);
  };

  const handleTpChange = (index: number, value: string) => {
    const newTps = [...formData.take_profits];
    newTps[index] = value;
    setFormData((prev) => ({ ...prev, take_profits: newTps }));
    // Clear TP error when user types
    if (errors[`tp_${index}`] || errors.take_profits) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`tp_${index}`];
        delete newErrors.take_profits;
        return newErrors;
      });
    }
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
      // Clear any errors for removed TP
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`tp_${index}`];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Symbol validation
    if (!formData.symbol.trim()) {
      newErrors.symbol = "Symbol is required";
    }

    // Current price validation
    const currentPrice = parseFloat(formData.current_price);
    if (!formData.current_price || isNaN(currentPrice) || currentPrice <= 0) {
      newErrors.current_price = "Enter a valid current price";
    }

    // Entry price validation
    const entryPrice = parseFloat(formData.entry_price);
    if (!formData.entry_price || isNaN(entryPrice) || entryPrice <= 0) {
      newErrors.entry_price = "Enter a valid entry price";
    }

    // Stop loss validation
    const stopLoss = parseFloat(formData.stop_loss);
    if (!formData.stop_loss || isNaN(stopLoss) || stopLoss <= 0) {
      newErrors.stop_loss = "Enter a valid stop loss";
    }

    // Get valid (non-empty) take profits
    const validTps = formData.take_profits
      .map((tp, index) => ({ value: tp, index }))
      .filter((tp) => tp.value.trim() !== "");

    // Check at least one TP exists
    if (validTps.length === 0) {
      newErrors.take_profits = "At least one take profit is required";
    }

    // Validate price logic only if we have valid numbers
    if (!isNaN(entryPrice) && entryPrice > 0 && !isNaN(stopLoss) && stopLoss > 0) {
      const isBuy = formData.position_type === "buy";

      // Stop loss validation based on position type
      if (isBuy && stopLoss >= entryPrice) {
        newErrors.stop_loss = "Stop loss must be below entry price for BUY";
      } else if (!isBuy && stopLoss <= entryPrice) {
        newErrors.stop_loss = "Stop loss must be above entry price for SELL";
      }

      // Validate each non-empty TP
      validTps.forEach(({ value, index }) => {
        const tpPrice = parseFloat(value);
        if (isNaN(tpPrice) || tpPrice <= 0) {
          newErrors[`tp_${index}`] = "Enter a valid price";
        } else if (isBuy && tpPrice <= entryPrice) {
          newErrors[`tp_${index}`] = "Must be above entry price";
        } else if (!isBuy && tpPrice >= entryPrice) {
          newErrors[`tp_${index}`] = "Must be below entry price";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    // Filter only non-empty TPs
    const validTps = formData.take_profits
      .filter((tp) => tp.trim() !== "" && !isNaN(parseFloat(tp)))
      .map((tp) => parseFloat(tp));

    const submitData: StaffSignalCreateRequest = {
      symbol: formData.symbol.toUpperCase().trim(),
      position_type: formData.position_type,
      order_type: formData.order_type,
      current_price: parseFloat(formData.current_price),
      entry_price: parseFloat(formData.entry_price),
      stop_loss: parseFloat(formData.stop_loss),
      take_profits: validTps,
      leverage: parseFloat(formData.leverage) || 1,
      notes: formData.notes.trim() || undefined,
      expires_in_hours: parseInt(formData.expires_in_hours) || 24,
      risk_percentage: formData.risk_percentage
        ? parseFloat(formData.risk_percentage)
        : undefined,
    };

    try {
      await onSubmit(submitData);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || err?.message || "Failed to create signal";
      setSubmitError(errorMessage);
    }
  };

  // Calculate risk/reward ratio
  const calculateRR = (): string | null => {
    const entry = parseFloat(formData.entry_price);
    const sl = parseFloat(formData.stop_loss);
    const firstTp = formData.take_profits.find((tp) => tp.trim() !== "");
    const tp = firstTp ? parseFloat(firstTp) : NaN;

    if (isNaN(entry) || isNaN(sl) || isNaN(tp) || entry === sl) {
      return null;
    }

    const risk = Math.abs(entry - sl);
    const reward = Math.abs(tp - entry);
    const rr = reward / risk;

    return rr.toFixed(2);
  };

  const rrRatio = calculateRR();

  if (!isOpen) return null;

  const hasErrors = Object.keys(errors).length > 0;

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
          <div>
            <h2 className="text-xl font-bold text-white">
              {isEditMode ? "Edit Signal" : "Create New Signal"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {formData.position_type === "buy" ? "Long Position" : "Short Position"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Global Error Banner */}
        {(submitError || hasErrors) && (
          <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-400">
                  {submitError || "Please fix the errors below"}
                </p>
                {hasErrors && !submitError && (
                  <ul className="mt-1 text-xs text-red-400/80 list-disc list-inside">
                    {Object.values(errors).slice(0, 3).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                    {Object.keys(errors).length > 3 && (
                      <li>...and {Object.keys(errors).length - 3} more</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Symbol & Position Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Symbol <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={handleInputChange}
                placeholder="e.g. BTCUSDT"
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors uppercase ${
                  errors.symbol
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-700 focus:border-cyan-500"
                }`}
              />
              {errors.symbol && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.symbol}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Position Type <span className="text-red-400">*</span>
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
                Order Type
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
              <div className="relative">
                <input
                  type="number"
                  name="leverage"
                  value={formData.leverage}
                  onChange={handleInputChange}
                  min="1"
                  max="125"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  x
                </span>
              </div>
            </div>
          </div>

          {/* Prices */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Prices <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="text-xs text-gray-500 mb-1.5">Current Price</div>
                <input
                  type="number"
                  name="current_price"
                  value={formData.current_price}
                  onChange={handleInputChange}
                  step="any"
                  placeholder="0.00"
                  className={`w-full px-3 py-2.5 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${
                    errors.current_price
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-700 focus:border-cyan-500"
                  }`}
                />
                {errors.current_price && (
                  <p className="mt-1 text-xs text-red-400">{errors.current_price}</p>
                )}
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1.5">Entry Price</div>
                <input
                  type="number"
                  name="entry_price"
                  value={formData.entry_price}
                  onChange={handleInputChange}
                  step="any"
                  placeholder="0.00"
                  className={`w-full px-3 py-2.5 bg-gray-800 border rounded-lg text-cyan-400 placeholder-gray-500 focus:outline-none transition-colors ${
                    errors.entry_price
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-700 focus:border-cyan-500"
                  }`}
                />
                {errors.entry_price && (
                  <p className="mt-1 text-xs text-red-400">{errors.entry_price}</p>
                )}
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1.5">Stop Loss</div>
                <input
                  type="number"
                  name="stop_loss"
                  value={formData.stop_loss}
                  onChange={handleInputChange}
                  step="any"
                  placeholder="0.00"
                  className={`w-full px-3 py-2.5 bg-gray-800 border rounded-lg text-red-400 placeholder-gray-500 focus:outline-none transition-colors ${
                    errors.stop_loss
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-700 focus:border-red-500/50"
                  }`}
                />
                {errors.stop_loss && (
                  <p className="mt-1 text-xs text-red-400">{errors.stop_loss}</p>
                )}
              </div>
            </div>

            {/* Price hint */}
            <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
              <Info size={12} />
              <span>
                {formData.position_type === "buy"
                  ? "For BUY: Stop Loss < Entry < Take Profits"
                  : "For SELL: Take Profits < Entry < Stop Loss"}
              </span>
            </div>
          </div>

          {/* Take Profits */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-400">
                Take Profits <span className="text-red-400">*</span>
              </label>
              <button
                type="button"
                onClick={addTpField}
                disabled={formData.take_profits.length >= 10}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors px-2 py-1 rounded hover:bg-cyan-500/10"
              >
                <Plus size={14} /> Add TP Level
              </button>
            </div>

            {errors.take_profits && (
              <p className="mb-2 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.take_profits}
              </p>
            )}

            <div className="space-y-2">
              {formData.take_profits.map((tp, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-12 text-xs text-gray-500 font-medium">
                    TP {index + 1}
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={tp}
                      onChange={(e) => handleTpChange(index, e.target.value)}
                      step="any"
                      placeholder={`Take profit ${index + 1} price`}
                      className={`w-full px-3 py-2.5 bg-gray-800 border rounded-lg text-green-400 placeholder-gray-600 focus:outline-none transition-colors ${
                        errors[`tp_${index}`]
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-700 focus:border-green-500/50"
                      }`}
                    />
                  </div>
                  {formData.take_profits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTpField(index)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  {errors[`tp_${index}`] && (
                    <span className="text-xs text-red-400 min-w-[120px]">
                      {errors[`tp_${index}`]}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* R:R Display */}
            {rrRatio && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-gray-500">Risk:Reward Ratio</span>
                <span
                  className={`text-sm font-bold ${
                    parseFloat(rrRatio) >= 2
                      ? "text-green-400"
                      : parseFloat(rrRatio) >= 1
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  1:{rrRatio}
                </span>
              </div>
            )}
          </div>

          {/* Optional Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Expires In
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="expires_in_hours"
                  value={formData.expires_in_hours}
                  onChange={handleInputChange}
                  min="1"
                  max="720"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  hours
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Risk Percentage
              </label>
              <div className="relative">
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
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  %
                </span>
              </div>
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

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg text-white font-medium hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
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