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
import Markdown from "react-markdown";
import { Avatar, Box, Paper, Typography } from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import type { PromptMessage } from "../features/llm/llmSlice";

import generation from "./Generation.module.css";

export interface GenerationPromptProps {
  promptMessage: PromptMessage;
}

export default function GenerationPrompt({
  promptMessage,
}: GenerationPromptProps): JSX.Element {
  const text = promptMessage.text;
  let textcomponent;
  if (!text) {
    textcomponent = (
      <Typography variant="caption" display="block">
        ...
      </Typography>
    );
  } else if (!text.trim()) {
    textcomponent = (
      <Typography variant="caption" display="block">
        Empty prompt...
      </Typography>
    );
  } else {
    textcomponent = <Markdown>{text}</Markdown>;
  }

  return (
    <Box display="flex" flexDirection="column">
      <Box
        sx={{
          alignSelf: "end",
        }}
      >
        <Avatar sx={{ mb: 0.5, bgcolor: "darkcyan", width: 24, height: 24 }}>
          <FaceIcon fontSize="small" />
        </Avatar>
        <Paper
          sx={{
            p: 1,
            backgroundColor: "#fcfcfc",
            borderRadius: 4,
          }}
          variant="outlined"
          className={generation.message}
        >
          {textcomponent}
        </Paper>
      </Box>
      <Typography
        variant="caption"
        sx={{
          alignSelf: "end",
        }}
      >
        {new Date(promptMessage.created).toLocaleString()}
      </Typography>
    </Box>
  );
}
