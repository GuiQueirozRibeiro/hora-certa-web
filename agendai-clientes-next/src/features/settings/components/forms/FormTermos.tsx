'use client';

import { useState } from 'react';
import { FileText, Shield, CheckCircle, Info, ExternalLink } from 'lucide-react';
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
                        <FileText size={24} className="text-indigo-500" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Termos de Serviço
                        </h2>
                        <p className="text-gray-400">
                            Conheça nossos termos de uso e políticas da plataforma Agendai
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
                            <FileText size={20} />
                            Ver Termos de Serviço
                            <ExternalLink size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Card de Política de Privacidade */}
            <div className="bg-[#1f1f1f] rounded-lg p-8">
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield size={24} className="text-green-500" />
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
                            <CheckCircle size={24} className="text-green-500" />
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
                            <Shield size={20} />
                            Ver Política de Privacidade
                            <ExternalLink size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Card de Resumo */}
            <div className="bg-[#1f1f1f] rounded-lg p-6 border border-zinc-700">
                <div className="flex items-center gap-3 mb-4">
                    <Info size={24} className="text-indigo-500" />
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
