'use client';

import { memo } from 'react';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  className?: string;
}

export const FormField = memo(({ label, children, error, className }: FormFieldProps) => (
  <div className={className}>
    <label className="block mb-2 text-sm font-medium text-slate-300">{label}</label>
    {children}
    {error && (
      <p className="mt-1 text-sm text-red-500">{error}</p>
    )}
  </div>
));

FormField.displayName = 'FormField';

export const FormSection = memo(({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="bg-slate-800/50 rounded-lg p-6">
    <h2 className="text-lg font-medium text-slate-200 mb-4">{title}</h2>
    {children}
  </section>
));

FormSection.displayName = 'FormSection';
