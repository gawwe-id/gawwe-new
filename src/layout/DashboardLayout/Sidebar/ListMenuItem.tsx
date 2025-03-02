import {
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  Typography,
} from "@mui/joy";
import React, { useEffect, useState } from "react";
import Toggler from "./Toggler";
import { KeyboardArrowDown } from "@mui/icons-material";
import Link from "next/link";
import { Menu } from "../menu-items";
import { usePathname } from "next/navigation";

interface ListMenuItemProps {
  menu: Menu;
  isOpen?: boolean;
  isActive?: boolean;
  toggleMenu?: () => void;
  setActiveMenuItem?: (id: string) => void;
  activeMenuItem?: string;
}

const ListMenuItem = ({
  menu,
  isOpen,
  isActive,
  toggleMenu,
  setActiveMenuItem,
  activeMenuItem,
}: ListMenuItemProps) => {
  const pathname = usePathname();
  const [forceOpen, setForceOpen] = useState(isOpen || false);

  const isPathMatch = (menuUrl: string): boolean => {
    if (!menuUrl) return false;
    const currentPath = pathname.split("?")[0];
    const baseMenuUrl = menuUrl.split("?")[0];

    if (currentPath === baseMenuUrl) return true;

    if (currentPath && currentPath.startsWith(baseMenuUrl as string)) {
      if (baseMenuUrl === "/") return currentPath === "/";

      const nextChar = currentPath.charAt(baseMenuUrl?.length || 0);
      return nextChar === "" || nextChar === "/";
    }

    return false;
  };

  useEffect(() => {
    if (menu.children) {
      const isChildActive = menu.children.some(
        (child) => isPathMatch(child.url) || activeMenuItem === child.id
      );
      if (isChildActive) {
        setForceOpen(true);
      }
    }
  }, [pathname, menu.children, activeMenuItem]);

  const isMenuActive =
    isActive || activeMenuItem === menu.id || isPathMatch(menu.url);

  const isAnyChildActive = menu.children?.some(
    (child) => isPathMatch(child.url) || activeMenuItem === child.id
  );

  const activeStyle = {
    backgroundColor: "var(--joy-palette-neutral-softBg)",
    color: "var(--joy-palette-primary-softColor)",
    fontWeight: "600",
  };

  return (
    <>
      {menu.children ? (
        <ListItem nested key={menu.id}>
          <Toggler
            defaultExpanded={forceOpen}
            renderToggle={({ open, setOpen }) => (
              <ListItemButton
                onClick={() => {
                  setOpen(!open);
                  toggleMenu?.();
                  setForceOpen(!open);
                }}
                sx={isAnyChildActive ? activeStyle : {}}
              >
                {menu.icon && <menu.icon />}
                <ListItemContent>
                  <Typography level="title-sm">{menu.title}</Typography>
                </ListItemContent>
                <KeyboardArrowDown
                  sx={[
                    open || forceOpen
                      ? { transform: "rotate(180deg)" }
                      : { transform: "none" },
                  ]}
                />
              </ListItemButton>
            )}
          >
            <List sx={{ gap: 0.5 }}>
              {menu.children.map((submenu) => {
                const isSubmenuActive =
                  isPathMatch(submenu.url) || activeMenuItem === submenu.id;

                return (
                  <Link
                    href={submenu.url}
                    key={submenu.id}
                    style={{ textDecoration: "none" }}
                    onClick={() => setActiveMenuItem?.(submenu.id)}
                  >
                    <ListItem sx={{ mt: 0.5 }}>
                      <ListItemButton sx={isSubmenuActive ? activeStyle : {}}>
                        {submenu.title}
                      </ListItemButton>
                    </ListItem>
                  </Link>
                );
              })}
            </List>
          </Toggler>
        </ListItem>
      ) : (
        <Link
          href={menu.url}
          key={menu.id}
          style={{ textDecoration: "none" }}
          onClick={() => setActiveMenuItem?.(menu.id)}
        >
          <ListItem>
            <ListItemButton sx={isMenuActive ? activeStyle : {}}>
              {menu.icon && <menu.icon />}
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
  );
};

export default ListMenuItem;
