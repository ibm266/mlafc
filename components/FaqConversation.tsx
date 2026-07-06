import type { Faq } from '@/data/types';

export function FaqConversation({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="mt-10 flex flex-col gap-10">
      {faqs.map((faq) => (
        <div key={faq.question} className="border-t border-line pt-7">
          <h3 className="font-serif text-xl italic text-ink md:text-2xl">&ldquo;{faq.question}&rdquo;</h3>
          <p className="mt-3.5 text-ink-soft">{faq.answer}</p>
        </div>
      ))}
    </div>
  );
}
