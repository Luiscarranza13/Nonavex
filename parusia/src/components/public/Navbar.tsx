"use client";

import { type MouseEvent, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Menu, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { whatsappUrl } from "@/utils/constants";

const links = [
  ["Inicio", "#inicio"],
  ["Beneficios", "#beneficios"],
  ["Producto", "#producto"],
  ["Testimonios", "#testimonios"],
  ["Contacto", "#contacto"],
];

export function Navbar() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin);
    const header = headerRef.current;
    if (!header) return;

    function handleScroll() {
      gsap.to(header, {
        boxShadow: window.scrollY > 12 ? "0 12px 30px rgba(15, 23, 42, 0.10)" : "0 0 0 rgba(15, 23, 42, 0)",
        duration: 0.25,
        ease: "power2.out",
      });
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToSection(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (!href.startsWith("#")) return;
    event.preventDefault();
    gsap.to(window, { duration: 0.85, ease: "power3.inOut", scrollTo: { y: href, offsetY: 64 } });
  }

  return (
    <header ref={headerRef} className="sticky top-0 z-40 border-b bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="flex size-9 items-center justify-center rounded-lg bg-slate-950 text-white">
            P
          </span>
          <span className="text-xl text-slate-950">Parusia</span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={(event) => scrollToSection(event, href)} className="text-sm font-semibold text-slate-600 hover:text-primary">
              {label}
            </a>
          ))}
          <Button asChild data-magnetic className="bg-red-600 text-white hover:bg-red-700">
            <a href={whatsappUrl()} target="_blank" rel="noreferrer">
              <ShoppingBag /> Comprar por WhatsApp
            </a>
          </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden" aria-label="Abrir menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="mt-8 grid gap-4">
              {links.map(([label, href]) => (
                <a key={href} href={href} onClick={(event) => scrollToSection(event, href)} className="text-base font-semibold">
                  {label}
                </a>
              ))}
              <Button asChild className="bg-red-600 text-white hover:bg-red-700">
                <a href={whatsappUrl()} target="_blank" rel="noreferrer">
                  Comprar por WhatsApp
                </a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
