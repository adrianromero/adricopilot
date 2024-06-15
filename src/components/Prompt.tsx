/*
ADRICOPILOT
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

import { JSX, useState } from "react";
import Box from "@mui/material/Box";

import SendIcon from "@mui/icons-material/Send";
import StopIcon from "@mui/icons-material/Stop";
import {
  IconButton,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import {
  generateGeneral,
  generatePhysics,
  generateJavascript,
  generateGrader,
  executor,
  OllamaGenerate,
} from "./PromptFunction";
import { useAppSelector } from "../app/hooks";
import { selectOllamaSettings } from "../features/settings/settingsSlice";

type Modes = "general" | "physics" | "javascript" | "grader";

const MODEFUNCS: Map<Modes, OllamaGenerate> = new Map([
  ["general", generateGeneral],
  ["physics", generatePhysics],
  ["javascript", generateJavascript],
  ["grader", generateGrader],
]);

function Prompt(): JSX.Element {
  const dispatch: AppDispatch = useDispatch();
  const ollama = useAppSelector(selectOllamaSettings);
  const [value, setValue] = useState<string>("");
  const [mode, setMode] = useState<Modes>("general");
  const [controller, setController] = useState<AbortController | null>(null);

  const generateAction = async () => {
    if (controller) {
      controller.abort();
    } else {
      setValue("");
      const c = new AbortController();
      setController(c);
      const dispatchExecutor = executor(dispatch, c);
      await dispatchExecutor(MODEFUNCS.get(mode)!(ollama, { question: value }));
      setController(null);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        "& .MuiTextField-root": { gap: 1 },
      }}
    >
      <ToggleButtonGroup
        exclusive
        value={mode}
        onChange={(_evt, newmode) => {
          setMode(newmode);
        }}
        aria-label="generation selection"
        size="small"
      >
        <ToggleButton value="general" aria-label="general">
          General
        </ToggleButton>
        <ToggleButton value="physics" aria-label="maths">
          Physics
        </ToggleButton>
        <ToggleButton value="javascript" aria-label="javascript">
          Javascript
        </ToggleButton>
        <ToggleButton value="grader" aria-label="grader">
          Grader
        </ToggleButton>
      </ToggleButtonGroup>
      <TextField
        id="standard-basic"
        placeholder="How can I help you today?"
        value={value}
        onChange={e => setValue(e.target.value)}
        variant="outlined"
        multiline
        rows={4}
        onKeyUp={e => {
          if (e.key === "Enter" && !e.shiftKey) {
            generateAction();
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="large" onClick={() => generateAction()}>
                {controller ? (
                  <StopIcon fontSize="inherit" />
                ) : (
                  <SendIcon fontSize="inherit" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}

export default Prompt;
