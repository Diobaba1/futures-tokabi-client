// ============================================================================
// FILE: src/pages/billing/PaymentPending.tsx
// ============================================================================
/**
 * Payment Pending Page
 * 
 * Shows while waiting for blockchain confirmation.
 * Can be used as a waiting room after user sends payment.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Clock, RefreshCw } from 'lucide-react';

const PaymentPending: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [checking, setChecking] = useState(false);
  const [dots, setDots] = useState('');
  
  const paymentId = searchParams.get('payment_id') || searchParams.get('NP_id');
  
  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);
  
  const checkPaymentStatus = async () => {
    if (!paymentId) return;
    
    setChecking(true);
    try {
      const response = await fetch(`/api/billing/payments/${paymentId}/status`);
      const data = await response.json();
      
      if (data.status === 'confirmed' || data.status === 'finished') {
        navigate('/billing/success?payment_id=' + paymentId);
      } else if (data.status === 'failed' || data.status === 'expired') {
        navigate('/billing/failed?payment_id=' + paymentId);
      } else if (data.status === 'partially_paid') {
        navigate('/billing/partial?payment_id=' + paymentId);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    } finally {
      setChecking(false);
    }
  };
  
  // Auto-check every 30 seconds
  useEffect(() => {
    const interval = setInterval(checkPaymentStatus, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center">
          {/* Pending Icon with Animation */}
          <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <Clock className="w-12 h-12 text-purple-500" />
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-ping" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">
            Payment Processing
          </h1>
          
          <p className="text-gray-400 mb-6">
            Waiting for blockchain confirmation. This usually takes 1-10 minutes depending on the network.
          </p>
          
          {/* Status Indicator */}
          <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
              <span className="text-gray-300">Confirming transaction{dots}</span>
            </div>
          </div>
          
          {/* Transaction Info */}
          {paymentId && (
            <div className="bg-gray-900/50 rounded-lg p-4 mb-6 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment ID</span>
                <span className="text-gray-300 font-mono">{paymentId.slice(0, 16)}...</span>
              </div>
            </div>
          )}
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-6 px-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
              <span className="text-xs text-gray-400 mt-1">Created</span>
            </div>
            <div className="flex-1 h-0.5 bg-purple-500 mx-2" />
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm animate-pulse">⋯</div>
              <span className="text-xs text-gray-400 mt-1">Confirming</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-600 mx-2" />
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-gray-400 text-sm">3</div>
              <span className="text-xs text-gray-500 mt-1">Complete</span>
            </div>
          </div>
          
          {/* Check Button */}
          <button
            onClick={checkPaymentStatus}
            disabled={checking}
            className="w-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
            {checking ? 'Checking...' : 'Check Status'}
          </button>
          
          <p className="text-gray-500 text-sm mt-4">
            You'll be redirected automatically once confirmed.
          </p>
        </div>
        
        {/* Help Box */}
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 mt-4 text-sm text-gray-400">
          <p className="font-medium text-gray-300 mb-2">Why is this taking time?</p>
          <p>
            Cryptocurrency transactions require blockchain confirmations. 
            The time varies by network (Bitcoin: ~10 min, Ethereum: ~1-5 min, 
            USDT/TRC20: ~1-3 min).
          </p>
        </div>
        
        {/* Support Link */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Taking too long?{' '}
          <a href="/contact" className="text-purple-400 hover:text-purple-300">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

export default PaymentPending;
