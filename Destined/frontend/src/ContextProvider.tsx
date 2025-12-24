import { createContext, Dispatch, SetStateAction, useState } from "react";

export interface UserData {
    address: string;
    places: PlaceFeature[];
    setAddress: Dispatch<SetStateAction<string>>;
    setPlaces: Dispatch<SetStateAction<PlaceFeature[]>>;
}

export interface PlaceFeature {
    name: string;
    country: string;
    state: string;
    city: string;
    formatted: string;
    categories: string[];
    place_id: string;
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