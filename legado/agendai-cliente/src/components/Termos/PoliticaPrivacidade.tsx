import React from 'react';

export const PoliticaPrivacidade: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="border-b border-zinc-700 pb-6">
        <h1 className="text-3xl font-bold mb-2">POLÍTICA DE PRIVACIDADE E PROTEÇÃO DE DADOS</h1>
        <p className="text-sm text-gray-400">Última atualização: 13 de novembro de 2025 | Versão 1.0</p>
      </div>

      {/* Seções */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-green-400">1. INTRODUÇÃO</h2>
        <p className="text-gray-300 leading-relaxed">
          A Hora Certa leva a privacidade e a proteção de dados muito a sério. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018) e demais legislações aplicáveis.
        </p>
        
        <h3 className="font-semibold text-gray-200 mt-4">1.1. Compromisso com a Privacidade</h3>
        <p className="text-gray-300">Comprometemo-nos a:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
          <li>Processar dados pessoais apenas para finalidades legítimas e informadas</li>
          <li>Garantir a segurança e confidencialidade dos dados</li>
          <li>Respeitar seus direitos como titular de dados</li>
          <li>Ser transparentes sobre nossas práticas de tratamento de dados</li>
          <li>Nunca vender ou compartilhar seus dados com terceiros para fins comerciais não autorizados</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-green-400">2. DEFINIÇÕES IMPORTANTES</h2>
        <p className="text-gray-300"><strong>2.1. Dados Pessoais:</strong> Qualquer informação relacionada a uma pessoa identificada ou identificável.</p>
        <p className="text-gray-300"><strong>2.2. Titular:</strong> Pessoa natural a quem se referem os dados pessoais.</p>
        <p className="text-gray-300"><strong>2.3. Tratamento:</strong> Toda operação realizada com dados pessoais (coleta, armazenamento, uso, compartilhamento, eliminação, etc.).</p>
        <p className="text-gray-300"><strong>2.4. Controlador:</strong> Hora Certa, responsável pelas decisões sobre o tratamento de dados pessoais.</p>
        <p className="text-gray-300"><strong>2.5. Operador:</strong> Terceiros que processam dados em nome do Hora Certa.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-green-400">3. DADOS QUE COLETAMOS</h2>
        
        <h3 className="font-semibold text-gray-200">3.1. Dados de Usuários (Cadastro Gratuito)</h3>
        <p className="text-gray-300"><strong>Dados de Identificação:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
          <li>Nome completo</li>
          <li>CPF</li>
          <li>Data de nascimento</li>
          <li>E-mail</li>
          <li>Número de telefone</li>
          <li>Foto de perfil (opcional)</li>
        </ul>

        <p className="text-gray-300 mt-3"><strong>Dados de Acesso:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
          <li>Endereço IP</li>
          <li>Informações do dispositivo (modelo, sistema operacional)</li>
          <li>Tipo de navegador</li>
          <li>Logs de acesso e utilização</li>
          <li>Localização geográfica (quando autorizado)</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-green-400">4. FINALIDADES DO TRATAMENTO DE DADOS</h2>
        <p className="text-gray-300">Utilizamos seus dados exclusivamente para:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
          <li>Criação e gerenciamento de conta</li>
          <li>Processamento de agendamentos e pagamentos</li>
          <li>Comunicação sobre serviços contratados</li>
          <li>Fornecimento de suporte ao cliente</li>
          <li>Personalização da experiência do usuário</li>
          <li>Prevenção de fraudes e proteção contra acessos não autorizados</li>
          <li>Cumprimento de obrigações legais</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-green-400">5. BASE LEGAL PARA TRATAMENTO DE DADOS</h2>
        <p className="text-gray-300">Tratamos seus dados com base nas seguintes bases legais da LGPD:</p>
        <p className="text-gray-300"><strong>5.1. Execução de Contrato (Art. 7º, V):</strong> Processamento de agendamentos, pagamentos e prestação de serviços.</p>
        <p className="text-gray-300"><strong>5.2. Legítimo Interesse (Art. 7º, IX):</strong> Melhoria dos serviços, segurança, prevenção de fraudes e análises.</p>
        <p className="text-gray-300"><strong>5.3. Consentimento (Art. 7º, I):</strong> Comunicações de marketing, cookies não essenciais, uso de localização.</p>
        <p className="text-gray-300"><strong>5.4. Obrigação Legal (Art. 7º, II):</strong> Cumprimento de obrigações fiscais, trabalhistas e regulatórias.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-green-400">6. COMPARTILHAMENTO DE DADOS</h2>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-300 font-semibold">⚠️ NÃO VENDEMOS SEUS DADOS</p>
          <p className="text-gray-300 mt-2">Nunca vendemos, alugamos ou comercializamos suas informações pessoais para terceiros.</p>
        </div>

        <p className="text-gray-300 mt-4">Podemos compartilhar dados limitados com:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
          <li><strong>Prestadores de Serviço:</strong> Processadores de pagamento, hospedagem em nuvem, serviços de e-mail e SMS</li>
          <li><strong>Estabelecimentos Parceiros:</strong> Nome, telefone e e-mail para contato sobre agendamentos</li>
          <li><strong>Autoridades Competentes:</strong> Quando exigido por lei ou ordem judicial</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-green-400">7. SEGURANÇA DOS DADOS</h2>
        <h3 className="font-semibold text-gray-200">7.1. Medidas Técnicas</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
          <li>Criptografia de dados em trânsito (SSL/TLS)</li>
          <li>Criptografia de dados em repouso</li>
          <li>Firewalls e sistemas de detecção de intrusão</li>
          <li>Controles de acesso e autenticação multifator</li>
          <li>Backups regulares e redundância</li>
          <li>Tokenização de dados financeiros sensíveis</li>
        </ul>

        <h3 className="font-semibold text-gray-200 mt-3">7.2. Suas Responsabilidades</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
          <li>Manter sua senha segura e confidencial</li>
          <li>Não compartilhar credenciais de acesso</li>
          <li>Utilizar senhas fortes e únicas</li>
          <li>Notificar-nos imediatamente sobre atividades suspeitas</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-green-400">8. RETENÇÃO DE DADOS</h2>
        <p className="text-gray-300"><strong>Usuários Ativos:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
          <li>Durante toda a utilização da Plataforma</li>
          <li>Dados de transações: 5 anos (obrigação legal tributária)</li>
        </ul>

        <p className="text-gray-300 mt-3"><strong>Após Encerramento de Conta:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
          <li>Dados essenciais para obrigações legais: 5 anos</li>
          <li>Dados anonimizados para estatísticas: indefinidamente</li>
          <li>Demais dados: exclusão em até 30 dias após solicitação</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-green-400">9. SEUS DIREITOS COMO TITULAR DE DADOS</h2>
        <p className="text-gray-300">Conforme a LGPD, você tem os seguintes direitos:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
          <li><strong>Confirmação e Acesso:</strong> Confirmar se tratamos seus dados e acessá-los</li>
          <li><strong>Correção:</strong> Corrigir dados incompletos, inexatos ou desatualizados</li>
          <li><strong>Anonimização ou Eliminação:</strong> Solicitar anonimização ou exclusão de dados</li>
          <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
          <li><strong>Informação sobre Compartilhamento:</strong> Saber com quem compartilhamos seus dados</li>
          <li><strong>Revogação do Consentimento:</strong> Retirar consentimento a qualquer momento</li>
        </ul>

        <h3 className="font-semibold text-gray-200 mt-3">9.8. Como Exercer Seus Direitos</h3>
        <p className="text-gray-300">Para exercer qualquer destes direitos:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
          <li>Entre em contato através de <strong>privacidade@horacerta.com.br</strong></li>
          <li>Acesse as configurações de privacidade no aplicativo</li>
          <li>Responderemos em até 15 dias</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-green-400">10. DADOS DE MENORES DE IDADE</h2>
        <p className="text-gray-300"><strong>10.1.</strong> Nossos serviços são destinados a maiores de 18 anos.</p>
        <p className="text-gray-300"><strong>10.2.</strong> Não coletamos intencionalmente dados de menores de 18 anos sem consentimento dos responsáveis legais.</p>
        <p className="text-gray-300"><strong>10.3.</strong> Se identificarmos coleta não autorizada de dados de menores, excluiremos imediatamente as informações.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-green-400">11. COOKIES E TECNOLOGIAS DE RASTREAMENTO</h2>
        <p className="text-gray-300"><strong>Tipos de Cookies:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
          <li><strong>Essenciais:</strong> Necessários para funcionamento básico (não podem ser desabilitados)</li>
          <li><strong>Funcionalidade:</strong> Lembram suas preferências e escolhas</li>
          <li><strong>Analíticos:</strong> Entendem como você usa a Plataforma</li>
          <li><strong>Marketing:</strong> Exibem conteúdo relevante (requerem consentimento)</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-green-400">12. MARKETING E COMUNICAÇÕES</h2>
        <p className="text-gray-300"><strong>Comunicações Transacionais (obrigatórias):</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
          <li>Confirmação de agendamentos</li>
          <li>Alterações ou cancelamentos</li>
          <li>Atualizações importantes da conta</li>
          <li>Questões de segurança</li>
        </ul>

        <p className="text-gray-300 mt-3"><strong>Comunicações de Marketing (opcionais):</strong></p>
        <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
          <li>Promoções e ofertas especiais</li>
          <li>Novidades sobre a Plataforma</li>
          <li>Dicas e conteúdo relevante</li>
        </ul>
        <p className="text-gray-300 mt-2">Você pode cancelar a qualquer momento através do link "descadastrar" nos e-mails.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-green-400">13. ENCARREGADO DE PROTEÇÃO DE DADOS (DPO)</h2>
        <div className="bg-[#26272B] rounded-lg p-4 space-y-2">
          <p className="text-gray-300"><strong>Nome:</strong> [Nome do DPO]</p>
          <p className="text-gray-300"><strong>E-mail:</strong> dpo@horacerta.com.br</p>
          <p className="text-gray-300"><strong>Endereço:</strong> [Endereço completo]</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-green-400">14. AUTORIDADE DE CONTROLE</h2>
        <p className="text-gray-300">Você tem direito de apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD):</p>
        <div className="bg-[#26272B] rounded-lg p-4 space-y-2">
          <p className="text-gray-300"><strong>Site:</strong> https://www.gov.br/anpd</p>
          <p className="text-gray-300"><strong>E-mail:</strong> anpd@anpd.gov.br</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-green-400">15. GARANTIAS E COMPROMISSOS</h2>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-2">
          <p className="text-gray-300"><strong>Garantimos que:</strong></p>
          <p className="text-gray-300"><span className="text-green-400">✓</span> Seus dados serão utilizados EXCLUSIVAMENTE para as finalidades descritas</p>
          <p className="text-gray-300"><span className="text-green-400">✓</span> NUNCA compartilharemos, venderemos ou alugaremos seus dados sem autorização</p>
          <p className="text-gray-300"><span className="text-green-400">✓</span> Implementamos medidas de segurança técnicas e organizacionais adequadas</p>
          <p className="text-gray-300"><span className="text-green-400">✓</span> Respeitamos todos os seus direitos como titular de dados</p>
          <p className="text-gray-300"><span className="text-green-400">✓</span> Cumprimos integralmente a LGPD</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-green-400">16. CONTATO E DÚVIDAS</h2>
        <div className="bg-[#26272B] rounded-lg p-4 space-y-2">
          <p className="text-gray-300"><strong>E-mail Geral de Privacidade:</strong> privacidade@horacerta.com.br</p>
          <p className="text-gray-300"><strong>E-mail do DPO:</strong> dpo@horacerta.com.br</p>
          <p className="text-gray-300"><strong>Telefone:</strong> [TELEFONE]</p>
          <p className="text-gray-300"><strong>Endereço:</strong> [ENDEREÇO COMPLETO]</p>
          <p className="text-gray-300"><strong>Horário:</strong> Segunda a Sexta, 9h às 18h</p>
          <p className="text-gray-300"><strong>Prazo de Resposta:</strong> Até 15 dias úteis conforme LGPD</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-green-400">RESUMO EXECUTIVO</h2>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-2 text-sm">
          <p className="text-gray-300"><strong>O que coletamos:</strong> Dados cadastrais, uso da plataforma, pagamento (tokenizados), cookies</p>
          <p className="text-gray-300"><strong>Por que coletamos:</strong> Fornecer serviços, melhorias, segurança, obrigações legais</p>
          <p className="text-gray-300"><strong>Como protegemos:</strong> Criptografia, controles de acesso, auditorias, equipe treinada</p>
          <p className="text-gray-300"><strong>Seus direitos:</strong> Acessar, corrigir, excluir, revogar, portabilidade</p>
          <p className="text-gray-300"><strong>Compromisso:</strong> NUNCA venderemos seus dados | Proteção máxima LGPD | Transparência total</p>
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-zinc-700 pt-6 mt-8">
        <p className="text-sm text-gray-400 text-center">
          Ao utilizar a Plataforma Hora Certa, você declara ter lido, compreendido e concordado com esta Política de Privacidade e Proteção de Dados.
        </p>
        <p className="text-sm text-gray-500 text-center mt-2">
          Data de vigência: 13 de novembro de 2025 | Versão 1.0
        </p>
      </div>
    </div>
  );
};
