
import React, { useState, useEffect, useRef } from 'react';
import { supportedLanguages, Language } from '../services/localization';
import { ChevronUpDownIcon } from './icons';

interface LanguageSelectorProps {
    currentLanguage: Language;
    onLanguageChange: (lang: Language) => void;
    theme?: 'dark' | 'light';
}

const LanguageSelector = ({ currentLanguage, onLanguageChange, theme = 'dark' }: LanguageSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selectedLanguage = supportedLanguages.find(l => l.code === currentLanguage);
    
    const isLight = theme === 'light';
    const buttonClasses = isLight ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-gray-800";
    const dropdownBgClasses = isLight ? "bg-white border-gray-200" : "bg-gray-900 border-gray-700";
    const itemTextClasses = isLight ? "text-gray-800 hover:bg-gray-100" : "text-white/90 hover:bg-white/10";
    const activeItemClasses = isLight ? "bg-purple-100 text-purple-700 font-semibold" : "bg-purple-600 text-white font-semibold";


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-1.5 p-2 rounded-full transition-colors ${buttonClasses}`}
                aria-label="Select language"
            >
                <span className="text-xl">{selectedLanguage?.flag}</span>
                <ChevronUpDownIcon className="w-5 h-5"/>
            </button>

            {isOpen && (
                <div className={`absolute top-full right-0 mt-2 w-48 border rounded-lg shadow-2xl p-1.5 z-50 animate-fade-in-up origin-top-right ${dropdownBgClasses}`} style={{animationDuration: '0.2s'}}>
                    <ul className="space-y-1">
                        {supportedLanguages.map(lang => (
                            <li key={lang.code}>
                                <button
                                    onClick={() => {
                                        onLanguageChange(lang.code);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 p-2 rounded-md text-left text-sm transition-colors ${
                                        currentLanguage === lang.code 
                                        ? activeItemClasses
                                        : itemTextClasses
                                    }`}
                                >
                                    <span className="text-xl">{lang.flag}</span>
                                    <span>{lang.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
