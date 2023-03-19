import { useCallback, useMemo } from "react";

import { Box, NavBar, NavItemProps } from "@axelor/ui";
import { MaterialIcon } from "@axelor/ui/icons/meterial-icon";

import { useMenu } from "@/hooks/use-menu";
import { useTabs } from "@/hooks/use-tabs";
import { MenuItem } from "@/services/client/meta.types";
import { legacyClassNames } from "@/styles/legacy";

function load(res: MenuItem[]) {
  const menus = res.filter((item) => item.left !== false);
  const toNavItemProps = (item: MenuItem): NavItemProps => {
    const { name, title, action, icon, iconBackground } = item;
    const items = action
      ? undefined
      : menus.filter((x) => x.parent === name).map(toNavItemProps);

    const props: NavItemProps = {
      id: name,
      title,
      items,
    };

    if (icon || !item.parent) {
      props.icon = icon
        ? ({ color }) => <i className={legacyClassNames("fa", icon)} />
        : ({ color }) => (
            <Box d="inline-flex" style={{ color }}>
              <MaterialIcon icon="list" />
            </Box>
          );
    }

    if (iconBackground) {
      props.iconColor = iconBackground;
    }

    return props;
  };
  return menus.filter((item) => !item.parent).map(toNavItemProps);
}

export function NavDrawer() {
  const tabs = useTabs();
  const { loading, menus } = useMenu();

  const handleClick = useCallback(
    async (e: any, item: any) => {
      const menu = menus.find((x) => x.name === item.id);
      if (menu?.action) {
        await tabs.open(menu.action);
      }
    },
    [tabs, menus]
  );

  const items = useMemo(() => load(menus), [menus]);

  if (loading) return null;

  return (
    <Box>
      <NavBar items={items} onClick={handleClick} />
    </Box>
  );
}
