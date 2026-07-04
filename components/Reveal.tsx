'use client';

import { createElement, type ReactNode } from 'react';
import { useReveal } from '@/lib/useReveal';

type Props = {
  children: ReactNode;
  as?: 'div' | 'section' | 'li' | 'span';
  delay?: number;
  className?: string;
};

export function Reveal({ children, as = 'div', delay = 0, className = '' }: Props) {
  const { ref, visible } = useReveal<HTMLElement>();

  return createElement(
    as,
    {
      ref,
      className: `reveal ${visible ? 'reveal-visible' : ''} ${className}`.trim(),
      style: delay ? { transitionDelay: `${delay}ms` } : undefined,
    },
    children,
  );
}
