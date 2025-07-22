
import React from 'react';
import { CheckCircleIcon } from './icons';

const ThankYouPage = ({ onGoHome, t }: { onGoHome: () => void; t: (key: string) => string }) => {
    return (
        <div className="w-full max-w-4xl mx-auto my-8 animate-fade-in-up text-gray-900 flex flex-col items-center">
            <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-lg border border-gray-200 text-center">
                <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                    Payment Successful!
                </h1>
                <p className="mt-4 text-lg text-gray-600 max-w-md mx-auto">
                    Thank you for your purchase. Your access to premium features has been activated. Welcome to the next level of YouTube growth!
                </p>
                <button
                    onClick={onGoHome}
                    className="mt-8 bg-purple-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-lg text-lg"
                >
                    {t('header.home')}
                </button>
            </div>
        </div>
    );
};

export default ThankYouPage;