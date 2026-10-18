
import { useState, type FormEvent } from 'react';
import { services } from '../data/site';
import { SubmitButton } from './ui';

const fieldClass =
  'mt-2 w-full rounded-xl border border-[#CBD5D1] bg-[#F1F4F1] px-4 py-3 text-sm text-[#06191F] placeholder:text-[#7A8781] outline-none transition duration-200 focus:border-[#27934F] focus:bg-white focus:ring-2 focus:ring-[#27934F]/20';

const labelClass =
  'block text-sm font-semibold leading-6 text-[#06191F]';

export function QuoteForm() {
  const [status, setStatus] = useState<'idle' | 'error'>('idle');

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('error');
  };

  return (
    <form onSubmit={submit} className="grid gap-5" noValidate>
      {/* Name and phone */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" required />
        <Field label="Phone number" name="phone" type="tel" required />
      </div>

      {/* Email */}
      <Field
        label="Email address (optional)"
        name="email"
        type="email"
      />

      {/* Service */}
      <label className={labelClass}>
        Service required

        <select
          name="service"
          className={fieldClass}
          defaultValue=""
        >
          <option value="" disabled>
            Select a service
          </option>

          {services.map((service) => (
            <option key={service.slug} value={service.title}>
              {service.title}
            </option>
          ))}
        </select>
      </label>

      {/* Location */}
      <Field label="Project location" name="location" required />

      {/* Project details */}
      <label className={labelClass}>
        Tell us about the property and what you need

        <textarea
          name="message"
          className={`${fieldClass} min-h-36 resize-y`}
          placeholder="Describe your project or the problem you need help with..."
          required
        />
      </label>

      {/* Submission notice */}
      {status === 'error' && (
        <p
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"
        >
          This preview is not connected to a backend, so your enquiry has
          not been sent. Please call or use WhatsApp instead.
        </p>
      )}

      {/* Submit */}
      <SubmitButton type="submit" className="w-full sm:w-fit">
        Send enquiry
      </SubmitButton>

      <p className="text-xs leading-5 text-[#64736D]">
        Your enquiry form is currently in preview mode and does not save
        or send submissions yet.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className={labelClass}>
      {label}

      <input
        className={fieldClass}
        name={name}
        type={type}
        required={required}
        placeholder={
          name === 'name'
            ? 'Enter your full name'
            : name === 'phone'
              ? 'Enter your phone number'
              : name === 'email'
                ? 'you@example.com'
                : name === 'location'
                  ? 'Where is the project located?'
                  : undefined
        }
      />
    </label>
  );
}
