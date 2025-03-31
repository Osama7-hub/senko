"use client";
import React from 'react'
import { Info, X } from 'lucide-react'
import { FormattedMessage } from 'react-intl'

export function Alert({ title, content }) {
    const [isOpen, setisOpen] = useState(false);
    return (
        <div role="alert" className="bottom-10 left-6 z-50 fixed bg-white dark:bg-gray-800 shadow-sm p-4 border border-gray-300 dark:border-gray-700 rounded-md">
            <div className="flex items-start gap-4">

                <Info className='text-yellow-600' />

                <div className="flex-1">
                    <strong className="font-medium text-gray-900 dark:text-gray-300"> {title} </strong>

                    <p className="mt-0.5 text-gray-700 dark:text-gray-300 text-sm">{content}</p>
                </div>

                <button
                    className="hover:bg-gray-50 -m-3 p-1.5 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
                    type="button"
                    aria-label="Dismiss alert"
                    onClick={() => setisOpen(!isOpen)}
                >
                    <span className="sr-only">Dismiss popup</span>

                    <X />
                </button>
            </div>
        </div>
    )
}

export function ConfirmAlert({ title, content, action, onCancel }) {
    return (
        <div role="alert" className="top-20 left-1/2 z-50 fixed bg-white dark:bg-gray-800 shadow-sm p-4 border border-gray-300 dark:border-gray-700 rounded-md w-fit -translate-x-1/2 transform">
            <div className='flex items-start gap-4'>
                <Info className='text-red-500' />
                <div className="flex-1">
                    <strong className="font-medium text-gray-900 dark:text-gray-300"> {title} </strong>

                    <p className="my-4 text-gray-700 dark:text-gray-300 text-sm">{content}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 mx-2 mt-3">
                <button
                    type="button"
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm px-5 py-1.5 border border-gray-300 dark:border-gray-700 rounded font-medium text-gray-900 dark:text-gray-300 text-sm transition-colors"
                    onClick={action}
                >
                    <FormattedMessage id='ok' />
                </button>

                <button
                    type="button"
                    className="px-3 py-1.5 border border-transparent rounded font-medium text-gray-700 hover:text-gray-900 dark:hover:text-gray-100 dark:text-gray-300 text-sm transition-colors"
                    onClick={onCancel} // عند الإلغاء، يتم إغلاق التنبيه
                >
                    <FormattedMessage id='cancel' />
                </button>
            </div>

        </div>
    );
}


export default Alert
