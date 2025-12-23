import { createContext, Dispatch, SetStateAction, useState } from "react";

export interface UserData {
    address: string;
    places: PlaceFeature[];
    setAddress: Dispatch<SetStateAction<string>>;
    setPlaces: Dispatch<SetStateAction<PlaceFeature[]>>;
}

interface PlaceFeature {
    properties: {
        name: string;
        country: string;
        state: string;
        city: string;
        formatted: string;
        categories: string[];
    };
}

export const UserContext = createContext<UserData>({
    address: '',
    places: [],
    setAddress: () => { },
    setPlaces: () => { },
});

export function ContextProvider({ children }: { children: React.ReactNode }) {
    const [address, setAddress] = useState('');
    const [places, setPlaces] = useState<PlaceFeature[]>([]);

    return (
        <UserContext.Provider value={{ address, places, setAddress, setPlaces }}>
            {children}
        </UserContext.Provider>
    );
}