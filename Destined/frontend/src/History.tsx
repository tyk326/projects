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
import { PlaceDetails } from './Overview'

interface SearchData {
    id: string,
    address: string,
    places: PlaceFeature[],
    details: Record<string, PlaceDetails>,
}

export function History() {
    const [searches, setSearches] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/get-searches')
            .then((response) => {
                if (response.data.message === "OK"){
                    console.log("Successfully retrieved all searches.");
                    setSearches(response.data.data);
                }
            })
            .catch((e) => console.log(e))
    }, []);

    return (
        <>
            <div className='bg-[#ffd3d3] pb-20 min-h-screen overflow-y-hidden'>
                {!!searches.length ? (
                    searches.map((search: SearchData) => (
                        <p className='mt-24' key={search.id}>{search.id}</p>
                    ))
                ) : 
                <p className='mt-24 bg-indigo-300 shadow-md p-6 rounded-xl text-center w-fit ml-auto mr-auto'>No past searches</p>
                }
            </div>
        </>
    )
}