import React from 'react';

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="block font-body text-sm font-medium text-charcoal"
        >
          {label}
          {props.required && (
            <span className="text-red-600 ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>
        <textarea
          ref={ref}
          id={inputId}
          rows={4}
          className={`block w-full rounded-soft border ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-charcoal/20 focus:border-orchard-green focus:ring-orchard-green'
          } bg-white px-4 py-3 font-body text-sm text-charcoal placeholder:text-charcoal/40 
          focus:outline-none focus:ring-1 transition-colors resize-y ${className}`}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error
              ? `${inputId}-error`
              : hint
              ? `${inputId}-hint`
              : undefined
          }
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-red-600 font-body"
            role="alert"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p
            id={`${inputId}-hint`}
            className="text-sm text-charcoal/50 font-body"
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

