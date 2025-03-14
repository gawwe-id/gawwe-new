"use client";

import React from "react";
import { Breadcrumbs, Link, Typography, Stack } from "@mui/joy";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { SxProps } from "@mui/joy/styles/types";
import { Menu, useMenus } from "@/layout/DashboardLayout/menu-items";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import LanguageChanger from "./LanguageChanger";

interface BreadcrumbItem {
  title: string;
  url: string;
  icon?: React.ReactNode;
}

interface DynamicBreadcrumbsProps {
  sx?: SxProps;
}

const DynamicBreadcrumbs: React.FC<DynamicBreadcrumbsProps> = ({ sx }) => {
  const { agency, agency_bottom, participant, participant_bottom } = useMenus();
  const { t, i18n } = useTranslation();
  const pathname = usePathname();

  const currentLang = i18n.language || "en";

  const allMenus: Menu[] = [
    ...participant,
    ...agency,
    ...participant_bottom,
    ...agency_bottom,
  ];

  const findMenuItemByUrl = (
    url: string
  ): (Menu & { parent?: Menu }) | undefined => {
    let item = allMenus.find((menu) => menu.url === url);

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

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];

    breadcrumbs.push({
      title: t("home"),
      url: `/${currentLang}`,
      icon: <HomeRoundedIcon />,
    });

    const pathSegments = pathname.split("/").filter(Boolean);

    const supportedLocales = ["en", "id"];
    const startIndex =
      pathSegments[0] && supportedLocales.includes(pathSegments[0]) ? 1 : 0;

    let currentPath = "";

    for (let i = startIndex; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      currentPath += `/${segment}`;

      const menuItem = findMenuItemByUrl(currentPath);

      if (menuItem) {
        if ("parent" in menuItem && menuItem.parent) {
          const parentAlreadyAdded = breadcrumbs.some(
            (item) => item.title === menuItem.parent?.title
          );

          if (!parentAlreadyAdded) {
            breadcrumbs.push({
              title: menuItem.parent.title,
              url: menuItem.parent.url
                ? `/${currentLang}${menuItem.parent.url}`
                : "#",
            });
          }
        }

        breadcrumbs.push({
          title: menuItem.title,
          url: `/${currentLang}${menuItem.url}`,
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Stack
      sx={{ ...sx }}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
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

      <LanguageChanger />
    </Stack>
  );
};

export default DynamicBreadcrumbs;
