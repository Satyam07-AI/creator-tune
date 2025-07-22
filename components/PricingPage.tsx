
import React from 'react';
import { CheckIcon, XIcon, StarIcon } from './icons';

const PricingCard = ({ plan, price, features, isPopular, mostPopularText, cardClasses, monthlyPriceText, children }: {
    plan: string;
    price: string;
    features: string[];
    isPopular: boolean;
    mostPopularText: string;
    cardClasses: string;
    monthlyPriceText: string;
    children: React.ReactNode;
}) => (
  <div className={`relative flex flex-col rounded-2xl border p-8 shadow-lg transition-transform hover:scale-[1.02] ${cardClasses}`}>
    {isPopular && (
      <div className="absolute top-0 -translate-y-1/2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-1 text-sm font-semibold text-white shadow-md">
        <StarIcon className="inline-block w-4 h-4 mr-1 mb-0.5" />
        {mostPopularText}
      </div>
    )}
    <h3 className="text-2xl font-bold text-gray-800">{plan}</h3>
    <p className="mt-4 text-gray-500">{price}</p>
    <p className="mt-1 text-4xl font-bold text-gray-900">{monthlyPriceText}</p>
    <div className="mt-8">
        {children}
    </div>
    <ul className="mt-8 space-y-4 text-gray-600 flex-grow">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center">
          <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

const ComparisonFeature = ({ name, starter, pro, creator }: { name: string, starter: string | boolean, pro: string | boolean, creator: string | boolean }) => (
    <tr className="border-b border-gray-200 last:border-b-0">
      <td className="py-4 px-6 text-left font-medium text-gray-700">{name}</td>
      <td className="py-4 px-6 text-center">{typeof starter === 'string' ? starter : (starter ? <CheckIcon className="h-6 w-6 text-green-500 mx-auto" /> : <XIcon className="h-6 w-6 text-gray-400 mx-auto" />)}</td>
      <td className="py-4 px-6 text-center">{typeof pro === 'string' ? pro : (pro ? <CheckIcon className="h-6 w-6 text-green-500 mx-auto" /> : <XIcon className="h-6 w-6 text-gray-400 mx-auto" />)}</td>
      <td className="py-4 px-6 text-center">{typeof creator === 'string' ? creator : (creator ? <CheckIcon className="h-6 w-6 text-green-500 mx-auto" /> : <XIcon className="h-6 w-6 text-gray-400 mx-auto" />)}</td>
    </tr>
  );


const PricingPage = ({ onPaymentSuccess, t }: { onPaymentSuccess: () => void; t: (key: string) => string; }) => {

  const features = {
    starter: [
        'First 5 audits free',
        'Basic title/thumbnail suggestions',
        'Limited AI access',
        'No login required'
    ],
    pro: [
        'Unlimited audits',
        'Niche & trend analyzer',
        'Smart title/thumbnail AI',
        'Save audit reports',
        'Faster response'
    ],
    creator: [
        'Everything in Pro',
        'PDF reports',
        'Auto audit button',
        'Early access to new tools',
        'Personalized channel feedback'
    ]
  }

  const comparisonFeatures = [
    { name: 'Number of Audits', starter: '5 free', pro: 'Unlimited', creator: 'Unlimited' },
    { name: 'Title & Thumbnail AI', starter: 'Basic', pro: 'Smart', creator: 'Smart' },
    { name: 'Niche & Trend Analyzer', starter: false, pro: true, creator: true },
    { name: 'Save Audit Reports', starter: false, pro: true, creator: true },
    { name: 'Faster AI Response', starter: false, pro: true, creator: true },
    { name: 'Downloadable PDF Reports', starter: false, pro: false, creator: true },
    { name: 'Auto-Audit Button', starter: false, pro: false, creator: true },
    { name: 'Early Access to New Tools', starter: false, pro: false, creator: true },
    { name: 'Personalized Channel Feedback', starter: false, pro: false, creator: true },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto my-8 animate-fade-in-up text-gray-900">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
            Choose Your Plan
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Unlock your YouTube potential with a plan that fits your journey. Start for free, no login required.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
        <PricingCard
            plan="🟢 Starter"
            price="Perfect for getting started."
            monthlyPriceText="Free"
            features={features.starter}
            isPopular={false}
            mostPopularText=""
            cardClasses="border-gray-200 bg-white"
        >
            <button
                onClick={() => alert("Enjoy the free tools!")}
                className="w-full rounded-lg py-3 text-center text-lg font-semibold shadow-md transition-transform hover:scale-105 bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer"
            >
                Start for Free
            </button>
        </PricingCard>
        <PricingCard
            plan="🟣 Pro"
            price="For creators ready to grow."
            monthlyPriceText="Free (Testing)"
            features={features.pro}
            isPopular={true}
            mostPopularText="Most Popular"
            cardClasses="border-purple-500 bg-purple-50"
        >
             <button
                onClick={onPaymentSuccess}
                className="w-full rounded-lg py-3 text-center text-lg font-semibold shadow-md transition-all hover:scale-105 bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
            >
                Activate for Free
            </button>
        </PricingCard>
        <PricingCard
            plan="🔥 Creator Pro Max"
            price="The ultimate growth toolkit."
            monthlyPriceText="Free (Testing)"
            features={features.creator}
            isPopular={false}
            mostPopularText=""
            cardClasses="border-gray-200 bg-white"
        >
            <button
                onClick={onPaymentSuccess}
                className="w-full rounded-lg py-3 text-center text-lg font-semibold shadow-md transition-all hover:scale-105 bg-gray-800 text-white hover:bg-gray-900 cursor-pointer"
            >
                Activate for Free
            </button>
        </PricingCard>
      </div>

      <div className="mt-24">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Compare All Features
        </h2>
        <div className="mt-12 overflow-x-auto">
          <div className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white shadow-lg">
            <table className="w-full min-w-max text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th scope="col" className="py-4 px-6 text-left text-lg font-bold text-gray-800">Features</th>
                  <th scope="col" className="py-4 px-6 text-center text-base font-semibold text-gray-600">Starter</th>
                  <th scope="col" className="py-4 px-6 text-center text-base font-semibold text-gray-600">Pro</th>
                  <th scope="col" className="py-4 px-6 text-center text-base font-semibold text-gray-600">Creator Pro Max</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map(feature => (
                    <ComparisonFeature 
                        key={feature.name}
                        name={feature.name}
                        starter={feature.starter}
                        pro={feature.pro}
                        creator={feature.creator}
                    />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;