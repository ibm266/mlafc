'use client';

import { useState, useTransition, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { submitEnquiry } from '@/app/book/actions';
import { site } from '@/data/site';
import type { Visit } from '@/data/types';
import visitsJson from '@/data/visits.json';
import { validateEnquiry, type EnquiryFields } from '@/lib/validateEnquiry';

const visits = visitsJson as Visit[];

const EMPTY: EnquiryFields = { name: '', phone: '', email: '', message: '', month: '' };
const FIELD_CLASS =
  'w-full rounded-md border border-line bg-white px-3 py-2.5 text-ink placeholder:text-ink-mute focus-visible:outline-2';

type FieldErrors = Partial<Record<keyof EnquiryFields, string>>;

export function EnquiryForm({ compact = false }: { compact?: boolean }) {
  const [fields, setFields] = useState<EnquiryFields>(
    compact ? { ...EMPTY, email: 'not-collected@compact.form', month: visits[0]?.month ?? 'any' } : EMPTY,
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  const set =
    (key: keyof EnquiryFields) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFields((current) => ({ ...current, [key]: event.target.value }));
    };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateEnquiry(fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => formData.set(key, value));

      const result = await submitEnquiry(formData);
      if (result.ok) {
        setDone(true);
      } else {
        setErrors(result.errors);
      }
    });
  };

  const field = (key: keyof EnquiryFields, label: string, input: ReactNode) => (
    <div>
      <label htmlFor={`enq-${key}`} className="mb-1 block text-sm font-semibold">
        {label}
      </label>
      {input}
      {errors[key] ? (
        <p id={`enq-${key}-error`} className="mt-1 text-sm text-brass-deep" role="alert">
          {errors[key]}
        </p>
      ) : null}
    </div>
  );

  if (done) {
    return (
      <div role="status" className="rounded-lg border border-line bg-paper-soft p-6">
        <p className="font-serif text-2xl">Thank you.</p>
        <p className="mt-2 text-ink-soft">
          Thank you — the clinic team will contact you within {site.responseDays} working days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {field(
        'name',
        'Your name',
        <input
          id="enq-name"
          className={FIELD_CLASS}
          value={fields.name}
          onChange={set('name')}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'enq-name-error' : undefined}
        />,
      )}

      {field(
        'phone',
        'Phone (with country code)',
        <input
          id="enq-phone"
          className={FIELD_CLASS}
          value={fields.phone}
          onChange={set('phone')}
          placeholder="+91 98765 43210"
          autoComplete="tel"
          inputMode="tel"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? 'enq-phone-error' : undefined}
        />,
      )}

      {!compact
        ? field(
            'email',
            'Email',
            <input
              id="enq-email"
              type="email"
              className={FIELD_CLASS}
              value={fields.email}
              onChange={set('email')}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'enq-email-error' : undefined}
            />,
          )
        : null}

      {field(
        'message',
        'Briefly, what is the problem?',
        <textarea
          id="enq-message"
          rows={compact ? 3 : 5}
          className={FIELD_CLASS}
          value={fields.message}
          onChange={set('message')}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'enq-message-error' : undefined}
        />,
      )}

      {!compact
        ? field(
            'month',
            'Preferred visit month',
            <select
              id="enq-month"
              className={FIELD_CLASS}
              value={fields.month}
              onChange={set('month')}
              aria-invalid={Boolean(errors.month)}
              aria-describedby={errors.month ? 'enq-month-error' : undefined}
            >
              <option value="">Choose a month</option>
              {visits.map((visit) => (
                <option key={visit.id} value={visit.month}>
                  {visit.month}
                </option>
              ))}
            </select>,
          )
        : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-6 py-3 font-semibold text-paper hover:bg-night disabled:opacity-60"
      >
        {pending ? 'Sending...' : 'Send enquiry'}
      </button>
    </form>
  );
}
