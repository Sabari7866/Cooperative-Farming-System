import React from 'react';
import { useI18n } from '../utils/i18n';
import Icon from './Icon';

export default function LanguageSelector({ className = '' }: { className?: string }) {
    const { locale, setLocale } = useI18n();

    const languages = [
        { code: 'en', label: 'English', native: 'English' },
        { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
        { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    ];

    return (
        <div className={`relative group ${className}`}>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                <Icon name="Globe" className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 uppercase">{locale}</span>
                <Icon name="ChevronDown" className="h-3 w-3 text-slate-400" />
            </button>

            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-100 py-1 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-2">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => setLocale(lang.code as any)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-between group/item ${locale === lang.code ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600'
                            }`}
                    >
                        <span>{lang.native}</span>
                        {locale === lang.code && <Icon name="Check" className="h-3 w-3" />}
                    </button>
                ))}
            </div>
        </div>
    );
}
