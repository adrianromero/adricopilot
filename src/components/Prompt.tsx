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
import { Button, TextField } from "@mui/material";

import { pushPromptMessage } from "../features/llm/llmSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { generate, executor } from "./PromptFunction";
import { useAppSelector } from "../app/hooks";
import { selectOllamaSettings } from "../features/settings/settingsSlice";

function Prompt(): JSX.Element {
  const dispatch: AppDispatch = useDispatch();
  const ollama = useAppSelector(selectOllamaSettings);
  const [value, setValue] = useState<string>("");
  const [controller, setController] = useState<AbortController | null>(null);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        "& .MuiTextField-root": { gap: 1 },
      }}
    >
      <TextField
        id="standard-basic"
        label="Prompt"
        value={value}
        onChange={e => setValue(e.target.value)}
        variant="outlined"
        multiline
        rows={4}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
          bgcolor: "background.paper",
        }}
      >
        <Button
          variant="contained"
          size="small"
          endIcon={controller ? <StopIcon /> : <SendIcon />}
          onClick={async () => {
            if (controller) {
              controller.abort();
            } else {
              setValue("");
              dispatch(pushPromptMessage(value));
              const c = new AbortController();
              setController(c);
              const dispatchExecutor = executor(dispatch, c);
              await dispatchExecutor(
                generate(ollama, { system: "", prompt: value })
              );
              setController(null);
            }
          }}
        >
          Generate
        </Button>
      </Box>
    </Box>
  );
}

export default Prompt;
