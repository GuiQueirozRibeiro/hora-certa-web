import { FormEndereco } from "./Forms/FormEndereco";
import { FormMeusDados } from "./Forms/FormMeusDados";
import { FormPagamentos } from "./Forms/FormPagamento";
import { FormSeguranca } from "./Forms/FormSeguranca";
import { FormTermos } from "./Forms/FormTermos";
// import { FormPagamento } from "./Forms/FormPagamento";
// import { FormFavoritos } from "./Forms/FormFavoritos";


type AbaAtiva = 'meus-dados' | 'endereco' | 'seguranca' | 'termos' | 'pagamento' | 'favoritos';

type AreaDeConteudoProps = {
  abaAtiva: AbaAtiva;
}

export function AreaConteudo({abaAtiva} : AreaDeConteudoProps) {
    switch (abaAtiva) {
        case 'meus-dados':
            return <FormMeusDados/>;
            break;
        case 'endereco':
            return <FormEndereco/>; 
    
        case 'seguranca':
            return <FormSeguranca/>;
    
        case 'termos':
            return <FormTermos/>;

        // case 'pagamento':
        //     return <FormPagamentos/>;

        case 'favoritos':
            return <h2 className="text-2xl font-bold text-white">Favoritos (WIP)</h2>;
        default:
            return <FormMeusDados />;
            }
}