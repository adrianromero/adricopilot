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

import { createTheme, Theme } from "@mui/material/styles";
import type {} from "@mui/lab/themeAugmentation";

// ADRICOPILOT custom theme for this app
const theme: Theme = createTheme({
  palette: {
    primary: {
      main: "#414358",
    },
    secondary: {
      main: "#afafaf",
    },
    error: {
      main: "#b50e00",
    },
    warning: {
      main: "#a9b500",
    },
    info: {
      main: "#0053b1",
    },
    success: {
      main: "#00b107",
    },
  },
  typography: {
    fontFamily: "Inter",
  },
});

export default theme;
