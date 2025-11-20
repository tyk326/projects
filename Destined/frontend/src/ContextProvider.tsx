import { createContext, Dispatch, SetStateAction, useState } from "react";

export interface UserData {
    title: string;
    link: string;
    setTitle: Dispatch<SetStateAction<string>>;
    setLink: Dispatch<SetStateAction<string>>;
}

export const UserContext = createContext<UserData>({
    title: '',
    link: '',
    setTitle: () => { },
    setLink: () => { },
});

export function ContextProvider({ children }: { children: React.ReactNode }) {
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');

    return (
        <UserContext.Provider value={{ title, link, setTitle, setLink }}>
            {children}
        </UserContext.Provider>
    );
}