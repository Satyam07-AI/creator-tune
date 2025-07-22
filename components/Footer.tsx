import React from 'react';
import { EnvelopeIcon, InstagramIcon, ShieldCheckIcon, SparklesIcon } from './icons';

interface FooterProps {
    onGoHome: () => void;
    onShowFeaturesPage: () => void;
    onShowPricingPage: () => void;
    onShowFAQPage: () => void;
    onShowTOSPage: () => void;
    onShowPrivacyPolicyPage: () => void;
    onShowWhatYouGetPage: () => void;
    onScrollTo: (selector: string) => void;
    t: (key: string) => string;
}

const Footer = ({
    onGoHome,
    onShowFeaturesPage,
    onShowPricingPage,
    onShowFAQPage,
    onShowTOSPage,
    onShowPrivacyPolicyPage,
    onShowWhatYouGetPage,
    onScrollTo,
    t
}: FooterProps) => {
    
    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, action: () => void) => {
        e.preventDefault();
        action();
    };

    const navigationLinks = [
        { name: t('header.home'), action: onGoHome },
        { name: t('header.features'), action: onShowFeaturesPage },
        { name: t('header.whatYouGet'), action: onShowWhatYouGetPage },
        { name: t('header.pricing'), action: onShowPricingPage },
        { name: t('header.faq'), action: onShowFAQPage },
        { name: t('header.howItWorks'), action: () => onScrollTo('#how-it-works') },
        { name: t('contact.title'), action: () => { window.location.href = "mailto:sy8936216@gmail.com"; } },
    ];
    
    return (
        <footer className="bg-gray-900 text-gray-300 w-full mt-auto">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    {/* Company Info */}
                    <div className="col-span-2 lg:col-span-2">
                        <h1 className="text-3xl font-bold italic text-purple-400" style={{fontFamily: "'Poppins', sans-serif"}}>CreatorTune</h1>
                        <p className="mt-4 text-gray-400 max-w-xs">
                            An AI-powered suite of tools designed to help YouTube creators analyze, strategize, and grow their channels.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-400">Navigation</h3>
                        <ul className="mt-4 space-y-2">
                            {navigationLinks.map(link => (
                                <li key={link.name}>
                                    <a href="#" onClick={(e) => handleLinkClick(e, link.action)} className="text-base text-gray-300 hover:text-white transition-colors duration-200">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-400">Contact</h3>
                        <ul className="mt-4 space-y-3">
                            <li>
                                <a href="mailto:sy8936216@gmail.com" className="flex items-center gap-3 text-base text-gray-300 hover:text-white transition-colors duration-200">
                                    <EnvelopeIcon className="w-5 h-5" />
                                    <span>Email</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.instagram.com/satyam_feat07" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-base text-gray-300 hover:text-white transition-colors duration-200">
                                    <InstagramIcon className="w-5 h-5" />
                                    <span>Instagram</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Trust Signals */}
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-400">Trust & Power</h3>
                        <ul className="mt-4 space-y-3">
                            <li className="flex items-center gap-3 text-base">
                                <ShieldCheckIcon className="w-5 h-5 text-green-400" />
                                <span>100% Secure</span>
                            </li>
                            <li className="flex items-center gap-3 text-base">
                                <SparklesIcon className="w-5 h-5 text-purple-400" />
                                <span>AI Powered</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Legal Section */}
                <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-sm text-gray-400 order-2 sm:order-1 mt-4 sm:mt-0">&copy; {new Date().getFullYear()} CreatorTune. All rights reserved.</p>
                    <div className="flex space-x-6 order-1 sm:order-2">
                        <a href="#" onClick={(e) => handleLinkClick(e, onShowPrivacyPolicyPage)} className="text-sm text-gray-400 hover:text-gray-300">Privacy Policy</a>
                        <a href="#" onClick={(e) => handleLinkClick(e, onShowTOSPage)} className="text-sm text-gray-400 hover:text-gray-300">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;