import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [bugunRandevuSayisi, setBugunRandevuSayisi] = useState(0);
    const [HastaRandevusayisi, setHastaRandevusayisi] = useState(0);
    return (
        <UserContext.Provider value={{ bugunRandevuSayisi, setBugunRandevuSayisi,
            HastaRandevusayisi,setHastaRandevusayisi }}>
            {children}
        </UserContext.Provider>
    );
};