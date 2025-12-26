// ============================================================================
// FILE: src/pages/billing/PaymentFailed.tsx
// ============================================================================
/**
 * Payment Failed Page
 * 
 * Users are redirected here when payment fails or expires on NOWPayments.
 * Shows error info and options to retry.
 */

import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, RefreshCw, ArrowLeft, AlertTriangle } from 'lucide-react';

const PaymentFailed: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const paymentId = searchParams.get('NP_id') || searchParams.get('payment_id');
  const errorMessage = searchParams.get('error') || 'Payment could not be completed';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Failed Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-2">
            Payment Failed
          </h1>
          
          <p className="text-gray-400 mb-6">
            Unfortunately, your payment could not be processed.
          </p>
          
          {/* Error Details */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-400 font-medium mb-1">What happened?</h3>
                <p className="text-sm text-gray-400">{errorMessage}</p>
              </div>
            </div>
          </div>
          
          {/* Common Reasons */}
          <div className="bg-gray-900/50 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Common reasons:</h3>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Payment window expired (1 hour limit)</li>
              <li>• Incorrect amount sent</li>
              <li>• Wrong cryptocurrency sent</li>
              <li>• Network congestion</li>
            </ul>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/pricing')}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
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

export default PaymentFailed;
