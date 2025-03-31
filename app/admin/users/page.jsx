"use client";
import React from 'react'
import MainLayout from '@/app/layouts/MainLayout'
import Breadcrumb from '@/app/_components/Breadcrumb'
import { FormattedMessage } from "react-intl";

function Users() {
    return (
        <MainLayout header={<span><FormattedMessage id='manageUsers' /></span>}>
            <div className='p-6'>
                {/* <Breadcrumb homelink={'/admin'} homeLinekTxt={`${intl.formatMessage({ id: "breadcrumbMain" })}`} link1={'/admin/users'} link1Text={`${intl.formatMessage({ id: "manageUsers" })}`} /> */}
                <Breadcrumb homelink={'/admin'} homeLinekTxt={<FormattedMessage id='breadcrumbMain' />} link1={'/admin/users'} link1Text={<FormattedMessage id='manageUsers' />} />
                <div className='flex justify-center p-6 h-screen'>
                    صفحة ادارة المستخدمين غير متوفرة حتي الان
                </div>
            </div>
        </MainLayout>
    )
}

export default Users
