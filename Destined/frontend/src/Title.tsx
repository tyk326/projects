import { Outlet } from "react-router-dom";

export function Title() {
    return (
        <>
            <div className='fixed w-full top-0 z-50 bg-linear-to-r from-[#f88a8a] to-[#f86060] px-8 py-4 shadow-lg'>
                <p className='text-white font-bold text-3xl'>PianoQuery</p>
            </div>
            <Outlet />
        </>
    )
}