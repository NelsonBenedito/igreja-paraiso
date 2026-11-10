import React from 'react';
import type { PublicTicketFieldDto } from '@/lib/events/types';

export interface TermsFieldProps {
  field: PublicTicketFieldDto;
  value: boolean;
  onChange: (agreed: boolean) => void;
  error?: string;
}

export function TermsField({ field, value, onChange, error }: TermsFieldProps) {
  return (
    <div className="space-y-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/60 dark:bg-white/5 p-4 transition-all">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-900 dark:text-white">
          {field.label}
          {field.required && <span className="ml-1 text-red-500">*</span>}
        </label>
        <span className="text-[11px] font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide">
          Termo
        </span>
      </div>

      {/* Caixa de rolagem com o texto integral do termo */}
      <div className="max-h-36 overflow-y-auto rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-3 text-xs leading-relaxed text-gray-700 dark:text-slate-300 whitespace-pre-wrap select-text focus:outline-none">
        {field.termText || "Nenhum texto informado para este termo."}
      </div>

      {/* Checkbox de consentimento */}
      <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none group">
        <input
          type="checkbox"
          checked={value}
          required={field.required}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary accent-paraiso-green focus:ring-primary cursor-pointer"
        />
        <span className="text-sm text-gray-700 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-white">
          Li e concordo com os termos acima {field.required && <span className="text-red-500">*</span>}
        </span>
      </label>

      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

export default TermsField;
