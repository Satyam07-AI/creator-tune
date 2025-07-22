
import React, { useState } from 'react';
import { initiatePayment } from '../services/razorpayService';
import ErrorToast from './ErrorToast';

interface PaymentButtonProps {
    planName: 'Pro' | 'Creator Pro Max';
    amount: number;
    onSuccess: () => void;
    ctaText: string;
    buttonClasses: string;
}

/**
 * A reusable button component that triggers the Razorpay payment flow.
 * It handles its own loading and error states, and displays a toast notification on failure.
 */
const PaymentButton = ({ planName, amount, onSuccess, ctaText, buttonClasses }: PaymentButtonProps) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const handleClick = () => {
        setIsLoading(true);
        initiatePayment({
            planName,
            amount,
            onSuccess: () => {
                setIsLoading(false);
                onSuccess();
            },
            onFailure: (errorMessage) => {
                setIsLoading(false);
                setError(errorMessage);
            }
        });
    };

    return (
        <>
            <button 
                onClick={handleClick}
                disabled={isLoading}
                className={`w-full rounded-lg py-3 text-center text-lg font-semibold shadow-md transition-all hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed ${buttonClasses}`}
            >
                {isLoading ? 'Processing...' : ctaText}
            </button>
            {error && <ErrorToast message={error} onClose={() => setError(null)} />}
        </>
    );
};

export default PaymentButton;
