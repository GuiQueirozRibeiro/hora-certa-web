import { Children, ReactNode } from "react";

interface FormLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function FormLayout({ title, description, children }: FormLayoutProps) {
  return (
    <div className="max-w-3xl w-full animate-in fade-in duration-500">
      {/* CABEÇALHO  */}
      <div className="mb-8">
        <h2 className="text-xl font-semibol text-zinc-100 mb-2">
            {title}
        </h2>
        <p className="text-sm text-zinc-400">
            {description}
        </p>
      </div>

      {/* aqui é aonde o formulario vai ser renderizado */}
      <div className="bg-zinc-900/50 rounded-lg border border-zinc-600 p-6">
        {children}
      </div>
    </div>
  );
}
