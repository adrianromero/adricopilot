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
import {
  AppBar,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import Prompt from "./components/Prompt";
import Generation from "./components/Generation";
import ChatErrorDialog from "./components/ChatErrorDialog";

import scroll from "./components/Scroll.module.css";
import "./App.css";

function App(): JSX.Element {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box sx={{ display: "flex" }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="div">
                ADRICOPILOT
              </Typography>
              <Typography
                variant="caption"
                component="div"
                color="secondary"
                sx={{ marginLeft: 1 }}
              >
                SETTINGS
              </Typography>
            </Box>
            <Box>
              <IconButton size="large" aria-label="Settings" color="inherit">
                <SettingsOutlinedIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          backgroundColor: "background.paper",
        }}
      >
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
      <ChatErrorDialog />
    </Box>
  );
}

export default App;
