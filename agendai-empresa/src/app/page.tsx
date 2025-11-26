import { redirect } from 'next/navigation';

export default function Home() {
  // Redireciona direto para a agenda (ou dashboard) ao entrar no site
  redirect('/agenda');
}