import { MenuDataItem } from '@ant-design/pro-components';

export const generateMenu = (key: string, name: string, menuData: MenuDataItem[]) => {
  menuData.forEach((menu: MenuDataItem) => {
    if (Array.isArray(menu?.children)) {
      generateMenu(key, name, menu.children);
    }

    if (key === menu.key) {
      menu.name = name;
    }
    return;
  });
};
