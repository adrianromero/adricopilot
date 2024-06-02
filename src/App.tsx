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
  Button,
  IconButton,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import ActionsBar from "./components/ActionsBar";
import Generation from "./components/Generation";

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
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              ADRICOPILOT
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Box
        sx={{
          display: "flex",
          p: 1,
          gap: 1,
          flexGrow: 1,
          bgcolor: "background.paper",
        }}
      >
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            "& .MuiTextField-root": { gap: 1, width: "50ch" },
          }}
        >
          <TextField
            id="filled-basic"
            label="System prompt"
            variant="filled"
            multiline
            rows={4}
          />
          <TextField
            id="standard-basic"
            label="Prompt"
            variant="filled"
            multiline
            rows={4}
          />
          <ActionsBar />
        </Box>
        <Stack
          sx={{ flexGrow: 1 }}
          direction="column"
          justifyContent="flex-end"
          alignItems="flex-start"
          spacing={1}
        >
          <Generation />
        </Stack>
      </Box>
    </Box>
  );
}

export default App;
