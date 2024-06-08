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

import { JSX, useEffect, useRef } from "react";
import { useAppSelector } from "../app/hooks";
import { selectChat, selectGenerating } from "../features/llm/llmSlice";
import GenerationChat from "./GenerationChat";
import GenerationPrompt from "./GenerationPrompt";

function Generation(): JSX.Element {
  const chat = useAppSelector(selectChat);
  const generatingChatMessage = useAppSelector(selectGenerating);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  });

  return (
    <>
      {chat.map(message =>
        message.type === "chat" ? (
          <GenerationChat key={message.key} chatMessage={message} />
        ) : (
          <GenerationPrompt key={message.key} promptMessage={message} />
        )
      )}
      {generatingChatMessage && (
        <GenerationChat
          key="generatingmessage"
          chatMessage={generatingChatMessage}
        />
      )}
      <div ref={ref}></div>
    </>
  );
}

export default Generation;
