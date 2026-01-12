// ============================================================================
// FILE: src/pages/billing/PaymentPartial.tsx
// ============================================================================
/**
 * Partial Payment Page
 * 
 * Users are redirected here when they send less than the required amount.
 * Shows how much was received and options to complete payment.
 */

import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, Send, ArrowLeft, Clock } from 'lucide-react';

const PaymentPartial: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const paymentId = searchParams.get('NP_id') || searchParams.get('payment_id');
  const amountPaid = searchParams.get('actually_paid') || '0';
  const amountRequired = searchParams.get('pay_amount') || '0';
  const currency = searchParams.get('pay_currency') || 'BTC';
  
  const remaining = (parseFloat(amountRequired) - parseFloat(amountPaid)).toFixed(8);
  const percentComplete = parseFloat(amountRequired) > 0 
    ? (parseFloat(amountPaid) / parseFloat(amountRequired)) * 100 
    : 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Partial Payment Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center">
          {/* Warning Icon */}
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-yellow-500" />
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-2">
            Partial Payment Received
          </h1>
          
          <p className="text-gray-400 mb-6">
            We received part of your payment. Please send the remaining amount to complete your purchase.
          </p>
          
          {/* Payment Status */}
          <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-gray-500 text-xs uppercase mb-1">Received</p>
                <p className="text-green-400 font-semibold">
                  {amountPaid} {currency.toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase mb-1">Required</p>
                <p className="text-gray-300 font-semibold">
                  {amountRequired} {currency.toUpperCase()}
                </p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
                  style={{ width: `${Math.min(percentComplete, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {percentComplete.toFixed(1)}% complete
              </p>
            </div>
          </div>
          
          {/* Remaining Amount */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-yellow-400 text-sm font-medium">Remaining Amount</p>
                <p className="text-2xl font-bold text-white">
                  {remaining} <span className="text-sm text-gray-400">{currency.toUpperCase()}</span>
                </p>
              </div>
              <Send className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          {/* Time Warning */}
          <div className="flex items-center justify-center gap-2 text-yellow-400 text-sm mb-6">
            <Clock className="w-4 h-4" />
            <span>Send remaining amount to the same address</span>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard/billing')}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              View Payment Details
            </button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
        
        {/* Info Notice */}
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 mt-4 text-sm text-gray-400">
          <p>
            <strong className="text-gray-300">Note:</strong> Once you send the remaining amount, 
            your subscription will be activated automatically. No need to create a new payment.
          </p>
        </div>
        
        {/* Support Link */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Need help?{' '}
          <a href="/contact" className="text-purple-400 hover:text-purple-300">
            Contact Support
          </a>
          {paymentId && (
            <span className="block mt-1 text-xs">
              Reference: {paymentId}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default PaymentPartial;
