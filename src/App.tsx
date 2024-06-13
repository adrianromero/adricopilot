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
import { AppBar, Container, Stack, Toolbar } from "@mui/material";

import Prompt from "./components/Prompt";
import Generation from "./components/Generation";
import Settings from "./components/Settings";

import scroll from "./components/Scroll.module.css";
import "./App.css";
import LLMErrorDialog from "./components/LLMErrorDialog";
import ChatsDrawer from "./components/ChatsDrawer";
import AppTitle from "./components/AppTitle";

function App(): JSX.Element {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <AppBar position="fixed" color="transparent">
        <Toolbar>
          <ChatsDrawer />
          <AppTitle sx={{ flexGrow: 1 }} />

          <Box>
            <Settings />
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          backgroundColor: "background.paper",
        }}
      >
        <Toolbar />
        <Box className={scroll.scrollcontainer} sx={{ flexGrow: 1 }}>
          <Box className={scroll.scrolllist}>
            <Container>
              <Stack sx={{ p: 2 }} direction="column" spacing={1}>
                <Generation />
              </Stack>
            </Container>
          </Box>
        </Box>
        <Container>
          <Box sx={{ p: 2 }}>
            <Prompt />
          </Box>
        </Container>
      </Box>
      <LLMErrorDialog />
    </Box>
  );
}

export default App;
