// ============================================================================
// FILE: src/pages/billing/PaymentSuccess.tsx
// ============================================================================
/**
 * Payment Success Page
 * 
 * Users are redirected here after successful payment on NOWPayments.
 * Shows confirmation and redirects to dashboard/subscription page.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  
  // Get payment details from URL params (NOWPayments includes these)
  const paymentId = searchParams.get('NP_id') || searchParams.get('payment_id');
  const orderId = searchParams.get('order_id');
  
  useEffect(() => {
    // Countdown timer for auto-redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/dashboard/subscription');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="bg-dark-elevated backdrop-blur-sm border border-dark-border rounded-2xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-2">
            Payment Successful!
          </h1>
          
          <p className="text-gray-400 mb-6">
            Thank you for your payment. Your subscription has been activated.
          </p>
          
          {/* Payment Details */}
          {(paymentId || orderId) && (
            <div className="bg-gray-900/50 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Payment Details</h3>
              {paymentId && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Payment ID</span>
                  <span className="text-gray-300 font-mono">{paymentId.slice(0, 12)}...</span>
                </div>
              )}
              {orderId && (
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Order ID</span>
                  <span className="text-gray-300 font-mono">{orderId.slice(0, 12)}...</span>
                </div>
              )}
            </div>
          )}
          
          {/* What's Next */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-green-400 font-medium mb-2">What's Next?</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>✓ Your subscription is now active</li>
              <li>✓ Access all premium features</li>
              <li>✓ Confirmation email sent</li>
            </ul>
          </div>
          
          {/* CTA Button */}
          <button
            onClick={() => navigate('/dashboard/subscription')}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
          
          {/* Auto-redirect notice */}
          <p className="text-gray-500 text-sm mt-4">
            Redirecting automatically in {countdown} seconds...
          </p>
        </div>
        
        {/* Support Link */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Having issues?{' '}
          <a href="/contact" className="text-purple-400 hover:text-purple-300">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
