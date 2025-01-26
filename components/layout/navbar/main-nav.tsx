'use client';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { MegaMenu } from './mega-menu';

export function MainNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <MegaMenu />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
