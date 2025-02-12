import { Chip, List, ListItem, ListItemButton, ListItemContent, Typography } from '@mui/joy'
import React from 'react'
import Toggler from './Toggler'
import { KeyboardArrowDown } from '@mui/icons-material'
import Link from 'next/link'
import { Menu } from '../menu-items'

interface ListMenuItemProps {
  menu: Menu
}

const ListMenuItem = ({ menu }: ListMenuItemProps) => {
  return (
    <>
      {menu.children ? (
        <ListItem nested key={menu.id}>
          <Toggler
            renderToggle={({ open, setOpen }) => (
              <ListItemButton onClick={() => setOpen(!open)}>
                <menu.icon />
                <ListItemContent>
                  <Typography level="title-sm">{menu.title}</Typography>
                </ListItemContent>
                <KeyboardArrowDown
                  sx={[
                    open
                      ? { transform: "rotate(180deg)" }
                      : { transform: "none" },
                  ]}
                />
              </ListItemButton>
            )}
          >
            <List sx={{ gap: 0.5 }}>
              {menu.children.map((submenu) => (
                <Link
                  href={submenu.url}
                  key={submenu.id}
                  style={{ textDecoration: "none" }}
                >
                  <ListItem sx={{ mt: 0.5 }}>
                    <ListItemButton>{submenu.title}</ListItemButton>
                  </ListItem>
                </Link>
              ))}
            </List>
          </Toggler>
        </ListItem>
      ) : (
        <Link
          href={menu.url}
          key={menu.id}
          style={{ textDecoration: "none" }}
        >
          <ListItem>
            <ListItemButton>
              <menu.icon />
              <ListItemContent>
                <Typography level="title-sm">{menu.title}</Typography>
              </ListItemContent>
              {menu.id === "notifications" && (
                <Chip size="sm" color="primary" variant="solid">
                  4
                </Chip>
              )}
            </ListItemButton>
          </ListItem>
        </Link>
      )}

    </>
  )
}

export default ListMenuItem