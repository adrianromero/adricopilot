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

import {
  addChatMessage,
  ChatSuccess,
  failureChatMessage,
  startChatMessage,
  successChatMessage,
} from "../features/llm/llmSlice";
import { AppDispatch } from "../app/store";

type GenerateProps = {
  system: string;
  prompt: string;
};

export const generate =
  ({ system, prompt }: GenerateProps) =>
  async (dispatch: AppDispatch): Promise<ChatSuccess> => {
    const data = {
      model: "llama3",
      system,
      prompt,
      stream: true,
      options: {
        // num_predict: 25,
      },
    };

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
    let info: ChatSuccess = {
      result: "SUCCESS",
      description: "Unknown generation information",
      done_reason: "unknown",
      total_duration: 0,
      load_duration: 0,
      prompt_eval_count: 0,
      prompt_eval_duration: 0,
      eval_count: 0,
      eval_duration: 0,
    };
    do {
      const { done, value } = await reader.read();
      if (value) {
        const chunk = JSON.parse(decoder.decode(value)); // a risk of exception
        const result = chunk.response as string;
        console.log("done reason " + chunk.done_reason);
        dispatch(addChatMessage(result));
        if (chunk.done as boolean) {
          const reason = chunk.done_reason as string;
          info = {
            result: "SUCCESS",
            description: reason === "length" ? "Max tokens generated" : "",
            done_reason: reason,
            total_duration: chunk.done_duration as number,
            load_duration: chunk.load_duration as number,
            prompt_eval_count: chunk.prompt_eval_count as number,
            prompt_eval_duration: chunk.prompt_eval_duration as number,
            eval_count: chunk.eval_count as number,
            eval_duration: chunk.eval_duration as number,
          };
        }
      }
      if (done) {
        break;
      }
    } while (true);
    return info;
  };

export const generateLangCompare = ({ prompt }: { prompt: string }) =>
  generate({
    system:
      'You are a developer expert in programming languages. Format all language comparisons as formatted lists with two sections: "1st language features" and  "2nd language features".',
    prompt,
  });

export type Generate = (dispatch: AppDispatch) => Promise<ChatSuccess>;

export const executor = (dispatch: AppDispatch) => (g: Generate) => {
  dispatch(startChatMessage());
  g(dispatch)
    .then(info => {
      dispatch(successChatMessage(info));
    })
    .catch(error => {
      let description;
      if (error instanceof Error) {
        description = error.message;
      } else {
        description = "Unknown error generating message";
      }
      dispatch(
        failureChatMessage({
          result: "ERROR",
          description,
        })
      );
    });
};

//executor(dispatch)(generate());
