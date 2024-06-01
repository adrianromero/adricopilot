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
import Markdown from "react-markdown";
import { Paper } from "@mui/material";
import { useAppSelector } from "../app/hooks";
import { selectValue } from "../features/llm/llmSlice";

function App(): JSX.Element {

    const markdown = useAppSelector(selectValue);

    return (<>
        <Paper sx={{ p: 1, alignSelf: "flex-end" }}>
            <Markdown>{markdown}</Markdown>
        </Paper>
    </>);
}

export default App;