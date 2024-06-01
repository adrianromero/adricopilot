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

import { JSX } from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { useLLMContext } from "../app/LLMContext";
import { AppDispatch } from "../app/store";
import { useDispatch } from "react-redux";
import { setValue } from "../features/llm/llmSlice";

function App(): JSX.Element {

    const llm = useLLMContext();
    const dispatch: AppDispatch = useDispatch();

    return (<Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, bgcolor: "background.paper" }}>
        <Button variant="contained" size="small"
            onClick={() => llm.doGenerate()}
        >Small</Button>
        <Button
            variant="contained"
            size="small"
            onClick={() => llm.doAlert()}
        >Medium</Button>
        <Button
            variant="contained"
            size="small"
            endIcon={<SendIcon />}
            onClick={() => dispatch(setValue("# Hi, *Pluto*!"))}
        >Send</Button>
    </Box>);
}

export default App;