import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
const ThemeContext = createContext(undefined);
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        if (typeof window === 'undefined')
            return 'light';
        return localStorage.getItem('theme') || 'light';
    });
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    }, [theme]);
    return (_jsx(ThemeContext.Provider, { value: { theme, toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark') }, children: children }));
};
export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx)
        throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
};
