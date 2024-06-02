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
import { Paper } from "@mui/material";
import { useAppSelector } from "../app/hooks";
import { selectChat, ChatMessage } from "../features/llm/llmSlice";

interface GenerationMessageProps {
  chatMessage: ChatMessage;
}

function GenerationMessage({
  chatMessage,
}: GenerationMessageProps): JSX.Element {
  return (
    <Paper sx={{ p: 1, alignSelf: "stretch", backgroundColor: "#e5f6fd" }}>
      <Markdown>{chatMessage.text}</Markdown>
    </Paper>
  );
}

function Generation(): JSX.Element {
  const chat = useAppSelector(selectChat);
  return (
    <>
      {chat.map(chatMessage => (
        <GenerationMessage chatMessage={chatMessage} />
      ))}
    </>
  );
}

export default Generation;
