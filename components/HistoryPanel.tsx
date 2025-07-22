
import React, { useState, useEffect } from 'react';
import { getHistory, clearHistory } from '../services/historyService';
import type { HistoryItem } from '../types';
import { FolderIcon, ClockIcon, TrashIcon } from './icons';

interface HistoryDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    onRevisit: (item: HistoryItem) => void;
    t: (key: string) => string;
}

const HistoryDropdown = ({ isOpen, onClose, onRevisit, t }: HistoryDropdownProps) => {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        if (isOpen) {
            setHistory(getHistory());
        }
    }, [isOpen]);

    const handleClearHistory = () => {
        if (window.confirm(t('history.confirmClear'))) {
            clearHistory();
            setHistory([]);
        }
    };
    
    const handleRevisitClick = (item: HistoryItem) => {
        onRevisit(item);
        onClose();
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };
    
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className={`absolute top-full right-0 mt-3 w-80 max-w-sm bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-4 z-50 transition-all duration-300 ease-in-out origin-top-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-heading"
        >
            <div className="flex justify-between items-center mb-3">
                <h3 id="history-heading" className="text-lg font-bold text-white flex items-center">
                    <FolderIcon className="w-5 h-5 mr-2 text-pink-300" />
                    {t('history.title')}
                </h3>
                 {history.length > 0 && (
                     <button
                        onClick={handleClearHistory}
                        className="inline-flex items-center justify-center gap-1 bg-red-600/20 hover:bg-red-600/40 text-red-300 font-semibold p-1.5 rounded-full transition-colors text-xs"
                        title={t('history.clear')}
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                 )}
            </div>

            {history.length > 0 ? (
                <ul className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {history.map(item => (
                        <li key={item.id} className="group flex items-center justify-between gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <div className="flex-grow min-w-0">
                                <p className="font-semibold text-sm text-white truncate">{item.url}</p>
                                <p className="text-xs text-white/60 flex items-center gap-1.5">
                                    <ClockIcon className="w-3 h-3 flex-shrink-0" />
                                    <span>{formatDate(item.timestamp)}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => handleRevisitClick(item)}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-1 px-3 rounded-md transition-colors text-xs flex-shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
                            >
                                {t('history.view')}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-white/70 py-10 text-sm">
                    {t('history.empty')}
                </p>
            )}
        </div>
    );
};

export default HistoryDropdown;
