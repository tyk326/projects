import { Button, Flex } from '@mantine/core'
import { useContext, useState } from 'react'
import axios from 'axios'
import { UserContext } from './ContextProvider'
import { Title } from './Title'
import { useNavigate } from 'react-router-dom'


// home page
export function Overview() {
    const { address, places, setAddress, setPlaces } = useContext(UserContext);
    console.log(places);
    return (
        <>
            <Title />
            <Flex>
            </Flex>
        </>
    )
}