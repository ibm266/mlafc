import Image from 'next/image';

export function HeroPortraitBubble() {
  return (
    <div className="relative">
      <figure>
        <div className="overflow-hidden rounded-xl border border-line-dark/80 bg-paper shadow-[0_12px_28px_rgba(6,15,21,0.35)]">
          <Image
            src="/images/professor-gupta.png"
            alt="Professor Dhiraj Gupta, consultant cardiologist and electrophysiologist"
            width={573}
            height={612}
            priority
            className="aspect-[573/612] w-full object-cover object-top"
          />
        </div>
      </figure>
      <blockquote className="mt-5 border-t border-line-dark/60 pt-5">
        <p className="font-serif text-lg italic leading-relaxed text-paper/92 md:text-xl">
          &ldquo;Patients in Mumbai deserve the same standard of arrhythmia care I provide in Liverpool, with the
          dignity of being treated close to home.&rdquo;
        </p>
        <footer className="mt-4">
          <p className="text-sm font-semibold text-paper">Professor Dhiraj Gupta</p>
          <p className="text-sm text-paper/65">Consultant cardiologist &amp; electrophysiologist</p>
        </footer>
      </blockquote>
    </div>
  );
}
