"use client"

import Link from "next/link"

import {
  Box,
  Divider,
  GlobalStyles,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  Sheet,
  Typography,
  listItemButtonClasses,
} from "@mui/joy"

// project import
import TitleLogo from "./TitleLogo"
import UserDisplay from "./UserDisplay"
import Toggler from "./Toggler"
import { closeSidebar } from "../utils"
import { Menu, participant, participant_bottom } from "../menu-items/participant"

// assets
import { KeyboardArrowDown, KeyboardCommandKeyRounded, SearchRounded } from "@mui/icons-material"
import ListMenuItem from "./ListMenuItem"

export default function Sidebar() {
  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: "fixed", md: "sticky" },
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        zIndex: 10000,
        height: "100dvh",
        width: "var(--Sidebar-width)",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Sidebar-width": "220px",
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": "240px",
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: "var(--SideNavigation-slideIn)",
          backgroundColor: "var(--joy-palette-background-backdrop)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={() => closeSidebar()}
      />
      <TitleLogo />
      <Input
        size="sm"
        startDecorator={<SearchRounded />}
        endDecorator={<KeyboardCommandKeyRounded />}
        placeholder="Cari..."
      />
      <Box
        mt={1}
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          [`& .${listItemButtonClasses?.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            "--List-nestedInsetStart": "30px",
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
          }}
        >
          {participant.map((menu: Menu) => {
            return (
              <ListMenuItem key={menu.id} menu={menu} />
            )
          })}
        </List>
        <List
          size="sm"
          sx={{
            mt: 'auto',
            flexGrow: 0,
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
            '--List-gap': '8px',
            // mb: 2,
          }}
        >
          {participant_bottom.map((menu) => {
            return (
              <ListMenuItem key={menu.id} menu={menu} />
            )
          })}
        </List>
      </Box>
      <Divider />
      <UserDisplay />
    </Sheet>
  )
}
