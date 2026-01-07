'use client';

import React, { useRef, useEffect, useState } from 'react';
import { MapPin, MapPinOff, Settings, ExternalLink } from 'lucide-react';
import gsap from 'gsap';
import { icon } from '@fortawesome/fontawesome-svg-core';

interface LocationRequiredStateProps {
    onRequestLocation: () => void;
    loading?: boolean;
}

type PermissionState = 'prompt' | 'granted' | 'denied' | 'unknown';

export const LocationRequiredState: React.FC<LocationRequiredStateProps> = ({
    onRequestLocation,
    loading = false,
}) => {
    const iconRef = useRef<HTMLDivElement>(null);
    const pulseRef = useRef<HTMLDivElement>(null);
    const [browserPermission, setBrowserPermission] = useState<PermissionState>('unknown');

    // Verificar o estado real da permissão no navegador
    useEffect(() => {
        const checkPermission = async () => {
            if ('permissions' in navigator) {
                try {
                    const result = await navigator.permissions.query({ name: 'geolocation' });
                    setBrowserPermission(result.state as PermissionState);

                    // Escutar mudanças de permissão
                    result.addEventListener('change', () => {
                        setBrowserPermission(result.state as PermissionState);
                        // Se foi concedida, recarregar para atualizar
                        if (result.state === 'granted') {
                            onRequestLocation();
                        }
                    });
                } catch {
                    setBrowserPermission('unknown');
                }
            }
        };

        checkPermission();
    }, [onRequestLocation]);

    // Animações GSAP
    useEffect(() => {
        if (!iconRef.current || !pulseRef.current) return;

        // Animação principal do ícone - bounce suave
        const iconTimeline = gsap.timeline({ repeat: -1, yoyo: true });
        iconTimeline.to(iconRef.current, {
            y: -10,
            duration: 1.2,
            ease: 'power2.inOut',
        }).to(iconRef.current, {
            y: 10,
            duration: 1.2,
            ease: 'power2.inOut',
        })

        // Animação de rotação sutil
        const rotationTimeline = gsap.timeline({ repeat: -1, yoyo: true });
        rotationTimeline.to(iconRef.current, {
            rotation: 360,
            duration: 1.2,
            ease: 'power1.inOut',
        }).to(iconRef.current, {
            rotation: -5,
            duration: 2.0,
            ease: 'power1.inOut',
        });

        // Animação de pulse no círculo externo
        gsap.to(pulseRef.current, {
            scale: 3.3,
            opacity: 0,
            duration: 1.5,
            repeat: -1,
            ease: 'power2.out',
        });

        return () => {
            iconTimeline.kill();
            rotationTimeline.kill();
            gsap.killTweensOf(pulseRef.current);
        };
    }, []);

    // Permissão foi bloqueada no navegador
    const isBlockedByBrowser = browserPermission === 'denied';

    const handleClick = () => {
        if (isBlockedByBrowser) {
            // Não adianta chamar requestLocation, mostrar alerta
            return;
        }
        onRequestLocation();
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 py-8 px-4 max-w-6xl mx-auto min-h-[calc(100vh-200px)] items-center">
            <div className="flex-1 flex flex-col items-center text-center">
                {/* Container do ícone animado */}
                <div className="relative mb-8">
                    {/* Círculo de pulse */}
                    <div
                        ref={pulseRef}
                        className="absolute inset-0 w-28 h-28 bg-indigo-500/30 rounded-full"
                    />

                    {/* Círculo de fundo */}
                    <div className="w-28 h-28 bg-indigo-500/20 rounded-full flex items-center justify-center">
                        <div
                            ref={iconRef}
                            className="w-16 h-16 bg-indigo-500/30 rounded-full flex items-center justify-center"
                        >
                            <MapPin size={32} className="text-indigo-400" />
                        </div>
                    </div>
                </div>

                {/* Título */}
                <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-3">
                    {isBlockedByBrowser ? 'Localização bloqueada' : 'Ative sua localização'}
                </h2>

                {/* Descrição */}
                <p className="text-gray-400 text-center max-w-md mb-6 text-sm sm:text-base">
                    {isBlockedByBrowser
                        ? 'Você bloqueou o acesso à localização. Para ver os estabelecimentos próximos, você precisa desbloquear manualmente no navegador.'
                        : 'Para encontrar os melhores estabelecimentos próximos a você, precisamos da sua localização. Seus dados são usados apenas para melhorar sua experiência.'
                    }
                </p>

                {/* Botão de ação - diferente se bloqueado */}
                {!isBlockedByBrowser ? (
                    <button
                        onClick={handleClick}
                        disabled={loading}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl py-3 px-6 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-indigo-500/25"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                Obtendo localização...
                            </>
                        ) : (
                            <>
                                <MapPin size={20} />
                                Permitir localização
                            </>
                        )}
                    </button>
                ) : (
                    <div className="text-center">
                        <p className="text-amber-400 text-sm mb-4 font-medium">
                            ⚠️ A localização está bloqueada no navegador
                        </p>
                    </div>
                )}
            </div>
            {/* Instruções para desbloquear */}
            <div className='flex-1 flex flex-col gap-4 w-full max-w-lg items-center'>
            <div className={`mt-8 bg-[#1a1a1a] rounded-xl p-5 max-w-md ${isBlockedByBrowser ? 'border border-amber-500/30' : ''}`}>
                <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 ${isBlockedByBrowser ? 'bg-amber-500/20' : 'bg-gray-700'} rounded-lg flex items-center justify-center shrink-0`}>
                        {isBlockedByBrowser ? (
                            <Settings size={20} className="text-amber-500" />
                        ) : (
                            <MapPinOff size={18} className="text-gray-400" />
                        )}
                    </div>
                    <div>
                        <h4 className={`text-sm font-medium mb-2 ${isBlockedByBrowser ? 'text-amber-400' : 'text-white'}`}>
                            {isBlockedByBrowser ? 'Como desbloquear a localização:' : 'Localização bloqueada?'}
                        </h4>

                        {isBlockedByBrowser ? (
                            <ol className="text-gray-400 text-xs space-y-2 list-decimal list-inside">
                                <li>Clique no ícone de <strong className="text-white">cadeado 🔒</strong> ou <strong className="text-white">configurações</strong> na barra de endereço</li>
                                <li>Procure por <strong className="text-white">&quot;Localização&quot;</strong> ou <strong className="text-white">&quot;Location&quot;</strong></li>
                                <li>Altere de <strong className="text-red-400">&quot;Bloqueado&quot;</strong> para <strong className="text-green-400">&quot;Permitir&quot;</strong></li>
                                <li>Recarregue a página</li>
                            </ol>
                        ) : (
                            <p className="text-gray-500 text-xs">
                                Se você negou anteriormente, clique no ícone de cadeado na barra de endereço do navegador e permita o acesso à localização.
                            </p>
                        )}

                        {isBlockedByBrowser && (
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg py-2 px-4 text-xs font-medium transition-colors flex items-center gap-2"
                            >
                                <ExternalLink size={14} />
                                Recarregar página após desbloquear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Imagens ilustrativas do navegador */}
            {isBlockedByBrowser && (
                <div className="mt-6 flex flex-col sm:flex-row gap-4 max-w-2xl">
                    {/* Opção 1: Cadeado */}
                    <div className="flex-1 bg-[#1a1a1a] rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-indigo-400">Opção 1</span>
                            <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded">Chrome / Edge / Firefox</span>
                        </div>
                        <div className="flex items-center gap-2 bg-[#2a2a2a] rounded-lg px-3 py-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="flex-1 flex items-center gap-2 bg-[#1a1a1a] rounded px-2 py-1">
                                <div className="w-5 h-5 rounded bg-amber-500/30 flex items-center justify-center animate-pulse">
                                    <span className="text-[10px]">🔒</span>
                                </div>
                                <span className="text-gray-500 text-xs truncate">agendai.com.br</span>
                            </div>
                        </div>
                        <p className="text-gray-500 text-xs text-center mt-3">
                            👆 Clique no <strong className="text-amber-400">cadeado</strong> à esquerda
                        </p>
                    </div>

                    {/* Opção 2: Ícone de localização */}
                    <div className="flex-1 bg-[#1a1a1a] rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-green-400">Opção 2</span>
                            <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded">Chrome / Safari</span>
                        </div>
                        <div className="flex items-center gap-2 bg-[#2a2a2a] rounded-lg px-3 py-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="flex-1 flex items-center gap-2 bg-[#1a1a1a] rounded px-2 py-1">
                                <div className="w-4 h-4 rounded flex items-center justify-center">
                                    <span className="text-[8px]">🔒</span>
                                </div>
                                <span className="text-gray-500 text-xs truncate flex-1">agendai.com.br</span>
                                <div className="w-5 h-5 rounded bg-green-500/30 flex items-center justify-center animate-pulse">
                                    <MapPin size={10} className="text-green-400" />
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-500 text-xs text-center mt-3">
                            👆 Clique no <strong className="text-green-400">ícone de pin</strong> à direita
                        </p>
                    </div>
                </div>
            )}

            {/* Dica extra para Safari */}
            {isBlockedByBrowser && (
                <div className="mt-4 bg-[#1a1a1a] rounded-xl p-4 max-w-md border border-gray-800">
                    <div className="flex items-start gap-3">
                        <div className="text-xl">🍎</div>
                        <div>
                            <h5 className="text-white text-xs font-medium mb-1">No Safari (Mac/iPhone)</h5>
                            <p className="text-gray-500 text-[11px]">
                                Vá em <strong className="text-gray-300">Safari → Configurações → Sites → Localização</strong> e altere para &quot;Permitir&quot; para este site.
                            </p>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default LocationRequiredState;
