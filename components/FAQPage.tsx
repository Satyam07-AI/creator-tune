
import React, { useState } from 'react';
import { ChevronDownIcon } from './icons';

const FAQItem = ({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void; }) => (
    <div className="border-b border-gray-200 py-6">
      <button onClick={onClick} className="w-full flex justify-between items-center text-left gap-4">
        <h4 className="text-lg font-semibold text-gray-800">{question}</h4>
        <ChevronDownIcon className={`w-6 h-6 text-gray-500 transform transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
            <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );


const FAQPage = ({ t }: { t: (key: string) => string }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqData = [
        {
            question: "Do I need to log in or connect my YouTube account?",
            answer: "Not at all! You can get started right away without any login. For our free tools, you just need to enter a channel URL or paste in your content. We value your privacy and only ask for a login when you're ready to upgrade and save your reports."
        },
        {
            question: "How is Creator Tune different from other YouTube tools?",
            answer: "Creator Tune is powered by advanced AI, giving you strategic insights, not just basic data. We focus on creative feedback for titles, thumbnails, and content ideas, helping you understand *why* something works. It's like having an AI growth coach in your corner."
        },
        {
            question: "Is it safe to use? Will my channel data be secure?",
            answer: "Absolutely. We do not require you to connect your YouTube account for any of our audits. All analysis is done based on publicly available information or the data you manually provide, so your channel credentials and private data remain completely secure."
        },
        {
            question: "What's the difference between the Free and Pro plans?",
            answer: "The Free plan is perfect for quick insights, giving you 5 free audits and basic suggestions. Upgrading to Pro unlocks unlimited audits, advanced AI analysis like our Niche & Trend Analyzer, and the ability to save reports, giving you a serious advantage for channel growth."
        },
        {
            question: "Who should upgrade to the Pro or Creator Pro Max plan?",
            answer: "If you're serious about growing your channel and want to make data-driven decisions consistently, our Pro plans are for you. They offer unlimited access to our most powerful tools, helping you save time, beat the competition, and turn your passion into a success story."
        },
        {
            question: "Can I really get started for free? What's the catch?",
            answer: "Yes, you really can! There's no catch. Our Starter plan is 100% free and gives you access to our core tools for your first 5 audits. We believe in our product and want you to see its value before you consider upgrading. Try it out now!"
        }
    ];

    const handleItemClick = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="w-full max-w-4xl mx-auto my-8 animate-fade-in-up text-gray-900">
            <div className="text-center">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                    Frequently Asked Questions
                </h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    Have questions? We've got answers. If you can't find what you're looking for, feel free to contact us.
                </p>
            </div>
            <div className="mt-16 bg-white p-4 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
                {faqData.map((item, index) => (
                    <FAQItem 
                        key={index} 
                        question={item.question} 
                        answer={item.answer}
                        isOpen={openIndex === index}
                        onClick={() => handleItemClick(index)} 
                    />
                ))}
            </div>
        </div>
    );
};

export default FAQPage;