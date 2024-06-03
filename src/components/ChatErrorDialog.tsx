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
import {
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogActions,
} from "@mui/material";
import { useAppSelector } from "../app/hooks";
import { closeAlert, selectAlert } from "../features/llm/llmSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";

function ChatErrorDialog(): JSX.Element | null {
  const alert = useAppSelector(selectAlert);
  const dispatch: AppDispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeAlert());
  };

  return (
    <Dialog
      open={alert.open}
      onClose={handleClose}
      fullWidth={true}
      maxWidth="xs"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Alert severity={alert.severity}>
        <AlertTitle id="alert-dialog-title">{alert.title}</AlertTitle>
        <div id="alert-dialog-description">{alert.description}</div>
      </Alert>

      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ChatErrorDialog;
