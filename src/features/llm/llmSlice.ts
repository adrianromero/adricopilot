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

export interface ChatGenerating {
  result: "GENERATING";
}

export interface ChatSuccess {
  result: "SUCCESS";
  description: string; // An info description
  done_reason: string;
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
}

export interface ChatError {
  result: "ERROR";
  description: string;
}

export interface PromptMessage {
  type: "prompt";
  key: string;
  text: string;
}

export interface ChatMessage {
  type: "chat";
  key: string;
  text: string;
  info: ChatGenerating | ChatSuccess | ChatError;
}

export interface LLMAlert {
  open: boolean;
  severity: "error" | "info" | "success" | "warning";
  title: string;
  description: string;
}

interface LLMState {
  status: "READY" | "GENERATING";
  generating: ChatMessage | null;
  chat: (ChatMessage | PromptMessage)[];
  alert: LLMAlert;
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
