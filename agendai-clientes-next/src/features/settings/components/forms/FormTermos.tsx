'use client';

import { useState } from 'react';
import TermosPage from '../../../../../app/Termos/TermosPage';

interface FormTermosProps {
    onNavigateToTermos?: (tipo: 'termos' | 'privacidade') => void;
}

export function FormTermos({ onNavigateToTermos }: FormTermosProps) {
    const [showTermosPage, setShowTermosPage] = useState<'termos' | 'privacidade' | null>(null);

    const handleOpenTermos = () => {
        if (onNavigateToTermos) {
            onNavigateToTermos('termos');
        } else {
            setShowTermosPage('termos');
        }
    };

    const handleOpenPrivacidade = () => {
        if (onNavigateToTermos) {
            onNavigateToTermos('privacidade');
        } else {
            setShowTermosPage('privacidade');
        }
    };

    const handleClose = () => {
        setShowTermosPage(null);
    };

    // Se a página de termos estiver aberta localmente (fallback), renderiza apenas ela
    if (showTermosPage && !onNavigateToTermos) {
        return <TermosPage tipo={showTermosPage} onClose={handleClose} />;
    }

    return (
        <div className="space-y-8">
            {/* Card de Termos de Serviço */}
            <div className="bg-[#1f1f1f] rounded-lg p-8">
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                                stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Termos de Serviço
                        </h2>
                        <p className="text-gray-400">
                            Conheça nossos termos de uso e políticas da plataforma Hora Certa
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-[#26272B] rounded-lg p-6 border border-zinc-700">
                        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                            <span className="text-indigo-400">📋</span>
                            O que você encontrará:
                        </h3>
                        <ul className="space-y-2 text-gray-300 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-400 mt-1">•</span>
                                <span>Direitos e deveres de usuários e estabelecimentos</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-400 mt-1">•</span>
                                <span>Políticas de agendamento e cancelamento</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-400 mt-1">•</span>
                                <span>Informações sobre pagamentos e reembolsos</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-400 mt-1">•</span>
                                <span>Propriedade intelectual e uso da plataforma</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">⚠️</span>
                            <div>
                                <h4 className="font-semibold text-yellow-400 mb-1">Importante</h4>
                                <p className="text-sm text-gray-300">
                                    Ao utilizar nossa plataforma, você concorda automaticamente com nossos Termos de Serviço. 
                                    Recomendamos a leitura atenta para entender seus direitos e responsabilidades.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <div className="text-sm text-gray-400">
                            <p>Última atualização: <span className="text-white">13 de novembro de 2025</span></p>
                        </div>
                        <button
                            type="button"
                            onClick={handleOpenTermos}
                            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Ver Termos de Serviço
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Card de Política de Privacidade */}
            <div className="bg-[#1f1f1f] rounded-lg p-8">
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                                stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Política de Privacidade
                        </h2>
                        <p className="text-gray-400">
                            Entenda como protegemos seus dados pessoais e respeitamos sua privacidade
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-[#26272B] rounded-lg p-6 border border-zinc-700">
                        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                            <span className="text-green-400">🔒</span>
                            O que você encontrará:
                        </h3>
                        <ul className="space-y-2 text-gray-300 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">•</span>
                                <span>Quais dados coletamos e por quê</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">•</span>
                                <span>Como protegemos suas informações pessoais</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">•</span>
                                <span>Seus direitos sobre seus dados (LGPD)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">•</span>
                                <span>Compartilhamento e cookies</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                                    stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <div>
                                <h4 className="font-semibold text-green-400 mb-1">Proteção de Dados</h4>
                                <p className="text-sm text-gray-300">
                                    Seus dados estão seguros conosco. Cumprimos integralmente a LGPD (Lei 13.709/2018). 
                                    <strong className="text-white"> Nunca vendemos</strong> suas informações pessoais.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <div className="text-sm text-gray-400">
                            <p>Última atualização: <span className="text-white">13 de novembro de 2025</span></p>
                        </div>
                        <button
                            type="button"
                            onClick={handleOpenPrivacidade}
                            className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Ver Política de Privacidade
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Card de Resumo */}
            <div className="bg-[#1f1f1f] rounded-lg p-6 border border-zinc-700">
                <div className="flex items-center gap-3 mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                            stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h3 className="font-semibold text-white">Informações Importantes</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                        <span className="text-indigo-400 mt-1">✓</span>
                        <span className="text-gray-300">Cadastro 100% gratuito para usuários</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span className="text-gray-300">Dados protegidos com criptografia</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-indigo-400 mt-1">✓</span>
                        <span className="text-gray-300">Cancelamento de agendamento facilitado</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span className="text-gray-300">Conformidade total com LGPD</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
