import { ComponentProps, forwardRef } from "react";

interface InputProps extends ComponentProps<"input"> {
  label?: string; // titulo em cima do campo
  error?: string; // mensagem de erro
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-sm font-medium text-zinc-300">{label}</label>
        )}

        {/* renderiza o input */}

        <input
          ref={ref}
          className={`w-full bg-zinc-900 rounded-md px-4 py-2.5 text-zinc-100 placeholder:text-zinc-600
                  focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                  transition-all disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    error
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }
                  ${className}`}
          {...props}
        >
          {/* mensagem de erro */}
          {error && <span className="text-xs text-red-400">{error}</span>}
        </input>
      </div>
    );
  }
);

Input.displayName = "Input";
