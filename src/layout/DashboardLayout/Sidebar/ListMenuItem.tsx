import {
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  Typography,
} from "@mui/joy";
import React, { useEffect, useState, useCallback, memo } from "react";
import Toggler from "./Toggler";
import { KeyboardArrowDown } from "@mui/icons-material";
import Link from "next/link";
import { Menu } from "../menu-items";
import { usePathname } from "next/navigation";

type PathNormalizer = (path: string) => string;

interface ListMenuItemProps {
  menu: Menu;
  isOpen?: boolean;
  isActive?: boolean;
  toggleMenu?: () => void;
  setActiveMenuItem?: (id: string) => void;
  activeMenuItem?: string;
  normalizePath?: PathNormalizer;
}

const ListMenuItem: React.FC<ListMenuItemProps> = ({
  menu,
  isOpen,
  isActive,
  toggleMenu,
  setActiveMenuItem,
  activeMenuItem,
  normalizePath,
}) => {
  const pathname = usePathname();
  const [forceOpen, setForceOpen] = useState<boolean>(isOpen || false);

  const isPathMatch = useCallback(
    (menuUrl: string): boolean => {
      if (!menuUrl || !pathname) return false;

      const currentPath = pathname.split("?")[0] as string;
      const baseMenuUrl = menuUrl.split("?")[0] as string;

      const normalizedCurrentPath = normalizePath
        ? normalizePath(currentPath)
        : currentPath;

      if (normalizedCurrentPath === baseMenuUrl) return true;

      if (normalizedCurrentPath.startsWith(baseMenuUrl)) {
        if (baseMenuUrl === "/") return normalizedCurrentPath === "/";

        const nextChar = normalizedCurrentPath.charAt(baseMenuUrl.length);
        return nextChar === "" || nextChar === "/";
      }

      return false;
    },
    [pathname, normalizePath]
  );

  useEffect(() => {
    if (menu.children) {
      const isChildActive = menu.children.some(
        (child) => isPathMatch(child.url) || activeMenuItem === child.id
      );
      if (isChildActive && !forceOpen) {
        setForceOpen(true);
      }
    }
  }, [pathname, menu.children, activeMenuItem, isPathMatch, forceOpen]);

  useEffect(() => {
    if (isOpen !== undefined && isOpen !== forceOpen) {
      setForceOpen(isOpen);
    }
  }, [isOpen, forceOpen]);

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
            renderToggle={({
              open,
              setOpen,
            }: {
              open: boolean;
              setOpen: React.Dispatch<React.SetStateAction<boolean>>;
            }) => (
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
                  sx={{
                    transform: open || forceOpen ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s",
                  }}
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
                    onClick={() => setActiveMenuItem?.(menu.id)}
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

export default memo(ListMenuItem);
