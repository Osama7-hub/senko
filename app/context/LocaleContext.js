'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import arMessages from '@/locales/ar.json';
import enMessages from '@/locales/en.json';

const LocaleContext = createContext();

export function LocaleProvider({ children }) {
    const [locale, setLocale] = useState('ar'); // الافتراضية
    const [dir, setDir] = useState('rtl'); // الاتجاه الافتراضي للعربية
    const messages = { ar: arMessages, en: enMessages };

    useEffect(() => {
        const storedLocale = localStorage.getItem('locale');
        if (storedLocale) {
            setLocale(storedLocale);
            setDir(storedLocale === 'ar' ? 'rtl' : 'ltr');
        }
        document.documentElement.lang = storedLocale || 'ar';
        document.documentElement.dir = storedLocale === 'ar' ? 'rtl' : 'ltr';
    }, []);

    const changeLocale = (newLocale) => {
        setLocale(newLocale);
        setDir(newLocale === 'ar' ? 'rtl' : 'ltr');
        localStorage.setItem('locale', newLocale);

        // تحديث `lang` و `dir` في `html` عند التبديل
        document.documentElement.lang = newLocale;
        document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    };

    return (
        <LocaleContext.Provider value={{ locale, dir, changeLocale }}>
            <IntlProvider locale={locale} messages={messages[locale]}>
                {children}
            </IntlProvider>
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    return useContext(LocaleContext);
}
