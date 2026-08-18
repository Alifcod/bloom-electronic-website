import { useEffect, useState } from "react";
import { normalizePathname } from "./content.js";

function currentLocation() {
  if (typeof window === "undefined") return { pathname: "/", search: "", hash: "" };
  return { pathname: normalizePathname(window.location.pathname), search: window.location.search, hash: window.location.hash };
}

export function useLocation() {
  const [location, setLocation] = useState(currentLocation);
  useEffect(() => {
    const update = () => setLocation(currentLocation());
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);
  return location;
}

export function navigate(to, { replace = false } = {}) {
  if (typeof window === "undefined") return;
  const url = new URL(to, window.location.origin);
  const method = replace ? "replaceState" : "pushState";
  window.history[method]({}, "", `${url.pathname}${url.search}${url.hash}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
  if (url.hash) requestAnimationFrame(() => document.querySelector(url.hash)?.scrollIntoView());
  else window.scrollTo({ top: 0, behavior: "auto" });
}

export function Link({ to, children, onClick, target, ...props }) {
  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented || target === "_blank" || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(to, window.location.origin);
    if (url.origin !== window.location.origin) return;
    event.preventDefault();
    navigate(`${url.pathname}${url.search}${url.hash}`);
  };
  return <a href={to} target={target} onClick={handleClick} {...props}>{children}</a>;
}
