"use client";

import { useEffect } from "react";

export default function HomeInteractions() {
  useEffect(() => {
    document.documentElement.classList.add("js");

    const menuToggle = document.getElementById("menuToggle");
    const mainMenu = document.getElementById("mainMenu");
    const form = document.getElementById("appointmentForm") as HTMLFormElement | null;
    const formNote = document.getElementById("formNote");

    const closeMenu = () => {
      mainMenu?.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    };

    const toggleMenu = () => {
      if (!mainMenu || !menuToggle) return;
      const open = mainMenu.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
    };

    const handleAnchorClick = (event: Event) => {
      const link = event.currentTarget as HTMLAnchorElement;
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      closeMenu();

      const headerOffset =
        (document.querySelector(".site-header") as HTMLElement | null)?.offsetHeight ?? 0;
      const top =
        target.getBoundingClientRect().top + window.pageYOffset - headerOffset - 14;

      window.scrollTo({ top, behavior: "smooth" });
      history.pushState(null, "", targetId);
    };

    const handleSubmit = (event: SubmitEvent) => {
      event.preventDefault();
      if (formNote) formNote.style.display = "block";
      form?.reset();
    };

    menuToggle?.addEventListener("click", toggleMenu);
    mainMenu?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", handleAnchorClick);
    });
    form?.addEventListener("submit", handleSubmit);

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );

    document.querySelectorAll(".reveal").forEach((item) => {
      revealObserver.observe(item);
    });

    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".menu a");
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${entry.target.id}`,
              );
            });
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );

    sections.forEach((section) => {
      navObserver.observe(section);
    });

    return () => {
      menuToggle?.removeEventListener("click", toggleMenu);
      mainMenu?.querySelectorAll("a").forEach((link) => {
        link.removeEventListener("click", closeMenu);
      });
      document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
        link.removeEventListener("click", handleAnchorClick);
      });
      form?.removeEventListener("submit", handleSubmit);
      revealObserver.disconnect();
      navObserver.disconnect();
    };
  }, []);

  return null;
}
