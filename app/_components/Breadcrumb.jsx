import Link from 'next/link'
import React from 'react'

function Breadcrumb({ homelink = null, homeLinekTxt = null, link1 = null, link1Text = null, link2 = null, link2Text = null }) {
    return (
        <nav aria-label="Breadcrumb" className='mb-6'>
            <ol className="flex items-center gap-1 text-gray-700 dark:text-gray-200 text-sm">
                {homeLinekTxt && <li><Link href={homelink} className="block hover:text-primary transition-colors"> {homeLinekTxt} </Link></li>}

                {
                    link1Text &&
                    <li className="rtl:rotate-180">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </li>
                }

                {link1Text && <li><Link href={link1} className="block hover:text-primary transition-colors"> {link1Text} </Link></li>}

                {
                    link2Text &&
                    <li className="rtl:rotate-180">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </li>
                }

                {link2Text && <li><Link href={link2} className="block hover:text-primary transition-colors"> {link2Text} </Link></li>}
            </ol>
        </nav>
    )
}

export default Breadcrumb
