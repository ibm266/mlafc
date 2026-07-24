'use client';

import { useRef, useState } from 'react';
import { CertificateDialog } from '@/components/certifications/CertificateDialog';
import { CertificateFrame } from '@/components/certifications/CertificateFrame';
import { Reveal } from '@/components/Reveal';
import { certifications, certificationSections } from '@/data/certifications';
import type { Certification } from '@/data/types';

export function CertificateWall() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openCert = (certification: Certification) => {
    setActiveIndex(certifications.indexOf(certification));
    dialogRef.current?.showModal();
  };

  const step = (delta: number) =>
    setActiveIndex((current) =>
      current === null ? current : (current + delta + certifications.length) % certifications.length,
    );

  const active = activeIndex === null ? null : certifications[activeIndex];

  return (
    <div>
      {certificationSections.map((section, sectionIndex) => {
        const items = certifications.filter((c) => c.category === section.id);
        if (items.length === 0) return null;

        return (
          <section
            key={section.id}
            aria-label={section.label}
            className={sectionIndex === 0 ? '' : 'mt-16 md:mt-20'}
          >
            <Reveal>
              <div className={`mb-8 ${sectionIndex === 0 ? '' : 'border-t border-line-dark pt-6'}`}>
                <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-brass">
                  <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-brass" />
                  {section.label}
                </p>
                <p className="mt-2 max-w-xl text-sm text-paper/70">{section.blurb}</p>
              </div>
            </Reveal>

            <div className="columns-1 gap-8 sm:columns-2 md:gap-10">
              {items.map((certification) => (
                <Reveal key={certification.id} className="mb-6 break-inside-avoid md:mb-9">
                  <CertificateFrame certification={certification} onOpen={openCert} />
                </Reveal>
              ))}
            </div>
          </section>
        );
      })}

      <CertificateDialog
        certification={active}
        position={{ index: activeIndex ?? 0, total: certifications.length }}
        dialogRef={dialogRef}
        onClose={() => setActiveIndex(null)}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
      />
    </div>
  );
}
