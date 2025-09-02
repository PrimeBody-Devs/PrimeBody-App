import Link from 'next/link';
import { cn } from '@/lib/utils';
import { focusManagement, screenReader } from '@/lib/accessibility';

interface SkipLink {
  href: string;
  label: string;
}

const skipLinks: SkipLink[] = [
  { href: '#main-content', label: screenReader.skipToMain },
  { href: '#main-navigation', label: screenReader.skipToNav },
  { href: '#footer', label: screenReader.skipToFooter },
];

export function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <nav aria-label="Enlaces de navegación rápida">
        <ul className="flex flex-col gap-2 p-4">
          {skipLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  focusManagement.skipLink,
                  'inline-block font-medium text-sm',
                  'hover:bg-primary/90 transition-colors duration-200'
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}