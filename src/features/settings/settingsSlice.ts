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

export interface OllamaSettings {
  ollamaurl: string;
  model: string;
  seed: number | null;
  temperature: number | null;
}

const OLLAMAKEY = "adricopilot-ollama-settings";

function initOllamaSettings(): OllamaSettings {
  return {
    ollamaurl: "http://localhost:11434/api/",
    model: "llama3:latest",
    seed: null,
    temperature: null,
  };
}

function loadOllamaSettings(): OllamaSettings {
  try {
    const ollamajson = localStorage.getItem(OLLAMAKEY);
    if (ollamajson) {
      return JSON.parse(ollamajson) as OllamaSettings;
    }
  } catch (error) {}
  return initOllamaSettings();
}

function saveOllamaSettings(ollama: OllamaSettings) {
  try {
    localStorage.setItem(OLLAMAKEY, JSON.stringify(ollama));
  } catch (error) {}
}

interface SettingsState {
  ollama: OllamaSettings;
}

const initialState: SettingsState = {
  ollama: loadOllamaSettings(),
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setOllamaSettings: (state, action: PayloadAction<OllamaSettings>) => {
      state.ollama = action.payload;
      saveOllamaSettings(action.payload);
    },
  },
  selectors: {
    selectOllamaSettings: (settings: SettingsState) => settings.ollama,
  },
});

export const { setOllamaSettings } = settingsSlice.actions;

export const { selectOllamaSettings } = settingsSlice.selectors;
