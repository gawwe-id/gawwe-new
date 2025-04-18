"use client";

import { memo, useState, useEffect, useCallback } from "react";
import {
  Box,
  Divider,
  GlobalStyles,
  Input,
  List,
  Sheet,
  listItemButtonClasses,
} from "@mui/joy";
import { useSession } from "next-auth/react";
import { KeyboardCommandKeyRounded, SearchRounded } from "@mui/icons-material";
import { usePathname } from "next/navigation";

// Project imports
import TitleLogo from "./TitleLogo";
import UserDisplay from "./UserDisplay";
import ListMenuItem from "./ListMenuItem";
import { closeSidebar } from "../utils";
import { Menu, useMenus } from "../menu-items";

// Types
interface SidebarProps {
  className?: string;
}

const SIDEBAR_WIDTH = {
  default: "240px",
  lg: "245px",
};

const TRANSITION_DURATION = "0.4s";

const SidebarOverlay = memo(({ onClick }: { onClick: () => void }) => (
  <Box
    className="Sidebar-overlay"
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      opacity: "var(--SideNavigation-slideIn)",
      backgroundColor: "var(--joy-palette-background-backdrop)",
      transition: `opacity ${TRANSITION_DURATION}`,
      transform: {
        xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
        lg: "translateX(-100%)",
      },
    }}
    onClick={onClick}
  />
));
SidebarOverlay.displayName = "SidebarOverlay";

const SearchInput = memo(() => (
  <Input
    size="sm"
    startDecorator={<SearchRounded />}
    endDecorator={<KeyboardCommandKeyRounded />}
    placeholder="Cari..."
  />
));
SearchInput.displayName = "SearchInput";

export type PathNormalizer = (path: string) => string;

const Sidebar = ({ className }: SidebarProps) => {
  const { data: session } = useSession();
  const role = session?.user.role;
  const pathname = usePathname();
  const { agency, agency_bottom, participant, participant_bottom } = useMenus();

  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [activeMenuItem, setActiveMenuItem] = useState<string>("");

  const menuItems = role === "participant" ? participant : agency;
  const bottomMenuItems =
    role === "participant" ? participant_bottom : agency_bottom;

  const normalizePath: PathNormalizer = useCallback((path: string): string => {
    if (!path) return "";

    const pathParts = path.split("/");

    if (pathParts.length > 1 && /^[a-z]{2}$/.test(pathParts[1] as string)) {
      return "/" + pathParts.slice(2).join("/");
    }

    return path;
  }, []);

  const isPathMatch = useCallback(
    (menuUrl: string, currentPath: string): boolean => {
      if (!menuUrl || !currentPath) return false;

      const cleanCurrentPath = currentPath.split("?")[0] as string;
      const baseMenuUrl = menuUrl.split("?")[0] as string;

      const normalizedCurrentPath = normalizePath(cleanCurrentPath);

      if (normalizedCurrentPath === baseMenuUrl) return true;

      if (normalizedCurrentPath.startsWith(baseMenuUrl)) {
        if (baseMenuUrl === "/") return normalizedCurrentPath === "/";

        const nextChar = normalizedCurrentPath.charAt(baseMenuUrl.length);
        return nextChar === "" || nextChar === "/";
      }

      return false;
    },
    [normalizePath]
  );

  useEffect(() => {
    if (!pathname) return;

    const findActiveMenu = (items: Menu[]): void => {
      for (const item of items) {
        if (isPathMatch(item.url, pathname)) {
          setActiveMenuItem(item.id);
          return;
        }

        if (item.children) {
          const childMatch = item.children.find((child) =>
            isPathMatch(child.url, pathname)
          );
          if (childMatch) {
            setActiveMenuItem(childMatch.id);
            // Keep parent menu open
            if (!openMenus.includes(item.id)) {
              setOpenMenus((prev) => [...prev, item.id]);
            }
            return;
          }
        }
      }
    };

    findActiveMenu(menuItems);
    findActiveMenu(bottomMenuItems);
  }, [pathname, isPathMatch, menuItems, bottomMenuItems, openMenus]);

  const toggleMenu = useCallback((menuId: string): void => {
    setOpenMenus((prev) => {
      if (prev.includes(menuId)) {
        return prev.filter((id) => id !== menuId);
      } else {
        return [...prev, menuId];
      }
    });
  }, []);

  const setActiveMenuItemCallback = useCallback((id: string): void => {
    setActiveMenuItem(id);
  }, []);

  interface MenuListProps {
    items: Menu[];
  }

  const MenuList = memo(({ items }: MenuListProps) => (
    <List
      size="sm"
      sx={{
        gap: 1,
        "--List-nestedInsetStart": "30px",
        "--ListItem-radius": (theme) => theme.vars.radius.sm,
      }}
    >
      {items.map((menu) => (
        <ListMenuItem
          key={menu.id}
          menu={menu}
          isOpen={openMenus.includes(menu.id)}
          isActive={activeMenuItem === menu.id}
          toggleMenu={() => toggleMenu(menu.id)}
          setActiveMenuItem={setActiveMenuItemCallback}
          activeMenuItem={activeMenuItem}
          normalizePath={normalizePath}
        />
      ))}
    </List>
  ));
  MenuList.displayName = "MenuList";

  const BottomMenuList = memo(({ items }: MenuListProps) => (
    <List
      size="sm"
      sx={{
        mt: "auto",
        flexGrow: 0,
        "--ListItem-radius": (theme) => theme.vars.radius.sm,
        "--List-gap": "8px",
      }}
    >
      {items.map((menu) => (
        <ListMenuItem
          key={menu.id}
          menu={menu}
          isOpen={openMenus.includes(menu.id)}
          isActive={activeMenuItem === menu.id}
          toggleMenu={() => toggleMenu(menu.id)}
          setActiveMenuItem={setActiveMenuItemCallback}
          activeMenuItem={activeMenuItem}
          normalizePath={normalizePath}
        />
      ))}
    </List>
  ));
  BottomMenuList.displayName = "BottomMenuList";

  if (!role) return null;

  return (
    <Sheet
      className={`Sidebar ${className || ""}`}
      sx={{
        position: { xs: "fixed", md: "sticky" },
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: `transform ${TRANSITION_DURATION}, width ${TRANSITION_DURATION}`,
        zIndex: 1,
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
            "--Sidebar-width": SIDEBAR_WIDTH.default,
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": SIDEBAR_WIDTH.lg,
            },
          },
        })}
      />
      <SidebarOverlay onClick={closeSidebar} />
      <TitleLogo />
      <SearchInput />

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
        <MenuList items={menuItems} />
        <BottomMenuList items={bottomMenuItems} />
      </Box>

      <Divider />
      <UserDisplay />
    </Sheet>
  );
};

export default memo(Sidebar);
