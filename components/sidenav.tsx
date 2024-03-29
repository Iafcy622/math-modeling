"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  HomeIcon,
  ChevronRightIcon,
  CaretSortIcon,
} from "@radix-ui/react-icons";
import { ModeToggle } from "@/components/darkmode-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export function Sidebar({ className }: { className: String }) {
  const pathname = usePathname();
  const content = [
    {
      id: 1,
      name: "Least-square criterion",
      url: "least-square",
      collapsible: true,
      collapseContent: [
        { name: "Linear", url: "least-square/linear" },
        { name: "Polynomial", url: "least-square/polynomial" },
      ],
    },
  ];

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-1">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            <div className="w-full justify-between flex items-center">
              Math Modelling
              <ModeToggle />
            </div>
          </h2>
          <div className="space-y-1">
            <Link href="/" passHref>
              <Button
                variant="ghost"
                className={clsx("w-full justify-start", {
                  "bg-primary-foreground": pathname == "/",
                })}
              >
                <HomeIcon className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>
        </div>

        <div className="py-1">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight">
            Content
          </h2>
          <ScrollArea className="h-[300px] px-1">
            <div className="space-y-1 p-2">
              {content?.map((item) => {
                if (item.collapsible) {
                  return (
                    <Collapsible>
                      <CollapsibleTrigger className="w-full flex justify-between font-normal px-4">
                        {item.name}
                        <CaretSortIcon className="mr-2 h-4 w-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        {item.collapseContent?.map((collapse) => (
                          <Link
                            key={item.id}
                            href={`/${collapse.url}`}
                            passHref
                          >
                            <Button
                              variant="ghost"
                              className={clsx(
                                "w-full justify-start font-normal",
                                {
                                  "bg-primary-foreground":
                                    pathname == `/${collapse.url}`,
                                }
                              )}
                            >
                              <ChevronRightIcon className="mr-2 h-4 w-4" />
                              {collapse.name}
                            </Button>
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                } else {
                  return (
                    <Link key={item.id} href={`/${item.url}`} passHref>
                      <Button
                        variant="ghost"
                        className={clsx("w-full justify-start font-normal", {
                          "bg-primary-foreground": pathname == `/${item.url}`,
                        })}
                      >
                        {item.name}
                      </Button>
                    </Link>
                  );
                }
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
