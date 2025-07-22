import type { HistoryItem, AuditData } from '../types';

const HISTORY_KEY = 'creator_tune_audit_history';
const MAX_HISTORY_ITEMS = 5;

export const getHistory = (): HistoryItem[] => {
    try {
        const historyJson = localStorage.getItem(HISTORY_KEY);
        if (!historyJson) return [];
        const history = JSON.parse(historyJson) as HistoryItem[];
        // Sort by date, newest first
        return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
        console.error("Failed to parse history from localStorage", error);
        return [];
    }
};

export const saveAuditToHistory = (url: string, data: AuditData): void => {
    try {
        let history = getHistory();
        
        // Remove any existing entry with the same URL to prevent duplicates and move the new one to the top.
        history = history.filter(item => item.url !== url);

        const newHistoryItem: HistoryItem = {
            id: `${new Date().getTime()}-${url}`,
            url,
            data,
            timestamp: new Date().toISOString(),
        };

        // Add new item and slice to keep only the most recent items
        const updatedHistory = [newHistoryItem, ...history].slice(0, MAX_HISTORY_ITEMS);
        
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
        console.error("Failed to save audit to localStorage", error);
    }
};

export const clearHistory = (): void => {
    try {
        localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
        console.error("Failed to clear history from localStorage", error);
    }
};
