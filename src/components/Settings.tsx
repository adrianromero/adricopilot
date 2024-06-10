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

import { JSX, useState, forwardRef, useEffect } from "react";
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Divider,
  Slide,
  Container,
  TextField,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { TransitionProps } from "@mui/material/transitions";
import {
  OllamaSettings,
  selectOllamaSettings,
  setOllamaSettings,
} from "../features/settings/settingsSlice";
import { useAppSelector } from "../app/hooks";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Settings(): JSX.Element {
  const [open, setOpen] = useState(false);
  const ollama = useAppSelector(selectOllamaSettings);
  const dispatch: AppDispatch = useDispatch();

  const [editOllamaSettings, setEditOllamaSettings] = useState<OllamaSettings>({
    ollamaurl: "",
    model: "",
  });

  useEffect(() => {
    if (open) {
      setEditOllamaSettings(ollama);
    }
  }, [open]);

  return (
    <>
      <IconButton
        size="large"
        aria-label="Settings"
        color="inherit"
        onClick={() => setOpen(true)}
      >
        <SettingsOutlinedIcon />
      </IconButton>
      <Dialog
        fullScreen
        open={open}
        onClose={() => setOpen(false)}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpen(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Settings
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={() => {
                dispatch(setOllamaSettings(editOllamaSettings));
                setOpen(false);
              }}
            >
              save
            </Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ p: 2 }}>
          <Typography variant="h6">Configure Ollama</Typography>
          <Divider />
          <Stack spacing={2} sx={{ p: 2 }}>
            <TextField
              label="Ollama URL"
              variant="outlined"
              size="small"
              value={editOllamaSettings.ollamaurl}
              onChange={e =>
                setEditOllamaSettings(s => ({
                  ...s,
                  ollamaurl: e.target.value,
                }))
              }
            />
            <TextField
              label="Model"
              variant="outlined"
              size="small"
              value={editOllamaSettings.model}
              onChange={e =>
                setEditOllamaSettings(s => ({
                  ...s,
                  model: e.target.value,
                }))
              }
            />
          </Stack>
        </Container>
      </Dialog>
    </>
  );
}

export default Settings;
