import { Button, Card, Flex, Image, Text, Modal, Anchor } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { UserContext } from './ContextProvider'
import { Title } from './Title'
import { useNavigate } from 'react-router-dom'
import { PlaceFeature } from './ContextProvider'
import CafeImage from './assets/cafe.jpeg'
import RestaurantImage from './assets/restaurant.jpeg'
import { CircleChevronUp } from 'lucide-react';


interface PlaceDetails {
    place_id: string;
    address_line2: string;
    catering: { cuisine: string };
    contact: { phone: string };
    opening_hours: string;
    website: string;
}


// home page
export function Overview() {
    const { places, setPlaces } = useContext(UserContext);
    const [opened, { open, close }] = useDisclosure(false);
    const [details, setDetails] = useState<Record<string, PlaceDetails>>({});

    const handleRemove = (index: number) => {
        const modifiedPlaces = places.filter((_, i) => i !== index);
        setPlaces(modifiedPlaces);
    }

    useEffect(() => {
        places.map((places) => {
            axios.get(`http://127.0.0.1:5000/details/${places.properties.place_id}`)
                .then((response) => {
                    if (response.data.message === 'OK') {
                        setDetails(prev => ({ ...prev, [response.data.details.properties.place_id]: response.data.details.properties }));
                        console.log(response.data.details.properties);
                    }
                })
                .catch((e) => console.log(e))
        });
    }, [places]); // if places changes, then refetch the details for each place

    return (
        <>
            <div className='bg-[#ffd3d3] pb-20 min-h-screen overflow-y-hidden'>
                <Title />
                <Flex className='mt-20' gap="xl" wrap="wrap" justify="space-evenly" direction="row">
                    {places.map((place, index) => (
                        <Card key={index} shadow='xl' radius='lg' h={550} w={600} className='mt-16 bg-[#fef1f1]!' >
                            <Card.Section>
                                {place.properties.categories.some((category) => category.includes('restaurant')) ?
                                    <Image src={RestaurantImage} alt='Restaurant' h={250} /> :
                                    place.properties.categories.some((category) => category.includes('cafe')) ?
                                        <Image src={CafeImage} alt='Cafe' h={250} /> :
                                        <Image src='/assets/react.svg' alt='No Image Provided' h={250} />
                                }
                            </Card.Section>
                            <p className='text-center text-2xl font-medium mt-2'>
                                {place.properties.name}
                            </p>
                            <p className='text-center text-md font-light mt-1'>
                                {details[place.properties.place_id]?.address_line2}
                            </p>
                            <div className='pl-4 pr-4 mt-auto'>
                                <Flex justify='space-between'>
                                    <p className='text-md font-light'>Phone 📞: {details[place.properties.place_id]?.contact?.phone}</p>
                                    <p className='text-md font-light'>Cuisine 🍜: {details[place.properties.place_id]?.catering?.cuisine}</p>
                                </Flex>
                                <p className='text-md font-light'>Hours 🕔: {details[place.properties.place_id]?.opening_hours ? details[place.properties.place_id]?.opening_hours : 'Unable to be retrieved'}</p>
                                <p className='text-md font-light'>
                                    Website 💻: <Anchor href={`${details[place.properties.place_id]?.website}`} target='_blank' underline='hover'>
                                        {details[place.properties.place_id]?.website}
                                    </Anchor>
                                </p>
                            </div>
                            <div className='flex mt-auto justify-between p-4'>
                                <Button variant="filled" color="rgba(255, 140, 160, 1)" radius='md' onClick={open} w={180}>
                                    Learn More
                                </Button>
                                <Button variant="filled" color='red' radius='md' onClick={() => handleRemove(index)} w={180}>
                                    Remove Place
                                </Button>
                            </div>
                        </Card>
                    ))}
                </Flex>
                <Modal opened={opened} onClose={close} title="Location Details">
                    {/* AI generated content */}
                </Modal>
            </div>
        </>
    )
}