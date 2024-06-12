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

export interface ChatErrorInfo {
  open: boolean;
  severity: "error" | "info" | "success" | "warning";
  title: string;
  description: string;
}

export interface ChatErrorDialogProps extends ChatErrorInfo {
  handleClose: () => void;
}

function ChatErrorDialog({
  open,
  severity,
  title,
  description,
  handleClose,
}: ChatErrorDialogProps): JSX.Element | null {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={true}
      maxWidth="xs"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Alert severity={severity}>
        <AlertTitle id="alert-dialog-title">{title}</AlertTitle>
        <div id="alert-dialog-description">{description}</div>
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
