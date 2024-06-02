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

import { JSX } from "react";
import Box from "@mui/material/Box";
import { LoadingButton } from "@mui/lab";
import SendIcon from "@mui/icons-material/Send";
import { useLLMContext } from "../app/LLMContext";
import { useAppSelector } from "../app/hooks";
import { selectStatus } from "../features/llm/llmSlice";

function ActionBar(): JSX.Element {
  const llm = useLLMContext();
  const status = useAppSelector(selectStatus);

  return (
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
        onClick={() => llm.doGenerate()}
      >
        Send
      </LoadingButton>
    </Box>
  );
}

export default ActionBar;
