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
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { TransitionProps } from "@mui/material/transitions";
import {
  selectOllamaSettings,
  setOllamaSettings,
} from "../features/settings/settingsSlice";
import { useAppSelector } from "../app/hooks";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import type { ChatErrorInfo } from "./ChatErrorDialog";
import ChatErrorDialog from "./ChatErrorDialog";

const NBSP = <>&nbsp;</>;

type ValidateResult = {
  error: boolean;
  helper: JSX.Element;
};

type ValidateValue = { value: string } & ValidateResult;

const validateError = (msg: string): ValidateResult => ({
  error: true,
  helper: <>{msg}</>,
});
const validateSuccess = (): ValidateResult => ({
  error: false,
  helper: NBSP,
});

const newValue = (value: string) => ({ value, error: false, helper: NBSP });
const newValueNumber = (value: number | null) => ({
  value: typeof value === "number" ? String(value) : "",
  error: false,
  helper: NBSP,
});
const getValueNumber = (value: string): number | null =>
  !value.trim() ? null : Number(value);
const defValue = () => newValue("");
const isError = (...values: ValidateValue[]): boolean =>
  values.some(value => value.error);

const validateOllamaurl = (value: string): ValidateResult => {
  if (!value.trim()) {
    return validateError("URL cannot be empty");
  }
  try {
    new URL(value);
  } catch (e) {
    return validateError("URL is not valid");
  }
  return validateSuccess();
};

const validateModel = (value: string): ValidateResult => {
  if (!value.trim()) {
    return validateError("Model cannot be empty");
  }
  return validateSuccess();
};

const validateSeed = (value: string): ValidateResult => {
  if (!value.trim()) {
    return validateSuccess();
  }
  const v = Number(value);
  if (Number.isNaN(v)) {
    return validateError("Seed must be a valid number");
  }
  if (!Number.isSafeInteger(v) || v < 0.0 || v >= Number.MAX_SAFE_INTEGER) {
    return validateError("Seed must be positive integer");
  }
  return validateSuccess();
};

const validateTemperature = (value: string): ValidateResult => {
  if (!value.trim()) {
    return validateSuccess();
  }
  const v = Number(value);
  if (Number.isNaN(v)) {
    return validateError("Temperature must be a valid number");
  }
  if (v < 0.0 || v > 2.0) {
    return validateError("Temperature must be between 0 and 2");
  }
  return validateSuccess();
};

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
  const [settingserror, setSettingsError] = useState<ChatErrorInfo>({
    open: false,
    severity: "success",
    title: "",
    description: "",
  });
  const ollama = useAppSelector(selectOllamaSettings);
  const dispatch: AppDispatch = useDispatch();

  const [ollamaurl, setOllamaurl] = useState(defValue());
  const [model, setModel] = useState(defValue());
  const [seed, setSeed] = useState(defValue());
  const [temperature, setTemperature] = useState(defValue());

  useEffect(() => {
    if (open) {
      setOllamaurl(newValue(ollama.ollamaurl));
      setModel(newValue(ollama.model));
      setSeed(newValueNumber(ollama.seed));
      setTemperature(newValueNumber(ollama.temperature));
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
                if (isError(ollamaurl, model, seed, temperature)) {
                  setSettingsError({
                    open: true,
                    severity: "error",
                    title: "Settings",
                    description: "Review setting configuration errors",
                  });
                  return;
                }
                dispatch(
                  setOllamaSettings({
                    ollamaurl: ollamaurl.value,
                    model: model.value,
                    seed: getValueNumber(seed.value),
                    temperature: getValueNumber(temperature.value),
                  })
                );
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
          <Grid container spacing={2} sx={{ py: 4 }} alignItems="stretch">
            <Grid item xs={12} alignContent="stretch">
              <TextField
                fullWidth
                label="Ollama URL"
                variant="outlined"
                size="small"
                value={ollamaurl.value}
                onChange={e => {
                  const value = e.target.value;
                  setOllamaurl({
                    value,
                    ...validateOllamaurl(value),
                  });
                }}
                error={ollamaurl.error}
                helperText={ollamaurl.helper}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Model"
                variant="outlined"
                size="small"
                value={model.value}
                onChange={e => {
                  const value = e.target.value;
                  setModel({ value, ...validateModel(value) });
                }}
                error={model.error}
                helperText={model.helper}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Temperature"
                variant="outlined"
                size="small"
                inputProps={{
                  inputMode: "numeric",
                  style: { textAlign: "right" },
                }}
                value={temperature.value}
                onChange={e => {
                  const value = e.target.value;
                  setTemperature({ value, ...validateTemperature(value) });
                }}
                error={temperature.error}
                helperText={temperature.helper}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Seed"
                variant="outlined"
                size="small"
                inputProps={{
                  inputMode: "numeric",
                  style: { textAlign: "right" },
                }}
                value={seed.value}
                onChange={e => {
                  const value = e.target.value;
                  setSeed({ value, ...validateSeed(value) });
                }}
                error={seed.error}
                helperText={seed.helper}
              />
            </Grid>
          </Grid>
        </Container>
      </Dialog>
      <ChatErrorDialog
        handleClose={() =>
          setSettingsError({
            open: false,
            severity: "success",
            title: "",
            description: "",
          })
        }
        {...settingserror}
      />
    </>
  );
}

export default Settings;
