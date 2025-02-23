"use client";

import React from "react";
import { Breadcrumbs, Link, Typography, Box } from "@mui/joy";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { SxProps } from "@mui/joy/styles/types";
import {
  Menu,
  agency,
  agency_bottom,
  participant,
  participant_bottom,
} from "@/layout/DashboardLayout/menu-items";
import { usePathname } from "next/navigation";

// Define interfaces for our menu structure

interface BreadcrumbItem {
  title: string;
  url: string;
  icon?: React.ReactNode;
}

interface DynamicBreadcrumbsProps {
  sx?: SxProps;
}

const DynamicBreadcrumbs: React.FC<DynamicBreadcrumbsProps> = ({ sx }) => {
  // Combine all menus
  const allMenus: Menu[] = [
    ...participant,
    ...agency,
    ...participant_bottom,
    ...agency_bottom,
  ];

  // Function to find menu item by URL
  const findMenuItemByUrl = (
    url: string
  ): (Menu & { parent?: Menu }) | undefined => {
    // First try direct match
    let item = allMenus.find((menu) => menu.url === url);

    // If not found, check children
    if (!item) {
      for (const menu of allMenus) {
        if (menu.children) {
          const child = menu.children.find((child) => child.url === url);
          if (child) {
            return { ...child, parent: menu };
          }
        }
      }
    }

    return item;
  };

  // Generate breadcrumb items
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathname = usePathname();
    const paths = pathname.split("/").filter(Boolean);
    let currentPath = "";
    const breadcrumbs: BreadcrumbItem[] = [];

    // Add home
    breadcrumbs.push({
      title: "Home",
      url: "/",
      icon: <HomeRoundedIcon />,
    });

    // Generate rest of the breadcrumbs
    paths.forEach((path) => {
      currentPath += `/${path}`;
      const menuItem = findMenuItemByUrl(currentPath);

      if (menuItem) {
        if ("parent" in menuItem && menuItem.parent) {
          // Add parent if it's a child menu item
          breadcrumbs.push({
            title: menuItem.parent.title,
            url: menuItem.parent.url || "#",
            // icon: menuItem.parent.icon
          });
        }
        breadcrumbs.push({
          title: menuItem.title,
          url: menuItem.url,
          // icon: menuItem.icon
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Box sx={{ ...sx }}>
      <Breadcrumbs
        size="sm"
        aria-label="breadcrumbs"
        separator={<ChevronRightRoundedIcon fontSize="small" />}
        sx={{ pl: 0 }}
      >
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return isLast ? (
            <Typography
              key={item.url}
              color="primary"
              sx={{
                fontSize: 12,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {item.icon}
              {item.title}
            </Typography>
          ) : (
            <Link
              key={item.url}
              underline="hover"
              color="neutral"
              href={item.url}
              sx={{
                fontSize: 12,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {item.icon}
              {item.title}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default DynamicBreadcrumbs;
