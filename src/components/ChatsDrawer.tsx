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

import { JSX, useState } from "react";

import MenuIcon from "@mui/icons-material/Menu";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";

function ChatsDrawer(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 350 }} role="presentation">
          <Toolbar>
            <Avatar alt="ADRICOPILOT" sx={{ mr: 2 }} src="/adricopilot.png" />
            <Typography variant="h6">ADRICOPILOT</Typography>
          </Toolbar>
          <Divider />
          <List>
            <ListItem key="New conversation">
              <ListItemButton
                sx={{
                  borderRadius: 4,
                  border: "2px solid",
                  borderColor: "blue",
                }}
                onClick={() => setOpen(false)}
              >
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="New conversation" />
              </ListItemButton>
            </ListItem>{" "}
            <ListItem key="New conversation 2">
              <ListItemButton
                sx={{
                  borderRadius: 4,
                  border: "2px solid",
                  borderColor: "darkgray",
                }}
                onClick={() => setOpen(false)}
              >
                <ListItemAvatar>
                  <Avatar>
                    <ChatBubbleOutlineOutlinedIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Saved "
                  secondary="2 messages 6/14/2024, 4:27:45 PM"
                />
              </ListItemButton>
            </ListItem>
            <ListItem key="New conversation 3">
              <ListItemButton
                sx={{
                  borderRadius: 4,
                  border: "2px solid",
                  borderColor: "darkgray",
                }}
                onClick={() => setOpen(false)}
              >
                <ListItemAvatar>
                  <Avatar>
                    <ChatBubbleOutlineOutlinedIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Saved conversation"
                  secondary="3 messages 6/14/2024, 4:27:45 PM"
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default ChatsDrawer;
