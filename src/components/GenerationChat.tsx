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
import { Chip, Paper, Typography } from "@mui/material";
import type { ChatMessage } from "../features/llm/llmSlice";
import DotsPulse from "./DotsPulse";

import generation from "./Generation.module.css";

interface GenerationChatProps {
  chatMessage: ChatMessage;
}

export default function GenerationChat({
  chatMessage,
}: GenerationChatProps): JSX.Element {
  let footer;
  if (chatMessage.info.result === "GENERATING") {
    footer = <DotsPulse />;
  } else if (chatMessage.info.result === "ERROR") {
    footer = (
      <Chip
        label={chatMessage.info.description}
        color="error"
        size="small"
        variant="outlined"
      />
    );
  } else {
    // SUCCESS
    footer = (
      <>
        {/* <IconButton aria-label="delete" size="small">
            <DeleteIcon fontSize="small" />
          </IconButton> */}
        {chatMessage.info.description && (
          <Chip
            label={chatMessage.info.description}
            color="success"
            size="small"
            variant="outlined"
          />
        )}
      </>
    );
  }

  const text = chatMessage.text;
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
        Empty generation...
      </Typography>
    );
  } else {
    textcomponent = <Markdown>{text}</Markdown>;
  }

  return (
    <Paper
      sx={{
        p: 1,
        alignSelf: "stretch",
        backgroundColor: "#fcfcfc",
      }}
      variant="outlined"
      className={generation.message}
    >
      {textcomponent}
      <div style={{ position: "relative", height: "10px" }}>
        <div style={{ position: "absolute", bottom: 0, right: 0 }}>
          {footer}
        </div>
      </div>
    </Paper>
  );
}