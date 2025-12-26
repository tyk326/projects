import { Outlet } from "react-router-dom";
import { UserContext } from "./ContextProvider";
import { useContext } from "react";
import { Flex, NavLink } from "@mantine/core";
import { History } from "lucide-react";

export function Title() {
    const { address } = useContext(UserContext);

    return (
        <>
            <div className='fixed w-full top-0 z-50 bg-linear-to-r from-[#f88a8a] to-[#f86060] px-8 py-4 shadow-lg'>
                <Flex justify='space-between' align='center'>
                    <div>
                        <a href='/'>
                            <p className='text-white font-bold text-3xl w-fit'>Destined</p>
                        </a>
                        {!!address.length && <p className="text-white text-xl">Current Address: {address}</p>}
                    </div>
                    <NavLink
                        href='/past-searches'
                        label='Past Searches'
                        leftSection={<History />}
                        w={162}
                        active
                        variant="filled"
                        color="rgb(248, 80, 96, 1)"
                        className="rounded-3xl font-bold"
                    />
                </Flex>
            </div>
            <Outlet />
        </>
    )
}