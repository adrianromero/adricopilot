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

import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store";
import {
  createChatMessage,
  addChatMessageGeneration,
} from "../features/llm/llmSlice";

export type LLMContextType = {
  doAlert: () => void;
  doGenerate: () => void;
};

const emptyLLMContext = {
  doAlert: () => {},
  doGenerate: () => {},
};

export const LLMContext = React.createContext<LLMContextType>(emptyLLMContext);
export const useLLMContext = () => useContext(LLMContext);

const LLMContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch: AppDispatch = useDispatch();

  const doAlert = () => alert("Hello!!!!");

  const generate = async () => {
    const data = {
      model: "llama3",
      system:
        'You are a developer expert in programming languages. Format all language comparisons as formatted lists with two sections: "1st language features" and  "2nd language features".',
      prompt: 'Compare "Rust" and "Go"',
      stream: true,
      options: {
        num_predict: 50,
      },
    };

    dispatch(createChatMessage());

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "error",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });

    const body = response.body;
    if (body === null) {
      throw new Error("Error!!!");
    }

    const reader = body.getReader();
    const decoder = new TextDecoder();
    do {
      const { done, value } = await reader.read();
      if (value) {
        const chunk = JSON.parse(decoder.decode(value)); // a risk of exception
        const result = chunk.response as string;
        dispatch(addChatMessageGeneration(result));
      }
      if (done) {
        break;
      }
    } while (true);
  };

  const doGenerate = () => {
    generate()
      .then(() => {
        // SUCCESS
      })
      .catch(error => {
        // Error
      });
  };

  return (
    <LLMContext.Provider value={{ doAlert, doGenerate }}>
      {children}
    </LLMContext.Provider>
  );
};

export default LLMContextProvider;
