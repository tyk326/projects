import { Button, Card, Flex, Image, Modal, Anchor, TextInput, ActionIcon, Loader, Tabs, Text, Divider } from '@mantine/core'
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
import { ChatSummary } from './ChatSummary'

interface SearchData {
    id: string,
    address: string, // what the user entered
    places: PlaceFeature[],
    details: Record<string, PlaceDetails>,
}

export function History() {
    const [searches, setSearches] = useState<SearchData[]>([]);
    const [activeTab, setActiveTab] = useState<string | null>(null);

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/get-searches')
            .then((response) => {
                if (response.data.message === "OK") {
                    console.log("Successfully retrieved all searches.");
                    setSearches(response.data.data);
                    setActiveTab(response.data.data[0].id);
                }
            })
            .catch((e) => console.log(e))
    }, []);

    const handleRemove = (id: string) => {
        axios.post('http://127.0.0.1:5000/remove-search', {
            "id": id,
        })
            .then((response) => {
                if (response.data.message === "OK") {
                    console.log("Successfully removed search from database.");
                    setSearches(response.data.data);
                }
            })
            .catch((e) => console.log(e));
    }

    return (
        <>
            <div className='bg-[#ffd3d3] pb-20 min-h-screen overflow-y-hidden'>
                {!!searches.length ? (
                    <Tabs
                        variant="pills"
                        radius="md"
                        orientation="vertical"
                        value={activeTab}
                        onChange={(val) => {
                            if (val === activeTab) setActiveTab(null);
                            else setActiveTab(val);
                        }}
                        className='mt-36 ml-auto mr-auto w-300'>
                        <Tabs.List className='mr-4'>
                            {searches.map((search: SearchData) => (
                                <Tabs.Tab key={search.id} value={search.id}>
                                    <Text size="xl" fw={600}>{search.address}</Text>
                                </Tabs.Tab>
                            ))}
                        </Tabs.List>

                        <Divider size="sm" orientation="vertical" color='blue' className='mr-4' />

                        {searches.map((search: SearchData) => (
                            <Tabs.Panel key={search.id} value={search.id} className=''>
                                <Flex gap="sm" wrap="wrap" direction="row">
                                    {search.places.map((place, index) => (
                                        <Card key={index} shadow='xl' radius='lg' h={400} w={300} className='bg-[#fef1f1]!' >
                                            <Card.Section>
                                                {place.categories.some((category) => category.includes('restaurant')) ?
                                                    <Image src={RestaurantImage} alt='Restaurant' h={150} /> :
                                                    place.categories.some((category) => category.includes('cafe')) ?
                                                        <Image src={CafeImage} alt='Cafe' h={150} /> :
                                                        <Image src='/assets/react.svg' alt='No Image Provided' h={150} />
                                                }
                                            </Card.Section>
                                            <p className='text-center text-xl font-medium mt-3'>
                                                {place.name}
                                            </p>
                                            <p className='text-center text-sm font-light mt-1'>
                                                {search.details[place.place_id]?.address_line2}
                                            </p>
                                            <div className='pl-4 pr-4 mt-auto'>
                                                <p className='text-md font-light'>Phone 📞: {search.details[place.place_id]?.contact?.phone ? search.details[place.place_id]?.contact?.phone : 'N/A'}</p>
                                                <p className='text-md font-light'>Cuisine 🍜: {search.details[place.place_id]?.catering?.cuisine ? search.details[place.place_id]?.catering?.cuisine : 'N/A'}</p>
                                                <p className='text-md font-light mt-1'>
                                                    Website 💻: {search.details[place.place_id]?.website ? <Anchor href={`${search.details[place.place_id]?.website}`} target='_blank' underline='hover'>
                                                        Click to visit
                                                    </Anchor> : 'N/A'}
                                                </p>
                                            </div>
                                        </Card>
                                    ))}
                                </Flex>
                                <div className='mt-6 w-fit'>
                                    <Button variant="filled" color='red' radius='md' onClick={() => handleRemove(search.id)} w={180}>
                                        Remove Place
                                    </Button>
                                </div>
                            </Tabs.Panel>
                        ))}
                    </Tabs>
                ) :
                    <Flex justify='center'>
                        <Loader color="blue" size="lg" className='mt-36' />
                    </Flex>}
            </div >
        </>
    )
}