import { NavLink, Flex, Rating, Text } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react"

interface SummaryProp {
    summary: {
        name: string,
        address: string,
    }
}

export function ChatSummary({summary}: SummaryProp){
    const {name, address} = summary;
    const [chatResponse, setChatResponse] = useState<{rate: number, summary: string}>({rate: 0, summary: ""});

    const retrieveSummary = () => {
        // axios.post("http://127.0.0.1:5000/chat-summary", {
        //     "prompt": `At ${name}, located in ${address}, can you give me a 100 word summary of this restaurant and give me the star rating from [1-5]. Can your response be in a json format where star rating is an object and your summary of the place is also in another object.`,
        // })
        //     .then((response) => {
        //         if (response.data.message === 'OK'){
        //             // setChatResponse(response.data.response)
        //             console.log(response.data)
        //         }
        //         else if (response.data.message === 'RATE_LIMIT'){
        //             console.log(response.data.response)
        //         }
        //         console.log(response.data)
        //     })
        //     .catch((e) => console.log(e))
        setChatResponse({rate: 4.5, summary: "This is a great restaurant to eat at. They offer a variety of food."})
    }


     return(
        <>
            <NavLink label={<Text fw={500}>Star Rating & Summary</Text>} onClick={() => retrieveSummary()} active variant='light' color="pink" className="rounded-2xl">
                <Flex gap={10} align='center' className="mt-2">
                    <p>Rating:</p>
                    <Rating value={chatResponse.rate} fractions={10} readOnly/>
                </Flex>
                <Flex gap={10} className="mt-2">
                    <p>
                        Summary:
                    </p>
                    <p className="font-light">
                        {chatResponse.summary}
                    </p>
                </Flex>
            </NavLink>
        </>
    )
}