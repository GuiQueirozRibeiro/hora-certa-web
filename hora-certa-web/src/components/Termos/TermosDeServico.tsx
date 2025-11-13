import React from 'react';

export const TermosDeServico: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="border-b border-zinc-700 pb-6">
        <h1 className="text-3xl font-bold mb-2">TERMOS DE SERVIÇO - HORA CERTA</h1>
        <p className="text-sm text-gray-400">Última atualização: 13 de novembro de 2025</p>
      </div>

      {/* Seções */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-indigo-400">1. ACEITAÇÃO DOS TERMOS</h2>
        <p className="text-gray-300 leading-relaxed">
          Bem-vindo ao Hora Certa. Ao acessar e utilizar nossa plataforma (aplicativo móvel e site), você concorda em cumprir e estar vinculado aos seguintes Termos de Serviço. Se você não concorda com estes termos, não utilize nossos serviços.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-indigo-400">2. DEFINIÇÕES</h2>
        <div className="space-y-2">
          <p className="text-gray-300"><strong>2.1.</strong> "Plataforma" refere-se ao aplicativo móvel Hora Certa e ao website associado.</p>
          <p className="text-gray-300"><strong>2.2.</strong> "Usuário" refere-se a qualquer pessoa que utilize a Plataforma para visualizar, agendar ou contratar serviços.</p>
          <p className="text-gray-300"><strong>2.3.</strong> "Estabelecimento" ou "Empresa" refere-se aos prestadores de serviços cadastrados que pagam assinatura para divulgação na Plataforma.</p>
          <p className="text-gray-300"><strong>2.4.</strong> "Serviços" refere-se às funcionalidades oferecidas pela Plataforma, incluindo agendamento, pagamento e visualização de estabelecimentos.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-indigo-400">3. DESCRIÇÃO DOS SERVIÇOS</h2>
        <p className="text-gray-300"><strong>3.1.</strong> O Hora Certa é uma plataforma digital que conecta usuários a estabelecimentos prestadores de serviços, permitindo:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
          <li>Visualização de estabelecimentos cadastrados</li>
          <li>Agendamento de serviços</li>
          <li>Processamento de pagamentos</li>
          <li>Avaliações e comentários</li>
          <li>Histórico de serviços contratados</li>
        </ul>
        <p className="text-gray-300"><strong>3.2.</strong> A Plataforma atua exclusivamente como intermediária, não sendo responsável pela execução dos serviços contratados.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-indigo-400">4. CADASTRO E CONTA</h2>
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-gray-200 mb-2">4.1. Para Usuários:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
              <li>O cadastro é gratuito e requer informações pessoais verdadeiras</li>
              <li>É necessário ter no mínimo 18 anos ou autorização dos responsáveis legais</li>
              <li>Você é responsável pela confidencialidade de sua senha</li>
              <li>Não é permitido compartilhar ou transferir sua conta</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-200 mb-2">4.2. Para Estabelecimentos:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
              <li>O cadastro requer CNPJ válido e documentação comprobatória</li>
              <li>É necessário escolher um plano de assinatura mensal</li>
              <li>Devem fornecer informações comerciais verdadeiras e atualizadas</li>
              <li>São responsáveis por manter seus horários e serviços atualizados</li>
            </ul>
          </div>
          <p className="text-gray-300"><strong>4.3.</strong> Reservamo-nos o direito de suspender ou cancelar contas que violem estes Termos.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-indigo-400">5. PLANOS E PAGAMENTOS</h2>
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-gray-200 mb-2">5.1. Assinatura de Estabelecimentos:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
              <li>A assinatura é mensal e cobrada antecipadamente</li>
              <li>Os valores serão informados no momento da contratação</li>
              <li>O cancelamento pode ser solicitado a qualquer momento, com efeito no próximo ciclo de cobrança</li>
              <li>Não há reembolso proporcional em caso de cancelamento</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-200 mb-2">5.2. Pagamentos de Serviços:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
              <li>Os pagamentos são processados através da Plataforma</li>
              <li>O Hora Certa pode cobrar uma taxa de processamento sobre as transações</li>
              <li>Os valores serão repassados aos estabelecimentos conforme acordo comercial</li>
              <li>Todas as transações estão sujeitas a análise de segurança</li>
            </ul>
          </div>
          <p className="text-gray-300"><strong>5.3.</strong> Impostos aplicáveis são de responsabilidade de cada parte conforme legislação vigente.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-indigo-400">6. OBRIGAÇÕES DOS USUÁRIOS</h2>
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-gray-200 mb-2">6.1. O Usuário compromete-se a:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
              <li>Fornecer informações verdadeiras e atualizadas</li>
              <li>Comparecer aos agendamentos confirmados ou cancelar com antecedência</li>
              <li>Tratar estabelecimentos e outros usuários com respeito</li>
              <li>Não utilizar a Plataforma para fins ilícitos ou fraudulentos</li>
              <li>Não tentar burlar sistemas de segurança ou acessar áreas restritas</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-200 mb-2">6.2. É proibido:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
              <li>Criar múltiplas contas para o mesmo indivíduo</li>
              <li>Publicar conteúdo ofensivo, difamatório ou discriminatório</li>
              <li>Utilizar bots ou sistemas automatizados sem autorização</li>
              <li>Reproduzir, copiar ou distribuir conteúdo da Plataforma sem autorização</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-indigo-400">7. OBRIGAÇÕES DOS ESTABELECIMENTOS</h2>
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-gray-200 mb-2">7.1. O Estabelecimento compromete-se a:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
              <li>Manter informações comerciais atualizadas (endereço, telefone, horários)</li>
              <li>Honrar todos os agendamentos confirmados</li>
              <li>Prestar serviços com qualidade e profissionalismo</li>
              <li>Manter assinatura em dia para continuar visível na Plataforma</li>
              <li>Responder solicitações e mensagens de usuários</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-200 mb-2">7.2. É proibido:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
              <li>Solicitar pagamentos fora da Plataforma para burlar taxas</li>
              <li>Discriminar usuários por qualquer motivo</li>
              <li>Utilizar dados de usuários para fins não autorizados</li>
              <li>Publicar informações falsas ou enganosas sobre serviços</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-indigo-400">8. AGENDAMENTOS E CANCELAMENTOS</h2>
        <div className="space-y-2">
          <p className="text-gray-300"><strong>8.1.</strong> Agendamentos são confirmados mediante disponibilidade do estabelecimento.</p>
          <p className="text-gray-300"><strong>8.2.</strong> Cancelamentos por parte do usuário devem ser feitos com no mínimo 24 horas de antecedência para reembolso integral.</p>
          <p className="text-gray-300"><strong>8.3.</strong> Cancelamentos pelo estabelecimento podem gerar compensação ao usuário a critério do Hora Certa.</p>
          <p className="text-gray-300"><strong>8.4.</strong> No-shows (não comparecimento) podem resultar em cobrança parcial ou integral do serviço.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-indigo-400">9. AVALIAÇÕES E COMENTÁRIOS</h2>
        <div className="space-y-2">
          <p className="text-gray-300"><strong>9.1.</strong> Usuários podem avaliar estabelecimentos após utilização dos serviços.</p>
          <p className="text-gray-300"><strong>9.2.</strong> Avaliações devem ser honestas e baseadas em experiências reais.</p>
          <p className="text-gray-300"><strong>9.3.</strong> Reservamo-nos o direito de remover avaliações que violem nossas políticas, incluindo:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
            <li>Conteúdo ofensivo, discriminatório ou difamatório</li>
            <li>Avaliações falsas ou incentivadas</li>
            <li>Informações pessoais de terceiros</li>
            <li>Spam ou conteúdo comercial não autorizado</li>
          </ul>
          <p className="text-gray-300"><strong>9.4.</strong> Estabelecimentos podem responder avaliações de forma profissional.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-indigo-400">10. PROPRIEDADE INTELECTUAL</h2>
        <div className="space-y-2">
          <p className="text-gray-300"><strong>10.1.</strong> Todos os direitos sobre a Plataforma Hora Certa, incluindo mas não se limitando a marca, logotipo, código-fonte, design de interface e conteúdo, são de propriedade exclusiva do Hora Certa e estão protegidos pelas leis de direitos autorais e propriedade intelectual.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-indigo-400">11. LIMITAÇÃO DE RESPONSABILIDADE</h2>
        <div className="space-y-2">
          <p className="text-gray-300"><strong>11.1.</strong> O Hora Certa não se responsabiliza por:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
            <li>Qualidade, segurança ou legalidade dos serviços prestados por estabelecimentos</li>
            <li>Danos resultantes de informações incorretas fornecidas por estabelecimentos</li>
            <li>Indisponibilidade temporária da Plataforma por manutenção ou problemas técnicos</li>
            <li>Perda de dados devido a problemas técnicos ou ações de terceiros</li>
            <li>Disputas entre usuários e estabelecimentos</li>
          </ul>
          <p className="text-gray-300 mt-2"><strong>11.2.</strong> Nossa responsabilidade máxima, em qualquer circunstância, está limitada ao valor pago pelo usuário ou estabelecimento nos últimos 12 meses.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-indigo-400">12. PRIVACIDADE E PROTEÇÃO DE DADOS</h2>
        <div className="space-y-2">
          <p className="text-gray-300"><strong>12.1.</strong> A coleta, uso e proteção de dados pessoais são regidos por nossa Política de Privacidade, que deve ser lida em conjunto com estes Termos.</p>
          <p className="text-gray-300"><strong>12.2.</strong> Ao utilizar a Plataforma, você consente com a coleta e processamento de dados conforme descrito na Política de Privacidade.</p>
          <p className="text-gray-300"><strong>12.3.</strong> Comprometemo-nos a cumprir integralmente a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-indigo-400">13. MODIFICAÇÕES DOS TERMOS</h2>
        <div className="space-y-2">
          <p className="text-gray-300"><strong>13.1.</strong> Reservamo-nos o direito de modificar estes Termos a qualquer momento.</p>
          <p className="text-gray-300"><strong>13.2.</strong> Usuários e estabelecimentos serão notificados sobre alterações significativas através da Plataforma ou por e-mail.</p>
          <p className="text-gray-300"><strong>13.3.</strong> O uso continuado da Plataforma após modificações constitui aceitação dos novos termos.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-indigo-400">14. SUSPENSÃO E ENCERRAMENTO</h2>
        <p className="text-gray-300"><strong>14.1.</strong> Podemos suspender ou encerrar contas que:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
          <li>Violem estes Termos de Serviço</li>
          <li>Pratiquem atividades fraudulentas ou ilegais</li>
          <li>Prejudiquem outros usuários ou a reputação da Plataforma</li>
          <li>Estejam inadimplentes (no caso de estabelecimentos)</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-indigo-400">15. CONTATO</h2>
        <p className="text-gray-300">Para questões sobre estes Termos de Serviço:</p>
        <div className="bg-[#26272B] rounded-lg p-4 space-y-2">
          <p className="text-gray-300"><strong>E-mail:</strong> legal@horacerta.com.br</p>
          <p className="text-gray-300"><strong>Endereço:</strong> [ENDEREÇO COMPLETO DA EMPRESA]</p>
          <p className="text-gray-300"><strong>Telefone:</strong> [TELEFONE DE CONTATO]</p>
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-zinc-700 pt-6 mt-8">
        <p className="text-sm text-gray-400 text-center">
          Ao utilizar a Plataforma Hora Certa, você declara ter lido, compreendido e concordado com estes Termos de Serviço.
        </p>
        <p className="text-sm text-gray-500 text-center mt-2">
          Data de vigência: 13 de novembro de 2025
        </p>
      </div>
    </div>
  );
};
