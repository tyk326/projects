import { Button, Card, Flex, Image, Modal, Anchor, TextInput, ActionIcon, Loader, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { UserContext } from './ContextProvider'
import { Title } from './Title'
import { useNavigate } from 'react-router-dom'
import { PlaceFeature } from './ContextProvider'
import CafeImage from './assets/cafe.jpeg'
import RestaurantImage from './assets/restaurant.jpeg'
import { Search, XCircle, BookMarked } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { ChatSummary } from './ChatSummary'
import { nanoid } from 'nanoid'

export interface PlaceDetails {
    place_id: string;
    address_line2: string;
    catering: { cuisine: string };
    contact: { phone: string };
    opening_hours: string;
    website: string;
}

// home page
export function Overview() {
    const { address, places, setAddress, setPlaces } = useContext(UserContext);
    const [opened, { open, close }] = useDisclosure(false);
    const [details, setDetails] = useState<Record<string, PlaceDetails>>({});
    const [newAddress, setNewAddress] = useState("");
    const [loading, setLoading] = useState(false); // to show the loading icon when a user searches a new address
    const [summary, setSummary] = useState<{ name: string, address: string }>({ name: "", address: "" }); // for passing the name to the chat summary component
    const [clickedAddSearch, setClickedAddSearch] = useState(false); // to prevent multiple clicks on the same search

    const handleRemove = (index: number) => {
        const modifiedPlaces = places.filter((_, i) => i !== index);
        setPlaces(modifiedPlaces);
    }

    useEffect(() => {
        places.map((places) => {
            axios.get(`http://127.0.0.1:5000/details/${places.place_id}`)
                .then((response) => {
                    if (response.data.message === 'OK') {
                        setDetails(prev => ({ ...prev, [response.data.details.properties.place_id]: response.data.details.properties }));
                        console.log("Successfully retrieved place details");
                    }
                })
                .catch((e) => console.log(e))
        });
        setLoading(false);
    }, [places]); // if places changes, then refetch the details for each place

    const getPlaces = () => {
        axios.post("http://127.0.0.1:5000/", {
            "address": newAddress, // use the new address instead of address because when doing setAddress, it is async, so the changes may not be made yet
        })
            .then((response) => {
                if (response.data.message === 'OK') {
                    // filter out the places with no names
                    const withNames: PlaceFeature[] = response.data.places.filter((place: any) => place.properties.name).map((places: any) => places.properties);
                    setPlaces(withNames);
                    console.log("Successfully retrieved places for new address");
                }
            })
            .catch((e) => console.log(e))
    }

    const handleSearch = () => {
        if (newAddress.length === 0) {
            notifications.show({
                title: 'Invalid Address',
                message: 'Please enter a valid address to search places.',
                withBorder: true,
                color: 'red'
            });
            return;
        }
        setAddress(newAddress);
        setLoading(true);
        getPlaces();
    }

    // when the clicks to save the search of all places
    const handleAddPastSearch = () => {
        const id: string = nanoid(10);
        const searchData = {
            id: id,
            address: address,
            places: places,
            details: details,
        }
        axios.post('http://127.0.0.1:5000/save-search', {
            "searchData": searchData,
        })
            .then((response) => {
                if (response.data.message === 'OK') {
                    console.log("Successfully saved search data");
                }
            })
            .catch((e) => console.log(e))
    }

    return (
        <>
            <div className='bg-[#ffd3d3] pb-20 min-h-screen overflow-y-hidden'>
                {!loading ?
                    <>
                        <Title />
                        <Flex gap='xs' className='mt-36 w-fit ml-auto mr-auto'>
                            <ActionIcon variant="filled" size={42} radius="xl" onClick={() => handleSearch()} className='mt-auto mb-auto'>
                                <Search />
                            </ActionIcon>
                            <TextInput
                                variant="filled"
                                size="md"
                                w={350}
                                radius="xl"
                                placeholder="Enter new address..."
                                value={newAddress}
                                onChange={(e) => setNewAddress(e.currentTarget.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                        setClickedAddSearch(false); // reset the clicked state when a new search is made
                                    }
                                }}
                                rightSection={
                                    <ActionIcon
                                        variant="transparent"
                                        color="gray"
                                        onClick={() => setNewAddress('')}
                                    >
                                        <XCircle size={23} />
                                    </ActionIcon>
                                }
                            />
                            <ActionIcon variant='filled' size={42} w={210} radius='xl' color='indigo' disabled={clickedAddSearch} onClick={() => { handleAddPastSearch(); if (!clickedAddSearch) setClickedAddSearch(true); }}>
                                <Flex gap={6} align='center'>
                                    <p className='font-medium'>Add to past searches</p>
                                    <BookMarked />
                                </Flex>
                            </ActionIcon>
                        </Flex>
                        <Flex gap="xl" wrap="wrap" justify="space-evenly" direction="row">
                            {places.map((place, index) => (
                                <Card key={index} shadow='xl' radius='lg' h={550} w={600} className='mt-16 bg-[#fef1f1]!' >
                                    <Card.Section>
                                        {place.categories.some((category) => category.includes('restaurant')) ?
                                            <Image src={RestaurantImage} alt='Restaurant' h={250} /> :
                                            place.categories.some((category) => category.includes('cafe')) ?
                                                <Image src={CafeImage} alt='Cafe' h={250} /> :
                                                <Image src='/assets/react.svg' alt='No Image Provided' h={250} />
                                        }
                                    </Card.Section>
                                    <p className='text-center text-2xl font-medium mt-3'>
                                        {place.name}
                                    </p>
                                    <p className='text-center text-md font-light mt-1'>
                                        {details[place.place_id]?.address_line2}
                                    </p>
                                    <div className='pl-4 pr-4 mt-auto'>
                                        <Flex justify='space-between'>
                                            <p className='text-md font-light'>Phone 📞: {details[place.place_id]?.contact?.phone ? details[place.place_id]?.contact?.phone : 'N/A'}</p>
                                            <p className='text-md font-light'>Cuisine 🍜: {details[place.place_id]?.catering?.cuisine ? details[place.place_id]?.catering?.cuisine : 'N/A'}</p>
                                        </Flex>
                                        <p className='text-md font-light mt-1'>Hours 🕔: {details[place.place_id]?.opening_hours ? details[place.place_id]?.opening_hours : 'N/A'}</p>
                                        <p className='text-md font-light mt-1'>
                                            Website 💻: {details[place.place_id]?.website ? <Anchor href={`${details[place.place_id]?.website}`} target='_blank' underline='hover'>
                                                Click to visit
                                            </Anchor> : 'N/A'}
                                        </p>
                                    </div>
                                    <div className='flex mt-auto justify-between p-4'>
                                        <Button variant="filled" color="rgba(255, 140, 160, 1)" radius='md' onClick={() => { open(); setSummary({ name: place.name, address: details[place.place_id]?.address_line2 }); }} w={180}>
                                            Learn More
                                        </Button>
                                        <Button variant="filled" color='red' radius='md' onClick={() => handleRemove(index)} w={180}>
                                            Remove Place
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </Flex>
                        <Modal opened={opened} onClose={close} title={<Text size='xl' fw={500} td='underline'>Details</Text>} size='xl' radius={10}>
                            <ChatSummary summary={summary} />
                        </Modal>
                    </>
                    : <Flex justify='center'>
                        <Loader color="blue" size="lg" className='mt-36' />
                    </Flex>}
            </div>
        </>
    )
}