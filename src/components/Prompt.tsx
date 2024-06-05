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
import { LoadingButton } from "@mui/lab";
import SendIcon from "@mui/icons-material/Send";
import { TextField } from "@mui/material";

import { useAppSelector } from "../app/hooks";
import { selectStatus, pushPromptMessage } from "../features/llm/llmSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { generateLangCompare, generate, executor } from "./PromptFunction";

function Prompt(): JSX.Element {
  const status = useAppSelector(selectStatus);
  const dispatch: AppDispatch = useDispatch();

  const [value, setValue] = useState<string>("");

  const dispatchExecutor = executor(dispatch);

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        "& .MuiTextField-root": { gap: 1, width: "50ch" },
      }}
    >
      <TextField
        id="standard-basic"
        label="Prompt"
        value={value}
        onChange={e => setValue(e.target.value)}
        variant="filled"
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
        <LoadingButton
          variant="contained"
          size="small"
          endIcon={<SendIcon />}
          loading={status !== "READY"}
          loadingPosition="end"
          onClick={() => {
            dispatch(pushPromptMessage(value));
            dispatchExecutor(generate({ system: "", prompt: value }));
          }}
        >
          Joke
        </LoadingButton>
        <LoadingButton
          variant="contained"
          size="small"
          endIcon={<SendIcon />}
          loading={status !== "READY"}
          loadingPosition="end"
          onClick={() =>
            dispatchExecutor(
              generateLangCompare({ prompt: 'Compare "Rust" and "Go"' })
            )
          }
        >
          Send
        </LoadingButton>
      </Box>
    </Box>
  );
}

export default Prompt;
