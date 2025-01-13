"use client";
import { useTheme } from "next-themes";

import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThemeButton = () => {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            className="flex-shrink-0 p-2.5 ring-0 focus:ring-0 focus:border-none text-grayscale-textIcon-title"
            variant="ghost"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
            <SunIcon className="size-6 transition-all scale-100 rotate-0 dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute size-6 transition-all scale-0 rotate-90 dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};

export default ThemeButton;
