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

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ChatErrorInfo } from "../../components/ChatErrorDialog";
export interface ChatGenerating {
  result: "GENERATING";
}

export interface ChatComplete {
  result: string;
  description: string;
  completed: Date;
}

export interface ChatSuccess extends ChatComplete {
  result: "SUCCESS";
  done_reason: string;
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
}

export interface ChatError extends ChatComplete {
  result: "ERROR";
}

export interface BaseMessage {
  type: string;
  key: string;
  text: string;
  created: Date;
}
export interface PromptMessage extends BaseMessage {
  type: "prompt";
}

export interface ChatMessage extends BaseMessage {
  type: "chat";
  info: ChatGenerating | ChatSuccess | ChatError;
}

interface LLMState {
  status: "READY" | "GENERATING";
  generating: ChatMessage | null;
  chat: (ChatMessage | PromptMessage)[];
  alert: ChatErrorInfo;
}

const initialState: LLMState = {
  status: "READY",
  generating: null,
  chat: [],

  alert: { open: false, severity: "success", title: "", description: "" },
};

const KEYCHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
let result = "";
const KEYCHARSLENGTH = KEYCHARS.length;

function generateKey(): string {
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * KEYCHARSLENGTH);
    result += KEYCHARS.charAt(randomIndex);
  }
  return result;
}

export const llmSlice = createSlice({
  name: "llm",
  initialState,
  reducers: {
    startChatMessage: state => {
      state.status = "GENERATING";
      state.generating = {
        type: "chat",
        key: generateKey(),
        text: "",
        info: { result: "GENERATING" },
        created: new Date(),
      };
    },
    addChatMessage: (state, action: PayloadAction<string>) => {
      state.generating!.text += action.payload;
    },
    successChatMessage: (state, action: PayloadAction<ChatSuccess>) => {
      state.generating!.info = action.payload;
      state.chat.push(state.generating!);
      state.generating = null;
      state.status = "READY";
    },
    failureChatMessage: (state, action: PayloadAction<ChatError>) => {
      if (state.generating!.text) {
        // Partial message generated
        state.generating!.info = action.payload;
        state.chat.push(state.generating!);
      } else {
        //  No error generated. Discard generating message;
        state.alert = {
          open: true,
          severity: "error",
          title: "Error generating message",
          description: action.payload.description,
        };
      }
      state.generating = null;
      state.status = "READY";
    },
    pushPromptMessage: (state, action: PayloadAction<string>) => {
      state.chat.push({
        type: "prompt",
        key: generateKey(),
        text: action.payload,
        created: new Date(),
      });
    },
    closeAlert: state => {
      state.alert.open = false;
    },
  },
  selectors: {
    selectChat: (llm: LLMState) => llm.chat,
    selectGenerating: (llm: LLMState) => llm.generating,
    selectStatus: (llm: LLMState) => llm.status,
    selectAlert: (llm: LLMState) => llm.alert,
  },
});

// const dispatch: AppDispatch = useDispatch()
// dispatch(startChatMessage())
export const {
  startChatMessage,
  addChatMessage,
  successChatMessage,
  failureChatMessage,
  pushPromptMessage,
  closeAlert,
} = llmSlice.actions;
// const value = useAppSelector(selectChat);
export const { selectChat, selectGenerating, selectStatus, selectAlert } =
  llmSlice.selectors;
