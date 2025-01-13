"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { MegaMenu } from "./mega-menu";
import { Building2, ShoppingBag } from "lucide-react";

export function MainNav() {
    const pathname = usePathname();

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