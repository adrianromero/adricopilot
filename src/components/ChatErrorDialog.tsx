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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useAppSelector } from "../app/hooks";
import {
  cleanErrorDialogMessage,
  selectErrorDialogMessage,
} from "../features/llm/llmSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";

function ChatErrorDialog(): JSX.Element | null {
  const errorDialogMessage = useAppSelector(selectErrorDialogMessage);
  const dispatch: AppDispatch = useDispatch();
  const open = errorDialogMessage !== null;
  const description = errorDialogMessage ? errorDialogMessage : "Unknown error";

  const handleClose = () => {
    dispatch(cleanErrorDialogMessage());
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">ADRCOPILOT</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ChatErrorDialog;
