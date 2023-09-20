import React, {createContext} from 'react'
import { useState}  from 'react';
import { useEffect } from 'react';

const AccountContext = createContext();

const AccountContextProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const savedIsLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (savedIsLoggedIn) {
          setIsLoggedIn(JSON.parse(savedIsLoggedIn));
        }
      }, []);

      const updateIsLoggedIn = (value) => {
        setIsLoggedIn(value);
        sessionStorage.setItem('isLoggedIn', JSON.stringify(value));
      };

    return (
        <AccountContext.Provider value={{ isLoggedIn, setIsLoggedIn: updateIsLoggedIn }}>
            {children}
        </AccountContext.Provider>
    );

}

export { AccountContext, AccountContextProvider };
