import { Outlet } from "react-router-dom";
import { UserContext } from "./ContextProvider";
import { useContext } from "react";

export function Title() {
    const { address } = useContext(UserContext);

    return (
        <>
            <div className='fixed w-full top-0 z-50 bg-linear-to-r from-[#f88a8a] to-[#f86060] px-8 py-4 shadow-lg'>
                <a href='/'>
                    <p className='text-white font-bold text-3xl'>Destined</p>
                </a>
                {!!address.length && <p className="text-white text-xl">Current Address: {address}</p>}
            </div>
            <Outlet />
        </>
    )
}