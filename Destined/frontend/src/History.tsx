import { Button, Card, Flex, Image, Modal, Anchor, TextInput, ActionIcon, Loader } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { UserContext } from './ContextProvider'
import { Title } from './Title'
import { useNavigate } from 'react-router-dom'
import { PlaceFeature } from './ContextProvider'
import CafeImage from './assets/cafe.jpeg'
import RestaurantImage from './assets/restaurant.jpeg'
import { Search, XCircle } from 'lucide-react';
import { notifications } from '@mantine/notifications';

// home page
export function History() {
    return (
        <>
            <div className='bg-[#ffd3d3] pb-20 min-h-screen overflow-y-hidden'>
            </div>
        </>
    )
}