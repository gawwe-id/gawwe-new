"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import i18nConfig from "../../next-i18next.config";
import {
  Dropdown,
  IconButton,
  Menu,
  MenuItem,
  ListItemDecorator,
  Tooltip,
  MenuButton,
} from "@mui/joy";
import { TranslateRounded } from "@mui/icons-material";

export default function LanguageChanger() {
  const { i18n, t } = useTranslation();
  const currentLocale = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();

  const changeLanguage = (newLocale: string) => {
    // set cookie for next-i18n-router
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${date.toUTCString()};path=/`;

    // redirect to the new locale path
    if (
      currentLocale === i18nConfig.defaultLocale &&
      !i18nConfig.prefixDefault
    ) {
      router.push("/" + newLocale + currentPathname);
    } else {
      router.push(
        currentPathname.replace(`/${currentLocale}`, `/${newLocale}`)
      );
    }

    router.refresh();
  };

  const flagBase64 = {
    // UK flag
    en: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAMCAMAAAC+5dbKAAAAwFBMVEXJEjEAH2jPGzcRM3frvsjcY3bfucXYUWf3xcpqfKbYXHHwytLwt78mQHXbtLtFVnoeOHn87e/y4OTc1+Hx2t+dqcTsrbd6jLFqdqGBcZd7bJTIdovfdYbMZHssPXoiN27S3urj3ue0vtKprMWDkKu/kqicgqDIip90fJzpjJlLZ5nTbILBanrIWXKtUmDy6/DCyNmvtcyWocDIrrLqn6u1n6W0jKOad5doZJBQXI/mf45JVosyT4msfIQoSIS+NkrVIbP2AAAA1ElEQVQY00WPha7DMAxF3dppsjYpM455e8z0/3/1XE3armTLOromkOouQ4s1EeBOxgKrg/sE607QrEDmLgjmYd26ebwEK6y6ViUFsl+U+N7I5zj7DgAx/HoVu3Q6Z/9i4+bR/R4xAPIdh7RWiiRIUlp55Dj+CsC2OeCmkdhnTqyxvkG2nYG7HPI8usxJFWli9AIW4n4eabl54PsX02gnVh/jXuv3Mc1lU+P2xPdjmXifp7c+gCwmcajx+m9YzLxWrsE/NlVvzGC2x7+uNMNg+mXi//wDDkAQBB2ZMggAAAAASUVORK5CYII=",
    // Indonesia flag
    id: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAPAgMAAABywbzFAAAACVBMVEX/////AAD/f39MED/oAAAAFUlEQVQI12MIBYEQEqhVILCCgVQAADH1EeZRS+S1AAAAAElFTkSuQmCC",
  };

  // Language options with flags
  const languages = [
    { code: "en", name: "English", flag: flagBase64.en },
    { code: "id", name: "Bahasa Indonesia", flag: flagBase64.id },
  ];

  return (
    <Dropdown>
      <Tooltip title={t("language")} placement="bottom">
        <MenuButton variant="soft" color="neutral" size="sm">
          <TranslateRounded />
        </MenuButton>
      </Tooltip>

      <Menu placement="bottom-end" size="sm" sx={{ minWidth: "200px" }}>
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            selected={currentLocale === lang.code}
            onClick={() => changeLanguage(lang.code)}
          >
            <ListItemDecorator>
              <img
                src={lang.flag}
                alt={`${lang.name} flag`}
                style={{ width: 20, height: 14, display: "block" }}
              />
            </ListItemDecorator>
            {lang.name}
          </MenuItem>
        ))}
      </Menu>
    </Dropdown>
  );
}
