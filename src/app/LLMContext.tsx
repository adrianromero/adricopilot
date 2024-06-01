
/*
MYBUDDY
Copyright (C) 2024 Adrián Romero
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import React, { useContext } from "react";

export type LLMContextType = {
    doAlert: () => void
};

const emptyLLMContext = {
    doAlert: () => { }
};

export const LLMContext = React.createContext<LLMContextType>(emptyLLMContext);
export const useLLMContext = () => useContext(LLMContext);

const LLMContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const doAlert = () => alert("Hello!!!!");
    return (
        <LLMContext.Provider value={{ doAlert }}>
            {children}
        </LLMContext.Provider>
    );
};

export default LLMContextProvider;