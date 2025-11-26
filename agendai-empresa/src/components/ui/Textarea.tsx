import { ComponentProps, forwardRef } from "react";

interface TextareaProps extends ComponentProps<"textarea"> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-sm font-medium text-zinc-200">{label}</label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2.5 
            text-zinc-100 placeholder:text-zinc-600 resize-y min-h-[100px]
            focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 
            transition-all disabled:opacity-50
            ${error ? "border-red-500" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';