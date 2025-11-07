import Link from "next/link";

export function separateTextAndHyperlinks(text: string) {
  const urlRegex = /(https?:\/\/[\w\?\.\/\-]+[\w\?\/\-])/g;
  const parts = text.split(urlRegex).filter(t => t !== '');

  return parts;
}

export function createHiperlinks(text: string) {
  const parts = separateTextAndHyperlinks(text);

  return parts.map((p, i) => (/^https?:\/\//.test(p)) ? <Link key={i} href={p} target="_blank">{p}</Link> : p)
}