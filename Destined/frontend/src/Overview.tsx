import { Button, Card, Flex, Image, Text, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { UserContext } from './ContextProvider'
import { Title } from './Title'
import { useNavigate } from 'react-router-dom'
import { PlaceFeature } from './ContextProvider'
import CafeImage from './assets/cafe.jpeg'
import RestaurantImage from './assets/restaurant.jpeg'
import EntertainmentImage from './assets/entertainment.jpeg'
import TourismImage from './assets/tourism.jpeg'
import LeisureImage from './assets/leisure.jpeg'


// home page
export function Overview() {
    const { address, places, setAddress, setPlaces } = useContext(UserContext);
    const [opened, { open, close }] = useDisclosure(false);
    console.log(places);

    return (
        <>
            <div className='bg-[#ffd3d3]'>
                <Title />
                <Flex className='mt-20' gap="xl" wrap="wrap" justify="space-evenly" direction="row">
                    {places.map((place, index) => (
                        <Card key={index} shadow='xl' radius='md' h={500} w={500} className='mt-16 bg-[#fef1f1]!' >
                            <Card.Section>
                                {place.properties.categories.some((category) => category.includes('restaurant')) ?
                                    <Image src={RestaurantImage} alt='Restaurant' h={250} /> :
                                    place.properties.categories.some((category) => category.includes('cafe')) ?
                                        <Image src={CafeImage} alt='Cafe' h={250} /> :
                                        place.properties.categories.some((category) => category.includes('entertainment')) ?
                                            <Image src={EntertainmentImage} alt='Entertainment' h={250} /> :
                                            place.properties.categories.some((category) => category.includes('tourism')) ?
                                                <Image src={TourismImage} alt='Tourism' h={250} /> :
                                                place.properties.categories.some((category) => category.includes('leisure')) ?
                                                    <Image src={LeisureImage} alt='Leisure' h={250} /> :
                                                    <Image src='/assets/react.svg' alt='No Image Provided' h={250} />
                                }
                            </Card.Section>
                            <p className='text-center text-2xl font-medium mt-2'>
                                {place.properties.name}
                            </p>
                            <Button variant="filled" color="rgba(255, 97, 97, 1)" radius='md' onClick={open} className='mt-38'>
                                Learn more
                            </Button>
                        </Card>
                    ))}
                </Flex>
                <Modal opened={opened} onClose={close} title="Location Details">
                    {/* Modal content */}
                </Modal>
            </div>
        </>
    )
}