// ===============================
// SISTEMA NPOR V0.9 - VERSÃO INTEGRADA COM API (COM FALLBACKS E RESILIÊNCIA)
// ===============================

let usuarioLogado = false;
let materiais = [];
let categorias = [];
let listaLocais = []; // Global correta
let companhias = [];
let contadorId = 1;
let editandoId = null;
let termoPesquisa = "";
let filtroSituacao = ""; // String vazia representa "Todos" os materiais (sem filtro de situação)
let materialDetalhesId = null;
let materialManutencaoId = null;
let abrirCautelaAoSalvar = false;
let materiaisSelecionados = new Set();
let modoCautelaEmMassa = false;

const USUARIO = "admin";
const SENHA = "1234";
const CHAVE_LOGIN = "sistemaCautelaUsuarioLogado";

// Configuração de URL da API do Servidor
const API_URL = "https://sistema-cautela-npor.onrender.com";

// ELEMENTOS DO PAINEL DE CONTROLE (DASHBOARD)
const dbCardTotal = document.getElementById("dbCardTotal");
const dbCardDisponiveis = document.getElementById("dbCardDisponiveis");
const dbCardCautelados = document.getElementById("dbCardCautelados");
const dbCardManutencao = document.getElementById("dbCardManutencao");
const dbCardInutilizados = document.getElementById("dbCardInutilizados");

// ELEMENTOS GERAIS
const btnLogin = document.getElementById("btnLoginHeader");
const btnNovoMaterial = document.getElementById("novoMaterial");
const btnCautelarMaterial = document.getElementById("btnCautelarMaterial");
const btnCautelarSelecionados = document.getElementById("btnCautelarSelecionados");
const modalLogin = document.getElementById("modalLogin");
const modalMaterial = document.getElementById("modalMaterial");
const modalCategorias = document.getElementById("modalCategorias");
const modalCautela = document.getElementById("modalCautela");
const modalHistorico = document.getElementById("modalHistorico");
const modalDetalhes = document.getElementById("modalDetalhes");
const modalManutencao = document.getElementById("modalManutencao");
const usuarioLogadoTexto = document.getElementById("usuarioLogado");
const campoUsuario = document.getElementById("usuario");
const campoSenha = document.getElementById("senha");
const btnEntrar = document.getElementById("entrar");
const btnCancelarLogin = document.getElementById("cancelarLogin");
const btnFecharMaterial = document.getElementById("fecharMaterial");
const btnSalvarMaterial = document.getElementById("salvarMaterial");

// Busca flexível do container para evitar quebras de ID
const lista = document.getElementById("cardsMateriais") || document.getElementById("container-materiais");

const contador = document.getElementById("quantidadeMateriais");
const totalMateriaisEl = document.getElementById("totalMateriais");
const materiaisDisponiveisEl = document.getElementById("materiaisDisponiveis");
const materiaisCauteladosEl = document.getElementById("materiaisCautelados");
const materiaisManutencaoEl = document.getElementById("materiaisManutencao");
const materiaisInutilizadosEl = document.getElementById("materiaisInutilizados");
const campoPesquisa = document.getElementById("pesquisa");
const msg = document.getElementById("mensagemSistema");
const categoriaSelect = document.getElementById("categoriaMaterial");
const localSelect = document.getElementById("localMaterial");
const listaCatModal = document.getElementById("listaCategoriasModal");
const btnFecharCategorias = document.getElementById("btnFecharCategorias");
const btnAdicionarCategoria = document.getElementById("btnAdicionarCategoria");
const btnFecharCautela = document.getElementById("fecharCautela");
const btnSalvarCautela = document.getElementById("salvarCautela");
const modalDescautela = document.getElementById("modalDescautela");
const dataDescautela = document.getElementById("dataDescautela");
const quemDescautelou = document.getElementById("quemDescautelou");
const obsDescautela = document.getElementById("obsDescautela");
const campoQuantidadeDescautela = document.getElementById("quantidadeDescautela");
const btnSalvarDescautela = document.getElementById("salvarDescautela");
const btnFecharDescautela = document.getElementById("fecharDescautela");
const btnFecharHistorico = document.getElementById("fecharHistorico");
let materialDescautelaId = null;
const btnFecharDetalhes = document.getElementById("fecharDetalhes");
const btnEditarDetalhes = document.getElementById("btnEditarDetalhes");
const btnExcluirDetalhes = document.getElementById("btnExcluirDetalhes");
const btnHistoricoDetalhes = document.getElementById("btnHistoricoDetalhes");
const btnDescautelarDetalhes = document.getElementById("btnDescautelarDetalhes");
const btnManutencaoDetalhes = document.getElementById("btnManutencaoDetalhes");
const btnFecharFoto = document.getElementById("fecharFoto");
const btnEditarFotoModal = document.getElementById("editarFotoModal");
const tituloHistorico = document.getElementById("tituloHistorico");
const conteudoHistorico = document.getElementById("conteudoHistorico");
const tituloDetalhes = document.getElementById("tituloDetalhes");
const conteudoDetalhes = document.getElementById("conteudoDetalhes");
const modalFoto = document.getElementById("modalFoto");
const imagemAmpliada = document.getElementById("imagemAmpliada");
const dataManutencao = document.getElementById("dataManutencao");
const quemFezManutencao = document.getElementById("quemFezManutencao");
const descricaoManutencao = document.getElementById("descricaoManutencao");
const btnSalvarManutencao = document.getElementById("salvarManutencao");
const btnFecharManutencao = document.getElementById("fecharManutencao");
const tabHistoricoManut = document.getElementById("tabHistoricoManut");
const tabNovaManut = document.getElementById("tabNovaManut");
const conteudoHistoricoManut = document.getElementById("conteudoHistoricoManut");
const conteudoNovaManut = document.getElementById("conteudoNovaManut");

// CAUTELA modal tabs
const tabHistoricoCaut = document.getElementById("tabHistoricoCaut");
const tabNovaCaut = document.getElementById("tabNovaCaut");
const conteudoHistoricoCaut = document.getElementById("conteudoHistoricoCaut");
const conteudoNovaCaut = document.getElementById("conteudoNovaCaut");

const codigo = document.getElementById("codigoMaterial");
const tituloModalMaterial = document.getElementById("tituloModalMaterial");
const nome = document.getElementById("nomeMaterial");
const modelo = document.getElementById("modeloMaterial");
const quantidade = document.getElementById("quantidadeMaterial");
const situacao = document.getElementById("situacaoMaterial");
const observacao = document.getElementById("observacaoMaterial");

// Elementos de Cautela
const selectMaterialCautela = document.getElementById("materialCautelaSelect");
const campoPesquisaCautela = document.getElementById("pesquisaMaterialCautela");

const listaMateriaisSelecionados = document.getElementById("listaMateriaisSelecionados");
const campoNomeMilitarCautela = document.getElementById("nomeMilitarCautela");
const campoCompanhiaCautela = document.getElementById("companhiaMilitarCautela");
const campoDataCautela = document.getElementById("dataCautela");
const campoLocalCautela = document.getElementById("localCautela");
const infoCautela = document.getElementById("infoCautela");
const quantidadeTotalInfo = document.getElementById("quantidadeTotalInfo");
const quantidadeCauteladaInfo = document.getElementById("quantidadeCauteladaInfo");
const quantidadeDisponiavelInfo = document.getElementById("quantidadeDisponiavelInfo");
const campoQuantidadeCautela = document.getElementById("quantidadeCautela");
const campoQuemCautelou = document.getElementById("quemCautelou");
const campoObsCautela = document.getElementById("obsCautela");
const dataListCauteladores = document.getElementById("cauteladores");
const inputFotoMaterial = document.getElementById("fotoMaterial");
const inputFotoMaterialHidden = document.getElementById("fotoMaterialHidden");
const btnSalvarCriarOutro = document.getElementById("salvarCriarOutro");
let materialFotoId = null;
const situacoes = ["Disponível", "Cautelado", "Em manutenção", "Inutilizado"];

// FUNÇÕES DE COMUNICAÇÃO COM A API DO SERVIDOR
async function sincronizarMaterialComServidor(material, metodo) {
    const url = metodo === "POST" ? `${API_URL}/materiais` : `${API_URL}/materiais/${material.id}`;
    const res = await fetch(url, {
        method: metodo,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(material)
    });
    if (!res.ok) {
        throw new Error(`Falha ao sincronizar com o servidor: ${res.statusText}`);
    }
    return await res.json();
}

async function deletarMaterialDoServidor(id) {
    const res = await fetch(`${API_URL}/materiais/${id}`, {
        method: "DELETE"
    });
    if (!res.ok) {
        throw new Error(`Falha ao remover item do servidor: ${res.statusText}`);
    }
}

// STORAGE E SINCRONIZAÇÃO INICIAL
function salvarDados() {
    localStorage.setItem("materiais", JSON.stringify(materiais));
    localStorage.setItem("categorias", JSON.stringify(categorias));
    localStorage.setItem("locais", JSON.stringify(listaLocais));
    localStorage.setItem("companhias", JSON.stringify(companhias));
    localStorage.setItem("contadorId", contadorId.toString());
}

async function buscarMateriais() {
    for (let tentativa = 1; tentativa <= 5; tentativa++) {
        try {
            const res = await fetch(`${API_URL}/materiais`);

            if (res.ok) {
                return await res.json();
            }

        } catch (e) {
            console.log(`Tentativa ${tentativa}...`);
        }

        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    throw new Error("Servidor indisponível.");
}

async function carregarDados() {
    categorias = JSON.parse(localStorage.getItem("categorias")) || ["Ferramenta", "Material de consumo", "Material de escritório", "Fardamento", "Equipamento", "Outros"];
    listaLocais = JSON.parse(localStorage.getItem("locais")) || ["Subtenência", "1ª Cia", "2ª Cia", "SCP"];
    companhias = JSON.parse(localStorage.getItem("companhias")) || ["1ª Cia", "2ª Cia", "SCP", "Cia Cmdo"];
    contadorId = Number(localStorage.getItem("contadorId")) || 1;

    try {
        materiais = await buscarMateriais();
        // Ajusta o contador de ID com segurança prevenindo NaN por conta de strings do Firestore
        if (materiais.length > 0) {
            const maxId = Math.max(...materiais.map(m => {
                const num = Number(m.id);
                return isNaN(num) ? 0 : num;
            }));
            contadorId = maxId + 1;
            localStorage.setItem("contadorId", contadorId.toString());
        }
    } catch (error) {
        console.warn("Não foi possível conectar à API. Carregando dados locais do LocalStorage como fallback.", error);
        materiais = JSON.parse(localStorage.getItem("materiais")) || [];
    }
}

function salvarEstadoLogin() {
    localStorage.setItem(CHAVE_LOGIN, usuarioLogado ? "true" : "false");
}

function carregarEstadoLogin() {
    usuarioLogado = localStorage.getItem(CHAVE_LOGIN) === "true";
}

// CONVERSOR SEGURO DE DATAS PARA PADRÃO BRASILEIRO
function formatarDataBR(dataIso) {
    if (!dataIso) return "";
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dataIso)) return dataIso;
    
    const partes = dataIso.split("-");
    if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataIso;
}

// LÓGICA DE CATEGORIAS
function atualizarCategorias() {
    categoriaSelect.innerHTML = `<option value="">Selecione a categoria</option>`;
    categorias.forEach(c => categoriaSelect.innerHTML += `<option value="${c}">${c}</option>`);
    categoriaSelect.innerHTML += `<option value="GERENCIAR" style="font-weight:bold; color:blue;">+ Gerenciar Categorias</option>`;
}

// LÓGICA DE LOCAIS DE ARMAZENAMENTO
function atualizarLocais() {
    if (!localSelect) return;
    localSelect.innerHTML = `<option value="">Selecione o local de armazenamento *</option>`;
    listaLocais.forEach(l => localSelect.innerHTML += `<option value="${l}">${l}</option>`);
    localSelect.innerHTML += `<option value="GERENCIAR_LOCAIS" style="font-weight:bold; color:blue;">+ Gerenciar Locais</option>`;
}

function renderizarModalLocais() {
    const listaLocaisModal = document.getElementById("listaLocaisModal");
    if (!listaLocaisModal) return;
    listaLocaisModal.innerHTML = "";
    listaLocais.forEach((l, i) => {
        listaLocaisModal.innerHTML += `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #ddd; padding-bottom:5px;">
                <span>${l}</span>
                <div>
                    <button onclick="editarLocal(${i})">✏️</button>
                    <button onclick="excluirLocal(${i})">❌</button>
                </div>
            </div>`;
    });
}

if (localSelect) {
    localSelect.addEventListener("change", (e) => {
        if (e.target.value === "GERENCIAR_LOCAIS") {
            if (!precisaLogin()) { localSelect.value = ""; return; }
            renderizarModalLocais();
            document.getElementById("modalLocais").style.display = "flex";
        }
    });
}

const btnAdicionarLocal = document.getElementById("btnAdicionarLocal");
const btnFecharLocais = document.getElementById("btnFecharLocais");

if (btnAdicionarLocal) {
    btnAdicionarLocal.addEventListener("click", () => {
        const novo = prompt("Nome do novo local de armazenamento:");
        if (novo && !listaLocais.includes(novo)) { listaLocais.push(novo); salvarDados(); atualizarLocais(); renderizarModalLocais(); }
    });
}
if (btnFecharLocais) {
    btnFecharLocais.addEventListener("click", () => {
        document.getElementById("modalLocais").style.display = "none";
        localSelect.value = "";
    });
}

window.editarLocal = (i) => {
    const novo = prompt("Novo nome para o local " + listaLocais[i] + ":", listaLocais[i]);
    if (novo) { listaLocais[i] = novo; salvarDados(); atualizarLocais(); renderizarModalLocais(); }
};

window.excluirLocal = (i) => {
    if (confirm("Tem certeza que deseja excluir este local de armazenamento?")) {
        listaLocais.splice(i, 1);
        salvarDados();
        atualizarLocais();
        renderizarModalLocais();
    }
};

// LÓGICA DE COMPANHIAS MILITARES
function atualizarCompanhias() {
    if (!campoCompanhiaCautela) return;
    campoCompanhiaCautela.innerHTML = `<option value="">Selecione a companhia *</option>`;
    companhias.forEach(c => campoCompanhiaCautela.innerHTML += `<option value="${c}">${c}</option>`);
    campoCompanhiaCautela.innerHTML += `<option value="GERENCIAR_COMPANHIAS" style="font-weight:bold; color:blue;">+ Gerenciar Companhias</option>`;
}

function renderizarModalCompanhias() {
    const listaCompanhiasModal = document.getElementById("listaCompanhiasModal");
    if (!listaCompanhiasModal) return;
    listaCompanhiasModal.innerHTML = "";
    companhias.forEach((c, i) => {
        listaCompanhiasModal.innerHTML += `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #ddd; padding-bottom:5px;">
                <span>${c}</span>
                <div>
                    <button onclick="editarCompanhia(${i})">✏️</button>
                    <button onclick="excluirCompanhia(${i})">❌</button>
                </div>
            </div>`;
    });
}

if (campoCompanhiaCautela) {
    campoCompanhiaCautela.addEventListener("change", (e) => {
        if (e.target.value === "GERENCIAR_COMPANHIAS") {
            if (!precisaLogin()) { campoCompanhiaCautela.value = ""; return; }
            renderizarModalCompanhias();
            document.getElementById("modalCompanhias").style.display = "flex";
        }
    });
}

const btnAdicionarCompanhia = document.getElementById("btnAdicionarCompanhia");
const btnFecharCompanhias = document.getElementById("btnFecharCompanhias");

if (btnAdicionarCompanhia) {
    btnAdicionarCompanhia.addEventListener("click", () => {
        const novo = prompt("Nome da nova companhia:");
        if (novo && !companhias.includes(novo)) { companhias.push(novo); salvarDados(); atualizarCompanhias(); renderizarModalCompanhias(); }
    });
}
if (btnFecharCompanhias) {
    btnFecharCompanhias.addEventListener("click", () => {
        document.getElementById("modalCompanhias").style.display = "none";
        campoCompanhiaCautela.value = "";
    });
}

window.editarCompanhia = (i) => {
    const novo = prompt("Novo nome para a companhia " + companhias[i] + ":", companhias[i]);
    if (novo) { companhias[i] = novo; salvarDados(); atualizarCompanhias(); renderizarModalCompanhias(); }
};

window.excluirCompanhia = (i) => {
    if (confirm("Tem certeza que deseja excluir esta companhia?")) {
        companhias.splice(i, 1);
        salvarDados();
        atualizarCompanhias();
        renderizarModalCompanhias();
    }
};

// ATUALIZAÇÃO DO SELETOR DE SITUAÇÕES
function atualizarSituacoes() {
    situacao.innerHTML = situacoes.map(s => `<option value="${s}">${s}</option>`).join("");
}

function renderizarModalCategorias() {
    listaCatModal.innerHTML = "";
    categorias.forEach((c, i) => {
        listaCatModal.innerHTML += `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #ddd; padding-bottom:5px;">
                <span>${c}</span>
                <div>
                    <button onclick="editarCat(${i})">✏️</button>
                    <button onclick="excluirCat(${i})">❌</button>
                </div>
            </div>`;
    });
}

categoriaSelect.addEventListener("change", (e) => {
    if (e.target.value === "GERENCIAR") {
        if (!precisaLogin()) { categoriaSelect.value = ""; return; }
        renderizarModalCategorias();
        modalCategorias.style.display = "flex";
    }
});

btnFecharCategorias.addEventListener("click", () => { modalCategorias.style.display = "none"; categoriaSelect.value = ""; });
btnAdicionarCategoria.addEventListener("click", () => {
    const nova = prompt("Nome da nova categoria:");
    if (nova && !categorias.includes(nova)) { categorias.push(nova); salvarDados(); atualizarCategorias(); renderizarModalCategorias(); }
});

window.editarCat = (i) => {
    const novo = prompt("Novo nome para " + categorias[i] + ":", categorias[i]);
    if (novo) { categorias[i] = novo; salvarDados(); atualizarCategorias(); renderizarModalCategorias(); }
};

window.excluirCat = (i) => {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
        categorias.splice(i, 1);
        salvarDados();
        atualizarCategorias();
        renderizarModalCategorias();
    }
};

// LOGIN E UI
function atualizarUI() {
    if (usuarioLogado) {
        usuarioLogadoTexto.innerHTML = "👤 Daniel<br>Administrador";
        btnLogin.textContent = "Sair";
    } else {
        usuarioLogadoTexto.textContent = "Visitante";
        btnLogin.textContent = "Login";
    }
}

// MENSAGEM DO SISTEMA
function mostrarMensagem(texto, tipo) {
    msg.innerHTML = `<div class="msg ${tipo}">${texto}</div>`;
    setTimeout(() => msg.innerHTML = "", 3000);
}

btnLogin.addEventListener("click", () => {
    if (!usuarioLogado) modalLogin.style.display = "flex";
    else {
        usuarioLogado = false;
        salvarEstadoLogin();
        atualizarUI();
        renderizar();
        mostrarMensagem("Logout realizado", "sucesso");
    }
});

btnEntrar.addEventListener("click", () => {
    if (campoUsuario.value === USUARIO && campoSenha.value === SENHA) {
        usuarioLogado = true;
        salvarEstadoLogin();
        atualizarUI();
        modalLogin.style.display = "none";
        campoUsuario.value = ""; campoSenha.value = "";
        renderizar();
        mostrarMensagem("Login realizado", "sucesso");
    } else { mostrarMensagem("Usuário ou senha incorretos", "erro"); }
});

btnCancelarLogin.addEventListener("click", () => modalLogin.style.display = "none");

function precisaLogin() {
    if (!usuarioLogado) {
        mostrarMensagem("Você precisa de login para acessar esta função!", "erro");
        modalLogin.style.display = "flex";
        return false;
    }
    return true;
}

function fecharMaterial() {
    modalMaterial.style.display = "none";
    limpar();
    editandoId = null;
    tituloModalMaterial.textContent = "Novo Material";
}

function gerarCodigo() {
    return `MAT-${String(contadorId).padStart(4, "0")}`;
}

function abrirMaterial() {
    if (!usuarioLogado) return;
    editandoId = null;
    limpar();
    codigo.value = "";
    tituloModalMaterial.textContent = "Novo Material";
    modalMaterial.style.display = "flex";
}

btnFecharMaterial.addEventListener("click", fecharMaterial);
btnSalvarMaterial.addEventListener("click", () => salvar(false));
if (btnSalvarCriarOutro) btnSalvarCriarOutro.addEventListener("click", () => salvar(true));

function limpar() {
    nome.value = ""; modelo.value = ""; localSelect.value = ""; quantidade.value = "1";
    situacao.value = "Disponível"; observacao.value = ""; categoriaSelect.value = ""; inputFotoMaterial.value = "";
}

situacao.addEventListener("change", () => {
    if (!usuarioLogado) return;

    if (situacao.value === "Cautelado") {
        if (editandoId !== null) {
            abrirCautela(editandoId, "nova");
            return;
        }

        abrirCautelaAoSalvar = true;
        mostrarMensagem("Salve o material para criar a cautela", "sucesso");
    }
});

function converterFotoParaBase64(file) {
    return new Promise((resolve, reject) => {
        if (!file) return resolve(null);
        const leitor = new FileReader();
        leitor.onload = () => resolve(leitor.result);
        leitor.onerror = reject;
        leitor.readAsDataURL(file);
    });
}

// CÁLCULO SEGURO E DINÂMICO DE QUANTIDADE DISPONÍVEL (COM SUPORTE A VALORES PADRÕES)
function getQuantidadeDisponivel(material) {
    if (!material) return 0;
    const situacaoTexto = String(material.situacao || "Disponível").trim().toLowerCase();
    
    if (situacaoTexto === "em manutenção" || situacaoTexto === "em manutencao" || situacaoTexto === "inutilizado") {
        return 0;
    }
    
    const quantidadeTotal = Math.max(0, material.quantidade !== undefined ? material.quantidade : 1);
    const quantidadeCautelada = Math.max(0, material.quantidadeCautelada || 0);
    return Math.max(0, quantidadeTotal - quantidadeCautelada);
}

function corStatus(status) {
    const valor = String(status || "").trim().toLowerCase();
    if (valor === "disponível" || valor === "disponivel") return "disponivel";
    if (valor === "cautelado") return "cautelado";
    if (valor === "em manutenção" || valor === "em manutencao") return "manutencao";
    if (valor === "inutilizado") return "inutilizado";
    return "";
}

// FILTRO GERAL DE PESQUISA
function getMateriaisVisiveis() {
    const termo = termoPesquisa.trim().toLowerCase();
    let filtrados = materiais;

    // Filtro por Texto de Pesquisa
    if (termo) {
        filtrados = filtrados.filter(m => {
            const valores = [m.nome, m.codigo, m.modelo, m.categoria, m.local, m.situacao, m.observacao]
                .filter(Boolean)
                .map(v => String(v).toLowerCase());

            return valores.some(v => v.includes(termo));
        });
    }

    // Filtro de Situação por Clique no Dashboard
    if (filtroSituacao) {
        filtrados = filtrados.filter(m => {
            const quantidadeDisponivel = getQuantidadeDisponivel(m);
            let situacaoEfetiva = m.situacao || "Disponível";
            if (quantidadeDisponivel === 0 && (situacaoEfetiva === "Disponível" || situacaoEfetiva === "Disponivel")) {
                situacaoEfetiva = "Cautelado";
            }

            const situacaoTexto = String(situacaoEfetiva || "").trim().toLowerCase();
            const filtroTexto = filtroSituacao.trim().toLowerCase();

            if (filtroTexto === "disponível" || filtroTexto === "disponivel") {
                return situacaoTexto === "disponível" || situacaoTexto === "disponivel";
            }
            if (filtroTexto === "em manutenção" || filtroTexto === "em manutencao") {
                return situacaoTexto === "em manutenção" || situacaoTexto === "em manutencao";
            }
            return situacaoTexto === filtroTexto;
        });
    }

    return filtrados;
}

// POPULAR E FILTRAR O MENU DE SELEÇÃO NA CAUTELA
function popularSelectCautela(termo = "") {
    if (!selectMaterialCautela) return;
    const valorSelecionadoAnterior = selectMaterialCautela.value;
    
    selectMaterialCautela.innerHTML = '<option value="">Selecione um material</option>';
    
    const termoLimpo = termo.trim().toLowerCase();
    let opcoesAdicionadas = 0;
    let ultimoMaterialId = null;

    materiais.forEach(m => {
        const identificador = `${m.codigo || "MAT-0000"} - ${m.nome || "Sem nome"}`.toLowerCase();
        if (!termoLimpo || identificador.includes(termoLimpo)) {
            selectMaterialCautela.innerHTML += `<option value="${m.id}">${m.codigo || "MAT-0000"} - ${m.nome || "Sem nome"}</option>`;
            opcoesAdicionadas++;
            ultimoMaterialId = m.id;
        }
    });

    // Se houver apenas uma opção encontrada correspondente após a pesquisa, seleciona ela automaticamente
    if (opcoesAdicionadas === 1 && termoLimpo !== "") {
        selectMaterialCautela.value = String(ultimoMaterialId);
        // Força a atualização do Local e Quantidades Disponíveis correspondentes
        selectMaterialCautela.dispatchEvent(new Event("change"));
    } else {
        selectMaterialCautela.value = valorSelecionadoAnterior;
    }
}

function popularAutocompleteCauteladores() {
    const nomes = new Set();
    materiais.forEach(m => {
        if (m.historicoCautelas) {
            m.historicoCautelas.forEach(reg => {
                if (reg.cauteladoPor) nomes.add(reg.cauteladoPor.trim());
            });
        }
        if (m.cautela?.cauteladoPor) {
            nomes.add(m.cautela.cauteladoPor.trim());
        }
    });
    dataListCauteladores.innerHTML = "";
    Array.from(nomes).sort().forEach(nome => {
        dataListCauteladores.innerHTML += `<option value="${nome}">`;
    });
}

function atualizarBotaoCautelaTopo() {
    if (materiaisSelecionados.size > 0) {
        btnCautelarMaterial.textContent = `Cautelar Selecionados (${materiaisSelecionados.size})`;
        if (btnCautelarSelecionados) btnCautelarSelecionados.style.display = 'inline-flex';
    } else {
        btnCautelarMaterial.textContent = 'Cautelar Material';
        if (btnCautelarSelecionados) btnCautelarSelecionados.style.display = 'none';
    }
}

function alternarSelecao(id, selecionado) {
    if (selecionado) materiaisSelecionados.add(id);
    else materiaisSelecionados.delete(id);
    atualizarBotaoCautelaTopo();
    renderizar();
}

window.alternarSelecao = alternarSelecao;

function limparCautela() {
    if (campoPesquisaCautela) {
        campoPesquisaCautela.value = ""; // Limpa a caixa de pesquisa do modal
    }
    if (selectMaterialCautela) {
        selectMaterialCautela.value = "";
    }
    campoLocalCautela.value = "";
    infoCautela.style.display = "none";
    campoQuantidadeCautela.value = "1";
    campoQuantidadeCautela.removeAttribute("max");
    campoNomeMilitarCautela.value = "";
    campoCompanhiaCautela.value = "";
    campoDataCautela.value = new Date().toISOString().split("T")[0];
    campoQuemCautelou.value = "";
    campoObsCautela.value = "";
}

function abrirCautela(id, aba = 'historico', bulk = false) {
    if (!precisaLogin()) return;
    if (materiais.length === 0) {
        mostrarMensagem("Cadastre um material antes de cautelar", "erro");
        return;
    }

    modoCautelaEmMassa = bulk || materiaisSelecionados.size > 0;
    popularSelectCautela();
    limparCautela();

    const materialSelecionado = id ? materiais.find(m => String(m.id) === String(id)) : null;

    if (modoCautelaEmMassa) {
        if (selectMaterialCautela) selectMaterialCautela.style.display = 'none';
        if (campoPesquisaCautela) campoPesquisaCautela.style.display = 'none';
        listaMateriaisSelecionados.style.display = 'block';
        listaMateriaisSelecionados.innerHTML = `<strong>Materiais selecionados (${materiaisSelecionados.size}):</strong> ` +
            Array.from(materiaisSelecionados)
                .map(idSel => {
                    const material = materiais.find(m => String(m.id) === String(idSel));
                    return material ? `${material.nome}` : '';
                })
                .filter(Boolean)
                .join('<br>');

        const locaisArmaz = Array.from(materiaisSelecionados)
            .map(idSel => materiais.find(m => String(m.id) === String(idSel))?.local)
            .filter(Boolean);

        campoLocalCautela.value = locaisArmaz.length === 0 ? "" : [...new Set(locaisArmaz)].length === 1 ? locaisArmaz[0] : "Locais diferentes";
    } else {
        if (selectMaterialCautela) selectMaterialCautela.style.display = 'block';
        if (campoPesquisaCautela) campoPesquisaCautela.style.display = 'block';
        listaMateriaisSelecionados.style.display = 'none';
        if (materialSelecionado) {
            selectMaterialCautela.value = String(id);
            campoLocalCautela.value = materialSelecionado.local || "Não informado";
            
            const disponivel = getQuantidadeDisponivel(materialSelecionado);
            infoCautela.style.display = "block";
            quantidadeTotalInfo.textContent = materialSelecionado.quantidade !== undefined ? materialSelecionado.quantidade : 1;
            quantidadeCauteladaInfo.textContent = materialSelecionado.quantidadeCautelada || 0;
            quantidadeDisponiavelInfo.textContent = disponivel;
            campoQuantidadeCautela.max = disponivel;
            
            if (aba === 'historico' && conteudoHistoricoCaut) renderizarHistoricoCautela(materialSelecionado);
        }
    }

    popularAutocompleteCauteladores();
    atualizarCompanhias();

    if (tabHistoricoCaut && tabNovaCaut && conteudoHistoricoCaut && conteudoNovaCaut) {
        if (aba === 'nova' || modoCautelaEmMassa) {
            tabNovaCaut.classList.add("active");
            tabHistoricoCaut.classList.remove("active");
            conteudoHistoricoCaut.style.display = "none";
            conteudoNovaCaut.style.display = "block";

            // Exibe o botão de salvar na aba de criação
            document.getElementById("salvarCautela").style.display = "";
            document.getElementById("fecharCautela").textContent = "Cancelar";
        } else {
            tabHistoricoCaut.classList.add("active");
            tabNovaCaut.classList.remove("active");
            conteudoHistoricoCaut.style.display = "block";
            conteudoNovaCaut.style.display = "none";

            // Oculta o botão de salvar na aba de apenas visualização
            document.getElementById("salvarCautela").style.display = "none";
            document.getElementById("fecharCautela").textContent = "Fechar";
            
            if (!id) conteudoHistoricoCaut.innerHTML = "<p>Selecione um material para ver o histórico de cautelas.</p>";
        }
    }
    document.body.classList.add('modal-aberto');
    modalCautela.style.display = "flex";
}

function fecharCautelaModal() {
    modalCautela.style.display = "none";
    limparCautela();
    document.body.classList.remove('modal-aberto');
}

// HISTÓRICO DE FORMA CONTÍNUA E SEM LIMITAÇÕES ARTIFICIAIS DE CAPACIDADE
function adicionarAoHistorico(material, registro) {
    if (!material) return;
    if (!material.historicoCautelas) material.historicoCautelas = [];
    material.historicoCautelas.push(registro);
}

// SALVA CAUTELA DE FORMA ASSÍNCRONA E SINCRONIZA COM A API
async function salvarCautela() {
    if (!usuarioLogado) return;

    if (!campoNomeMilitarCautela.value.trim() || !campoCompanhiaCautela.value.trim() || !campoQuemCautelou.value.trim()) {
        mostrarMensagem("Preencha o nome do militar, companhia e quem cautelou", "erro");
        return;
    }

    const quantidadeACautelar = Number(campoQuantidadeCautela.value) || 1;

    const registroCautela = {
        nomeMilitar: campoNomeMilitarCautela.value.trim(),
        companhia: campoCompanhiaCautela.value.trim(),
        data: campoDataCautela.value || new Date().toISOString().split("T")[0],
        cauteladoPor: campoQuemCautelou.value.trim(),
        local: null,
        observacao: campoObsCautela.value.trim(),
        quantidade: quantidadeACautelar,
        descauteladoPor: null,
        dataDescautelado: null,
        observacaoDescautelado: null,
        quantidadeDescautelada: 0
    };

    const materiaisParaCautelar = modoCautelaEmMassa
        ? Array.from(materiaisSelecionados).map(id => materiais.find(m => String(m.id) === String(id))).filter(Boolean)
        : [materiais.find(m => String(m.id) === String(selectMaterialCautela.value))];

    if (modoCautelaEmMassa && materiaisParaCautelar.length === 0) {
        mostrarMensagem("Selecione pelo menos um material para cautelar", "erro");
        return;
    }

    if (!modoCautelaEmMassa && !materiaisParaCautelar[0]) {
        mostrarMensagem("Selecione um material para cautelar", "erro");
        return;
    }

    // Validações de quantidade
    for (const material of materiaisParaCautelar) {
        const quantidadeDisponivel = getQuantidadeDisponivel(material);
        
        if (!modoCautelaEmMassa) {
            if (quantidadeDisponivel <= 0) {
                mostrarMensagem(`Não há unidades disponíveis de "${material.nome}" para cautelar`, "erro");
                return;
            }
            
            if (quantidadeACautelar > quantidadeDisponivel) {
                mostrarMensagem(`Não há ${quantidadeACautelar} unidades disponíveis de "${material.nome}". Disponível: ${quantidadeDisponivel}`, "erro");
                return;
            }
        } else {
            if (quantidadeDisponivel <= 0) {
                mostrarMensagem(`Não há unidades disponíveis de "${material.nome}" para cautelar`, "erro");
                return;
            }
        }
    }

    let exitoSincronizacao = true;

    for (const material of materiaisParaCautelar) {
        // Cópias para rollback em caso de falhas na conexão
        const backupEstado = JSON.parse(JSON.stringify(material));

        const quantidadeASubtrair = modoCautelaEmMassa ? 1 : quantidadeACautelar;
        material.quantidadeCautelada = (material.quantidadeCautelada || 0) + quantidadeASubtrair;
        
        if (material.quantidadeCautelada >= material.quantidade) {
            material.situacao = "Cautelado";
        }
        
        const registroComLocal = { 
            ...registroCautela, 
            local: material.local || "Não informado",
            quantidade: quantidadeASubtrair
        };
        material.cautela = registroComLocal;
        adicionarAoHistorico(material, registroComLocal);

        try {
            await sincronizarMaterialComServidor(material, "PUT");
        } catch (error) {
            console.error("Erro ao sincronizar cautela no servidor:", error);
            exitoSincronizacao = false;
            // Rollback local em caso de falha física no banco
            const idx = materiais.findIndex(m => String(m.id) === String(material.id));
            if (idx !== -1) materiais[idx] = backupEstado;
        }
    }

    salvarDados();
    renderizar();
    fecharCautelaModal();
    popularAutocompleteCauteladores();

    if (exitoSincronizacao) {
        if (modoCautelaEmMassa) {
            materiaisSelecionados.clear();
            atualizarBotaoCautelaTopo();
            mostrarMensagem(`${materiaisParaCautelar.length} materiais cautelados e salvos no servidor`, "sucesso");
        } else {
            mostrarMensagem(`${quantidadeACautelar} unidade(s) de "${materiaisParaCautelar[0].nome}" cautelada(s) e salva(s)`, "sucesso");
        }
    } else {
        mostrarMensagem("A cautela falhou ao salvar no servidor. Operação revertida.", "erro");
    }
    
    modoCautelaEmMassa = false;
}

// ABRE O FORMULÁRIO DE DESCAUTELA MAPEANDO E REUNINDO APENAS AS CAUTELAS ATIVAS
function abrirDescautela(id) {
    if (!usuarioLogado) {
        precisaLogin();
        return;
    }

    const material = materiais.find(m => String(m.id) === String(id));
    if (!material || (material.quantidadeCautelada || 0) <= 0) {
        mostrarMensagem("Apenas materiais com unidades cauteladas podem ser descautelados", "erro");
        return;
    }

    materialDescautelaId = id;
    const nomeInfo = document.getElementById("descautelaNomeMaterial");
    if (nomeInfo) {
        nomeInfo.innerHTML = `${material.codigo || "MAT-0000"} - ${material.nome || "Sem nome"}`;
    }

    const activeEntries = material.historicoCautelas ? material.historicoCautelas.filter(h => !h.dataDescautelado) : [];
    const selecionarCautelaAtiva = document.getElementById("selecionarCautelaAtiva");
    if (selecionarCautelaAtiva) {
        selecionarCautelaAtiva.innerHTML = '<option value="">Selecione quem está devolvendo *</option>';
        activeEntries.forEach(entry => {
            const originalIndex = material.historicoCautelas.indexOf(entry);
            selecionarCautelaAtiva.innerHTML += `<option value="${originalIndex}">${entry.nomeMilitar} (${entry.companhia}) - Pendente: ${entry.quantidade}</option>`;
        });
        
        // Define o primeiro registro pendente por padrão
        if (activeEntries.length > 0) {
            const firstEntry = activeEntries[0];
            const firstIdx = material.historicoCautelas.indexOf(firstEntry);
            selecionarCautelaAtiva.value = String(firstIdx);
            campoQuantidadeDescautela.max = firstEntry.quantidade;
            campoQuantidadeDescautela.value = firstEntry.quantidade;
        } else {
            campoQuantidadeDescautela.max = 0;
            campoQuantidadeDescautela.value = 1;
        }
    }

    dataDescautela.value = new Date().toISOString().split("T")[0];
    quemDescautelou.value = "";
    obsDescautela.value = "";
    document.body.classList.add('modal-aberto');
    modalDescautela.style.display = "flex";
}

function fecharDescautelaModal() {
    modalDescautela.style.display = "none";
    materialDescautelaId = null;
    document.body.classList.remove('modal-aberto');
}

// REALIZA A DEVOLUÇÃO DEDUZINDO O VALOR DIRETAMENTE DO REGISTRO HISTÓRICO SELECIONADO E ATUALIZA O BACKEND
async function salvarDescautela() {
    if (!usuarioLogado || materialDescautelaId === null) return;
    if (!quemDescautelou.value.trim()) {
        mostrarMensagem("Preencha quem descautelou", "erro");
        return;
    }

    const material = materiais.find(m => String(m.id) === String(materialDescautelaId));
    if (!material) return;

    const dataAtual = dataDescautela.value || new Date().toISOString().split("T")[0];
    if (material.cautela && dataAtual < material.cautela.data) {
        mostrarMensagem("Data de descautela não pode ser anterior à data de cautela", "erro");
        return;
    }

    const selectedIdx = document.getElementById("selecionarCautelaAtiva").value;
    if (selectedIdx === "") {
        mostrarMensagem("Selecione qual militar/cautela ativa está devolvendo o material", "erro");
        return;
    }

    const registro = material.historicoCautelas[Number(selectedIdx)];
    if (!registro || registro.dataDescautelado) {
        mostrarMensagem("Registro de cautela inválido ou já devolvido.", "erro");
        return;
    }

    const quantidadeARetornar = Number(campoQuantidadeDescautela.value) || 1;
    if (quantidadeARetornar < 1) {
        mostrarMensagem("A quantidade a devolver deve ser pelo menos 1.", "erro");
        return;
    }

    if (quantidadeARetornar > registro.quantidade) {
        mostrarMensagem(`Não é possível devolver ${quantidadeARetornar}. O limite pendente para esta cautela é de ${registro.quantidade}.`, "erro");
        return;
    }

    // Criando backup de rollback em caso de falha de requisição
    const backupEstado = JSON.parse(JSON.stringify(material));

    if (quantidadeARetornar < registro.quantidade) {
        // Devolução parcial específica do militar
        const originalQty = registro.quantidade;
        registro.quantidade = originalQty - quantidadeARetornar;

        const registroDevolvido = {
            ...registro,
            quantidade: quantidadeARetornar,
            dataDescautelado: dataAtual,
            descauteladoPor: quemDescautelou.value.trim(),
            observacaoDescautelado: obsDescautela.value.trim(),
            quantidadeDescautelada: quantidadeARetornar
        };
        
        material.historicoCautelas.push(registroDevolvido);
        material.quantidadeCautelada = Math.max(0, (material.quantidadeCautelada || 0) - quantidadeARetornar);
    } else {
        // Devolução integral específica do militar
        registro.dataDescautelado = dataAtual;
        registro.descauteladoPor = quemDescautelou.value.trim();
        registro.observacaoDescautelado = obsDescautela.value.trim();
        registro.quantidadeDescautelada = quantidadeARetornar;
        
        material.quantidadeCautelada = Math.max(0, (material.quantidadeCautelada || 0) - quantidadeARetornar);
    }

    // Atribui ao rastreador de cautela principal a próxima mais recente pendente
    const cautelasAtivas = material.historicoCautelas ? material.historicoCautelas.filter(h => !h.dataDescautelado) : [];
    material.cautela = cautelasAtivas.length > 0 ? cautelasAtivas[cautelasAtivas.length - 1] : null;

    if (material.quantidadeCautelada >= material.quantidade) {
        material.situacao = "Cautelado";
    } else {
        material.situacao = "Disponível";
    }

    try {
        await sincronizarMaterialComServidor(material, "PUT");
        salvarDados();
        renderizar();
        fecharDescautelaModal();
        mostrarMensagem(`Devolução de ${quantidadeARetornar} unidade(s) registrada e sincronizada com sucesso`, "sucesso");
    } catch (error) {
        console.error(error);
        // Rollback local em caso de erro na requisição
        const idx = materiais.findIndex(m => String(m.id) === String(materialDescautelaId));
        if (idx !== -1) materiais[idx] = backupEstado;
        mostrarMensagem("Erro ao comunicar com o servidor. A devolução foi cancelada.", "erro");
    }
}

function abrirHistorico(id) {
    if (!usuarioLogado) {
        precisaLogin();
        return;
    }

    const material = materiais.find(m => String(m.id) === String(id));
    if (!material) return;

    tituloHistorico.textContent = `Histórico de cautelas - ${material.nome || "Sem nome"}`;
    const historico = material.historicoCautelas || [];

    if (historico.length === 0) {
        conteudoHistorico.innerHTML = "<p>Nenhuma cautela registrada ainda.</p>";
    } else {
        conteudoHistorico.innerHTML = historico.slice().reverse().map((item, index) => `
            <div class="item-historico">
                <p><strong>${index + 1}. ${item.nomeMilitar}</strong></p>
                <p><strong>Companhia:</strong> ${item.companhia}</p>
                <p><strong>Data:</strong> ${formatarDataBR(item.data)}</p>
                <p><strong>Cautelado por:</strong> ${item.cauteladoPor}</p>
                ${item.observacao ? `<p><strong>Obs.:</strong> ${item.observacao}</p>` : ""}
            </div>
        `).join("");
    }

    modalHistorico.style.display = "flex";
}

function fecharHistoricoModal() {
    modalHistorico.style.display = "none";
}

function abrirDetalhes(id) {
    const material = materiais.find(m => String(m.id) === String(id));
    if (!material) return;

    if (!usuarioLogado) {
        mostrarMensagem("Faça login para acessar detalhes completos", "erro");
        return;
    }

    materialDetalhesId = id;
    tituloDetalhes.textContent = material.nome || "Sem nome";

    const fotoHtml = material.foto
        ? `<div class="detalhes-foto"><img src="${material.foto}" alt="Foto de ${material.nome}"></div>`
        : `<div class="detalhes-foto sem-foto">Sem foto</div>`;

    const manutencaoHtml = material.ultimaManutencao
        ? `<div class="detalhes-manutencao">
            <h3>Última manutenção</h3>
            <p><strong>Data:</strong> ${formatarDataBR(material.ultimaManutencao.data)}</p>
            <p><strong>Quem fez:</strong> ${material.ultimaManutencao.responsavel}</p>
            <p><strong>O que foi feito:</strong> ${material.ultimaManutencao.descricao}</p>
        </div>`
        : `<div class="detalhes-manutencao"><h3>Última manutenção</h3><p>Nenhuma manutenção registrada.</p></div>`;

    const quantidadeDisponivel = getQuantidadeDisponivel(material);

    // Identificação de retenção na tela de detalhes
    let cautelaInfoHtml = "";
    if ((material.quantidadeCautelada || 0) > 0) {
        const activeCompanhias = material.historicoCautelas 
            ? [...new Set(material.historicoCautelas.filter(h => !h.dataDescautelado).map(h => h.companhia))]
            : [];
        if (activeCompanhias.length > 0) {
            cautelaInfoHtml = `<p class="card-cautelado-por">➡️ Cautelado por: <strong>${activeCompanhias.join(", ")}</strong></p>`;
        }
    }

    conteudoDetalhes.innerHTML = `
        <div class="detalhes-grid">
            ${fotoHtml}
            <div>
                <p><strong>Código:</strong> ${material.codigo || "MAT-0000"}</p>
                <p><strong>Nome:</strong> ${material.nome || "Sem nome"}</p>
                <p><strong>Modelo:</strong> ${material.modelo || "-"}</p>
                <p><strong>Categoria:</strong> ${material.categoria || "Sem categoria"}</p>
                <p><strong>Local:</strong> ${material.local || "Não informado"}</p>
                ${cautelaInfoHtml}
                <p><strong>Quantidade total:</strong> ${material.quantidade !== undefined ? material.quantidade : 1}</p>
                <p><strong>Quantidade cautelada:</strong> ${material.quantidadeCautelada || 0}</p>
                <p><strong>Quantidade disponível:</strong> ${quantidadeDisponivel}</p>
                <p><strong>Situação:</strong> ${material.situacao || "Disponível"}</p>
            </div>
        </div>
        <p><strong>Observações:</strong> ${material.observacao || "-"}</p>
        ${manutencaoHtml}
    `;

    if (btnDescautelarDetalhes) {
        btnDescautelarDetalhes.style.display = (material.quantidadeCautelada || 0) > 0 ? "inline-block" : "none";
    }

    modalDetalhes.style.display = "flex";
}

function fecharDetalhesModal() {
    modalDetalhes.style.display = "none";
    materialDetalhesId = null;
}

function abrirManutencao(id) {
    if (!usuarioLogado) {
        precisaLogin();
        return;
    }

    const material = materiais.find(m => String(m.id) === String(id));
    if (!material) return;

    materialManutencaoId = id;
    dataManutencao.value = material.ultimaManutencao?.data || new Date().toISOString().split("T")[0];
    quemFezManutencao.value = material.ultimaManutencao?.responsavel || "";
    descricaoManutencao.value = material.ultimaManutencao?.descricao || "";

  if (tabHistoricoManut && tabNovaManut && conteudoHistoricoManut && conteudoNovaManut) {
    tabHistoricoManut.classList.add("active");
    tabNovaManut.classList.remove("active");
    conteudoHistoricoManut.style.display = "block";
    conteudoNovaManut.style.display = "none";
    renderizarHistoricoManutencao(material);
}

    modalManutencao.style.display = "flex";
}

function fecharManutencaoModal() {
    modalManutencao.style.display = "none";
    materialManutencaoId = null;
    dataManutencao.value = "";
    quemFezManutencao.value = "";
    descricaoManutencao.value = "";
}

async function salvarManutencao() {
    if (!usuarioLogado || !materialManutencaoId) return;
    if (!quemFezManutencao.value.trim() || !descricaoManutencao.value.trim()) {
        mostrarMensagem("Preencha quem fez e o que foi feito", "erro");
        return;
    }

    const material = materiais.find(m => String(m.id) === String(materialManutencaoId));
    if (!material) return;

    const registro = {
        data: dataManutencao.value || new Date().toISOString().split("T")[0],
        responsavel: quemFezManutencao.value.trim(),
        descricao: descricaoManutencao.value.trim()
    };

    // Backup em caso de erro na requisição
    const backupEstado = JSON.parse(JSON.stringify(material));

    material.ultimaManutencao = { ...registro };

    if (!material.historicoManutencoes) material.historicoManutencoes = [];
    material.historicoManutencoes.push({ ...registro });
    if (material.historicoManutencoes.length > 5) {
        material.historicoManutencoes = material.historicoManutencoes.slice(-5);
    }

    try {
        await sincronizarMaterialComServidor(material, "PUT");
        salvarDados();
        renderizar();
        fecharManutencaoModal();
        mostrarMensagem("Manutenção registrada e sincronizada com o servidor", "sucesso");
    } catch (error) {
        console.error(error);
        // Rollback
        const idx = materiais.findIndex(m => String(m.id) === String(materialManutencaoId));
        if (idx !== -1) materiais[idx] = backupEstado;
        mostrarMensagem("Falha ao salvar manutenção no servidor. Operação cancelada.", "erro");
    }
}

function renderizarHistoricoManutencao(material) {
    if (!conteudoHistoricoManut) return;
    const xls = (material && material.historicoManutencoes) ? material.historicoManutencoes : [];

    if (!xls || xls.length === 0) {
        conteudoHistoricoManut.innerHTML = "<p>Nenhuma manutenção registrada ainda.</p>";
        return;
    }

    conteudoHistoricoManut.innerHTML = xls.slice().reverse().map((item, index) => `
        <div class="item-historico">
            <p><strong>${index + 1}. ${formatarDataBR(item.data)}</strong></p>
            <p><strong>Quem fez:</strong> ${item.responsavel}</p>
            <p><strong>O que foi feito:</strong> ${item.descricao}</p>
        </div>
    `).join("");
}

// abas - listeners
if (tabHistoricoManut && tabNovaManut && conteudoHistoricoManut && conteudoNovaManut) {
    tabHistoricoManut.addEventListener("click", () => {
        tabHistoricoManut.classList.add("active");
        tabNovaManut.classList.remove("active"); 
        conteudoHistoricoManut.style.display = "block";
        conteudoNovaManut.style.display = "none";
        const m = materiais.find(x => String(x.id) === String(materialManutencaoId));
        renderizarHistoricoManutencao(m);

        // Oculta salvar na visualização de histórico
        document.getElementById("salvarManutencao").style.display = "none";
        document.getElementById("fecharManutencao").textContent = "Fechar";
    });

    tabNovaManut.addEventListener("click", () => {
        tabNovaManut.classList.add("active");
        tabHistoricoManut.classList.remove("active");
        conteudoHistoricoManut.style.display = "none";
        conteudoNovaCaut.style.display = "block"; // Corrigido escopo de aba

        // Exibe salvar no formulário de preenchimento
        document.getElementById("salvarManutencao").style.display = "";
        document.getElementById("fecharManutencao").textContent = "Cancelar";
    });
}

// Abas e histórico para modalCautela (FATIAMENTO INTELIGENTE: AS 3 ÚLTIMAS CAUTELAS NO TOPO COM EXPANSÃO VER MAIS)
function renderizarHistoricoCautela(material, mostrarTodos = false) {
    if (!conteudoHistoricoCaut) return;
    const historico = (material && material.historicoCautelas) ? material.historicoCautelas : [];

    if (!historico || historico.length === 0) {
        conteudoHistoricoCaut.innerHTML = "<p>Nenhuma cautela registrada ainda.</p>";
        return;
    }

    const listaInvertida = historico.slice().reverse();
    const limite = mostrarTodos ? listaInvertida.length : 3;
    const visiveis = listaInvertida.slice(0, limite);

    let html = visiveis.map((item, index) => `
        <div class="item-historico">
            <p><strong>${index + 1}. ${item.nomeMilitar}</strong></p>
            <p><strong>Companhia:</strong> ${item.companhia}</p>
            <p><strong>Data:</strong> ${formatarDataBR(item.data)}</p>
            <p><strong>Cautelado por:</strong> ${item.cauteladoPor}</p>
            ${item.observacao ? `<p><strong>Obs.:</strong> ${item.observacao}</p>` : ""}
            ${item.dataDescautelado ? `<p><strong>Descautelado dia:</strong> ${formatarDataBR(item.dataDescautelado)}</p>` : ""}
            ${item.descauteladoPor ? `<p><strong>Por:</strong> ${item.descauteladoPor}</p>` : ""}
            ${item.observacaoDescautelado ? `<p><strong>Obs. devolução:</strong> ${item.observacaoDescautelado}</p>` : ""}
        </div>
    `).join("");

    // Se houver mais de 3 registros e não estiver exibindo todos, anexa o botão Ver mais interativo
    if (historico.length > 3 && !mostrarTodos) {
        html += `
            <button type="button" class="btn-ver-mais" onclick="window.expandirHistoricoCautela('${material.id}')" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px dashed #ccc; background: #f8f9fa; cursor: pointer; border-radius: 6px; font-size: 12px; font-weight: bold; color: #555;">
                ➕ Ver mais (${historico.length - 3} cautelas anteriores)
            </button>
        `;
    }

    conteudoHistoricoCaut.innerHTML = html;
}

// EXPANSÃO DINÂMICA EM TEMPO REAL
window.expandirHistoricoCautela = function(id) {
    const material = materiais.find(m => String(m.id) === String(id));
    if (material) {
        renderizarHistoricoCautela(material, true);
    }
};

if (tabHistoricoCaut && tabNovaCaut && conteudoHistoricoCaut && conteudoNovaCaut) {
    tabHistoricoCaut.addEventListener("click", () => {
        tabHistoricoCaut.classList.add("active");
        tabNovaCaut.classList.remove("active");
        conteudoHistoricoCaut.style.display = "block";
        conteudoNovaCaut.style.display = "none";
        
        // Oculta o botão de salvar na aba de apenas visualização
        document.getElementById("salvarCautela").style.display = "none";
        document.getElementById("fecharCautela").textContent = "Fechar";

        const m = materiais.find(x => String(x.id) === String(selectMaterialCautela.value));
        if (m) renderizarHistoricoCautela(m);
        else conteudoHistoricoCaut.innerHTML = "<p>Selecione um material para ver o histórico de cautelas.</p>";
    });

    tabNovaCaut.addEventListener("click", () => {
        tabNovaCaut.classList.add("active");
        tabHistoricoCaut.classList.remove("active");
        conteudoHistoricoCaut.style.display = "none";
        conteudoNovaCaut.style.display = "block";

        // Exibe o botão de salvar na aba de criação
        document.getElementById("salvarCautela").style.display = "";
        document.getElementById("fecharCautela").textContent = "Cancelar";
    });
}

if (selectMaterialCautela) {
    selectMaterialCautela.addEventListener("change", () => {
        const materialId = selectMaterialCautela.value;
        const material = materiais.find(m => String(m.id) === String(materialId));
        
        if (material) {
            campoLocalCautela.value = material.local || "Não informado";
            infoCautela.style.display = "block";
            quantidadeTotalInfo.textContent = material.quantidade !== undefined ? material.quantidade : 1;
            quantidadeCauteladaInfo.textContent = material.quantidadeCautelada || 0;
            const disponivel = getQuantidadeDisponivel(material);
            quantidadeDisponiavelInfo.textContent = disponivel;
            campoQuantidadeCautela.max = disponivel;
            
            if (Number(campoQuantidadeCautela.value) > disponivel) {
                campoQuantidadeCautela.value = disponivel;
            }
        } else {
            infoCautela.style.display = "none";
            campoLocalCautela.value = "";
            campoQuantidadeCautela.max = 9999;
        }
        
        if (tabHistoricoCaut && tabHistoricoCaut.classList.contains("active")) {
            const m = materiais.find(x => String(x.id) === String(materialId));
            if (m) renderizarHistoricoCautela(m);
            else conteudoHistoricoCaut.innerHTML = "<p>Selecione um material para ver o histórico de cautelas.</p>";
        }
    });
}

function abrirFoto(src, id) {
    if (!src) return;
    materialFotoId = id ?? null;
    imagemAmpliada.src = src;
    if (btnEditarFotoModal) {
        btnEditarFotoModal.style.display = usuarioLogado ? 'flex' : 'none';
    }
    modalFoto.style.display = "flex";
}

function fecharFotoModal() {
    modalFoto.style.display = "none";
    imagemAmpliada.src = "";
    materialFotoId = null;
}

// ATUALIZAÇÃO DOS INDICADORES SELECIONADOS NO PAINEL
function atualizarAtivoDashboard() {
    dbCardTotal.classList.remove("ativo");
    dbCardDisponiveis.classList.remove("ativo");
    dbCardCautelados.classList.remove("ativo");
    dbCardManutencao.classList.remove("ativo");
    dbCardInutilizados.classList.remove("ativo");

    if (filtroSituacao === "") {
        dbCardTotal.classList.add("ativo");
    } else if (filtroSituacao === "Disponível") {
        dbCardDisponiveis.classList.add("ativo");
    } else if (filtroSituacao === "Cautelado") {
        dbCardCautelados.classList.add("ativo");
    } else if (filtroSituacao === "Em manutenção") {
        dbCardManutencao.classList.add("ativo");
    } else if (filtroSituacao === "Inutilizado") {
        dbCardInutilizados.classList.add("ativo");
    }
}

// EXECUTA O FILTRO DENTRO DA COLEÇÃO DE CARDS
function aplicarFiltroSituacao(situacao) {
    if (filtroSituacao === situacao) {
        filtroSituacao = ""; // Se clicar no que já está ativo, remove o filtro e mostra todos
    } else {
        filtroSituacao = situacao;
    }
    atualizarAtivoDashboard();
    renderizar();
}

function renderizarDashboard() {
    const resumo = { total: materiais.length, disponiveis: 0, cautelados: 0, manutencao: 0, inutilizados: 0 };

    materiais.forEach(m => {
        const quantidadeDisponivel = getQuantidadeDisponivel(m);
        let situacaoEfetiva = m.situacao || "Disponível";
        if (quantidadeDisponivel === 0 && (situacaoEfetiva === "Disponível" || situacaoEfetiva === "Disponivel")) {
            situacaoEfetiva = "Cautelado";
        }

        const situacaoTexto = String(situacaoEfetiva || "").trim().toLowerCase();

        if (situacaoTexto === "cautelado") {
            resumo.cautelados += 1;
        } else if (situacaoTexto === "em manutenção" || situacaoTexto === "em manutencao") {
            resumo.manutencao += 1;
        } else if (situacaoTexto === "inutilizado") {
            resumo.inutilizados += 1;
        } else {
            resumo.disponiveis += 1;
        }
    });

    totalMateriaisEl.textContent = resumo.total;
    materiaisDisponiveisEl.textContent = resumo.disponiveis;
    materiaisCauteladosEl.textContent = resumo.cautelados;
    materiaisManutencaoEl.textContent = resumo.manutencao;
    materiaisInutilizadosEl.textContent = resumo.inutilizados;
}

function renderizar() {
    const materiaisVisiveis = getMateriaisVisiveis();
    renderizarDashboard();
    atualizarAtivoDashboard();
    lista.innerHTML = "";

    if (materiaisVisiveis.length === 0) {
        lista.innerHTML = `<p class="vazio">Nenhum material encontrado.</p>`;
        contador.innerText = "0";
        return;
    }

    materiaisVisiveis.forEach(m => {
        const quantidadeDisponivel = getQuantidadeDisponivel(m);
        
        // Correção de inconsistência visual em tempo real no card de exibição
        let exibicaoSituacao = m.situacao || "Disponível";
        if (quantidadeDisponivel === 0 && (exibicaoSituacao === "Disponível" || exibicaoSituacao === "Disponivel")) {
            exibicaoSituacao = "Cautelado";
        }
        
        // Identificação dinâmica de retenção por Companhia no cartão físico (Placeholder invisível garante alinhamento estético)
        let cautelaInfoHtml = `<p class="card-cautelado-por invisivel">&nbsp;</p>`;
        if ((m.quantidadeCautelada || 0) > 0) {
            const activeCompanhias = m.historicoCautelas 
                ? [...new Set(m.historicoCautelas.filter(h => !h.dataDescautelado).map(h => h.companhia))]
                : [];
            if (activeCompanhias.length > 0) {
                const compsTexto = activeCompanhias.join(", ");
                cautelaInfoHtml = `<p class="card-cautelado-por" title="Cautelado por: ${compsTexto}">➡️ Cautelado por: ${compsTexto}</p>`;
            }
        }

        const statusClass = corStatus(exibicaoSituacao);
        const estaSelecionado = materiaisSelecionados.has(m.id);
        const quantidadeTotal = m.quantidade !== undefined ? m.quantidade : 1;
        const quantidadeCautelada = m.quantidadeCautelada || 0;
        
        // Validações contra campos vazios ou parciais de bancos legados
        const codigoExibido = m.codigo || "MAT-0000";
        const localExibido = m.local || "Não informado";
        const categoriaExibida = m.categoria || "Sem categoria";

        lista.innerHTML += `
        <div class="card ${statusClass} ${estaSelecionado ? 'selecionado' : ''}" onclick="${usuarioLogado ? `abrirDetalhes('${m.id}')` : `precisaLogin()`}">
            ${usuarioLogado ? `<label class="card-selecao"><input type="checkbox" onclick="event.stopPropagation(); alternarSelecao('${m.id}', this.checked);" ${estaSelecionado ? 'checked' : ''}></label>` : ''}
            <div class="card-topo">
                ${m.foto ? `<button class="foto-material foto-preview" type="button" onclick="event.stopPropagation(); abrirFoto('${m.foto}', '${m.id}')"><img src="${m.foto}" alt="Foto de ${m.nome}"></button>` : `<div class="foto-material sem-foto">Sem foto</div>`}
                <div class="card-info">
                    <h3 title="${m.nome || 'Sem nome'}">${m.nome || "Sem nome"}</h3>
                    <small>${codigoExibido}</small>
                </div>
            </div>
            <div class="card-body">
                <p class="card-local" title="${localExibido}"><strong>Local:</strong> ${localExibido}</p>
                ${cautelaInfoHtml}
                <p class="card-categoria" title="${categoriaExibida}">${categoriaExibida}</p>
                <p class="card-quantidade" style="font-size: 12px; color: #666; margin-top: 5px;"><strong>Estoque:</strong> ${quantidadeTotal} | <strong>Disponível:</strong> ${quantidadeDisponivel} ${quantidadeCautelada > 0 ? `| <strong>Cautelado:</strong> ${quantidadeCautelada}` : ''}</p>
                <span class="status ${statusClass}">${exibicaoSituacao}</span>
            </div>
            ${usuarioLogado ? `<div class="card-actions">
                <div class="card-actions-primary">
                    <button class="btn-action btn-cautela" onclick="event.stopPropagation(); abrirCautela('${m.id}')" ${quantidadeDisponivel <= 0 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>Cautela</button>
                    ${quantidadeCautelada > 0 ? `<button class="btn-action btn-descautela" onclick="event.stopPropagation(); abrirDescautela('${m.id}')">Descautelar</button>` : ""}
                    <button class="btn-action btn-manutencao" onclick="event.stopPropagation(); abrirManutencao('${m.id}')">Manutenção</button>
                </div>
                <div class="card-actions-secondary">
                    <button class="btn-icon btn-editar" onclick="event.stopPropagation(); editar('${m.id}')" title="Editar">Editar</button>
                    <button class="btn-icon btn-excluir" onclick="event.stopPropagation(); excluir('${m.id}')" title="Excluir">Excluir</button>
                </div>
            </div>` : ""}
        </div>`;
    });
    contador.innerText = materiaisVisiveis.length;
}

async function editarFoto(id) {
    if (!usuarioLogado) return;
    materialFotoId = id;
    if (!inputFotoMaterialHidden) return;
    inputFotoMaterialHidden.value = "";
    inputFotoMaterialHidden.click();
}

// SALVA OU EDITA O MATERIAL SINCRONIZANDO COM A API E CACHANDO LOCALMENTE EM CASO DE OFFLINE
async function salvar(manterAberto = false) {
    if (!usuarioLogado) return;
    
    const localValor = localSelect.value === "GERENCIAR_LOCAIS" ? "" : localSelect.value;

    if (!nome.value || !localValor || !quantidade.value) { mostrarMensagem("Preencha campos obrigatórios (nome, local e quantidade)", "erro"); return; }

    const quantidadeValor = Number(quantidade.value);
    if (quantidadeValor < 1) {
        mostrarMensagem("Quantidade deve ser maior que 0", "erro");
        return;
    }

    const categoria = categoriaSelect.value === "GERENCIAR" ? "" : categoriaSelect.value;
    const situacaoValor = situacao.value.trim();
    const situacaoDisponivel = situacaoValor === "Disponível" || situacaoValor === "Disponivel";
    const fotoSelecionada = inputFotoMaterial.files[0];
    const fotoBase64 = await converterFotoParaBase64(fotoSelecionada);
    const deveAbrirCautela = situacaoValor === "Cautelado" || abrirCautelaAoSalvar;
    let materialIdParaCautela = null;

    let materialModificado = null;
    let metodo = "POST";

    if (editandoId !== null) {
        const i = materiais.findIndex(x => String(x.id) === String(editandoId));
        materialModificado = {
            ...materiais[i],
            nome: nome.value,
            modelo: modelo.value,
            categoria,
            local: localValor,
            quantidade: quantidadeValor,
            situacao: situacaoValor,
            observacao: observacao.value,
            foto: fotoBase64 || materiais[i].foto || null
        };
        if (situacaoDisponivel) {
            materialModificado.cautela = null;
            materialModificado.quantidadeCautelada = 0;
        }
        metodo = "PUT";
        materialIdParaCautela = editandoId;
    } else {
        materialModificado = {
            nome: nome.value,
            modelo: modelo.value,
            categoria,
            local: localValor,
            quantidade: quantidadeValor,
            quantidadeCautelada: 0,
            situacao: situacaoValor,
            observacao: observacao.value,
            cautela: null,
            historicoCautelas: [],
            foto: fotoBase64 || null
        };
        metodo = "POST";
        materialIdParaCautela = contadorId;
    }

    try {
        const itemSincronizado = await sincronizarMaterialComServidor(materialModificado, metodo);

        if (editandoId !== null) {
            const i = materiais.findIndex(x => String(x.id) === String(editandoId));
            materiais[i] = itemSincronizado;
        } else {
            materiais.push(itemSincronizado);
            contadorId++;
        }

        salvarDados();
        renderizar();
        mostrarMensagem("Material salvo e sincronizado com o servidor", "sucesso");
    } catch (error) {
        console.warn("Servidor offline. Salvando material no LocalStorage como fallback resiliente:", error);
        
        if (editandoId !== null) {
            const i = materiais.findIndex(x => String(x.id) === String(editandoId));
            materiais[i] = materialModificado;
        } else {
            // Em fallback local sem servidor, o id e código são gerados para integridade do storage
            materialModificado.id = contadorId;
            materialModificado.codigo = gerarCodigo();
            materiais.push(materialModificado);
            contadorId++;
        }
        
        salvarDados();
        renderizar();
        mostrarMensagem("Salvo localmente (Erro ao conectar com o servidor)", "erro");
    }

    if (manterAberto) {
        abrirCautelaAoSalvar = false;
        editandoId = null;
        tituloModalMaterial.textContent = "Novo Material";
        codigo.value = gerarCodigo();
        limpar();
        if (situacaoValor === "Cautelado" && materialIdParaCautela !== null) {
            abrirCautela(materialIdParaCautela, "nova");
        }
        return;
    }

    modalMaterial.style.display = "none";
    limpar();
    editandoId = null;
    abrirCautelaAoSalvar = false;

    if (deveAbrirCautela && materialIdParaCautela !== null) {
        abrirCautela(materialIdParaCautela, "nova");
    }
}

window.editar = function (id) {
    if (!usuarioLogado) return;
    const m = materiais.find(x => String(x.id) === String(id));
    editandoId = id;
    codigo.value = m.codigo || "MAT-0000"; 
    nome.value = m.nome || ""; 
    modelo.value = m.modelo || "";
    quantidade.value = m.quantidade !== undefined ? m.quantidade : 1;
    
    if (m.categoria && !categorias.includes(m.categoria)) {
        categoriaSelect.innerHTML = `<option value="${m.categoria}">${m.categoria}</option>` + categoriaSelect.innerHTML;
    }
    categoriaSelect.value = m.categoria || "";
    
    if (m.local && !listaLocais.includes(m.local)) {
        localSelect.innerHTML = `<option value="${m.local}">${m.local}</option>` + localSelect.innerHTML;
    }
    localSelect.value = m.local || "";
    
    situacao.value = m.situacao || "Disponível"; 
    observacao.value = m.observacao || "";
    tituloModalMaterial.textContent = "Editar Material";
    modalMaterial.style.display = "flex";
};

window.excluir = async function (id) {
    if (!usuarioLogado) return false;
    const material = materiais.find(m => String(m.id) === String(id));
    if (!material) return false;
    const confirmMsg = `Tem certeza que deseja excluir o material "${material.nome}" (${material.codigo})?`;
    if (!confirm(confirmMsg)) return false;

    try {
        await deletarMaterialDoServidor(id);
        materiais = materiais.filter(m => String(m.id) !== String(id));
        salvarDados();
        renderizar();
        mostrarMensagem("Material removido do servidor", "sucesso");
        return true;
    } catch (error) {
        console.warn("Servidor indisponível. Removendo localmente do cache:", error);
        materiais = materiais.filter(m => String(m.id) !== String(id));
        salvarDados();
        renderizar();
        mostrarMensagem("Removido localmente (Erro ao conectar com o servidor)", "erro");
        return true;
    }
};

campoPesquisa.addEventListener("input", (e) => {
    termoPesquisa = e.target.value;
    renderizar();
});

// OUVINTE DE PESQUISA DENTRO DO SELETOR DE CAUTELA
if (campoPesquisaCautela) {
    campoPesquisaCautela.addEventListener("input", (e) => {
        popularSelectCautela(e.target.value);
    });
}

btnNovoMaterial.addEventListener("click", () => { if (precisaLogin()) abrirMaterial(); });
btnCautelarMaterial.addEventListener("click", () => {
    if (!precisaLogin()) return;
    abrirCautela(null, 'nova', materiaisSelecionados.size > 0);
});
if (btnCautelarSelecionados) btnCautelarSelecionados.addEventListener("click", () => {
    if (!precisaLogin()) return;
    abrirCautela(null, 'nova', true);
});
btnFecharCautela.addEventListener("click", fecharCautelaModal);
btnSalvarCautela.addEventListener("click", salvarCautela);
if (btnSalvarDescautela) btnSalvarDescautela.addEventListener("click", salvarDescautela);
if (btnFecharDescautela) btnFecharDescautela.addEventListener("click", fecharDescautelaModal);
btnFecharHistorico.addEventListener("click", fecharHistoricoModal);
btnFecharDetalhes.addEventListener("click", fecharDetalhesModal);
btnEditarDetalhes.addEventListener("click", () => { if (materialDetalhesId !== null) { editar(materialDetalhesId); fecharDetalhesModal(); } });

// Correção do Event Listener de click que causava o erro na inicialização
btnExcluirDetalhes.addEventListener("click", async () => { 
    if (materialDetalhesId !== null) { 
        const removed = await excluir(materialDetalhesId); 
        if (removed) fecharDetalhesModal(); 
    } 
});

btnHistoricoDetalhes.addEventListener("click", () => { if (materialDetalhesId !== null) { abrirCautela(materialDetalhesId); fecharDetalhesModal(); } });
if (btnDescautelarDetalhes) btnDescautelarDetalhes.addEventListener("click", () => { if (materialDetalhesId !== null) { abrirDescautela(materialDetalhesId); fecharDetalhesModal(); } });
btnManutencaoDetalhes.addEventListener("click", () => { if (materialDetalhesId !== null) { abrirManutencao(materialDetalhesId); fecharDetalhesModal(); } });
btnFecharManutencao.addEventListener("click", fecharManutencaoModal);
btnSalvarManutencao.addEventListener("click", salvarManutencao);
btnFecharFoto.addEventListener("click", fecharFotoModal);
if (btnEditarFotoModal) btnEditarFotoModal.addEventListener("click", () => {
    if (materialFotoId !== null) {
        editarFoto(materialFotoId);
    }
});

if (inputFotoMaterialHidden) {
    inputFotoMaterialHidden.addEventListener("change", async () => {
        if (!usuarioLogado || materialFotoId === null) return;
        const arquivo = inputFotoMaterialHidden.files[0];
        if (!arquivo) return;
        const fotoBase64 = await converterFotoParaBase64(arquivo);
        const material = materiais.find(m => String(m.id) === String(materialFotoId));
        if (!material) return;

        const backupFoto = material.foto;
        material.foto = fotoBase64;

        try {
            await sincronizarMaterialComServidor(material, "PUT");
            salvarDados();
            renderizar();
            abrirFoto(fotoBase64, materialFotoId);
            mostrarMensagem("Foto sincronizada no servidor", "sucesso");
        } catch (error) {
            console.error(error);
            material.foto = backupFoto;
            mostrarMensagem("Erro ao sincronizar foto com o servidor.", "erro");
        }
    });
}

// OUVINTES DE LIMITAÇÃO RIGOROSA DE QUANTIDADE EM TEMPO REAL
if (campoQuantidadeCautela) {
    campoQuantidadeCautela.addEventListener("input", () => {
        const maxVal = Number(campoQuantidadeCautela.max);
        if (maxVal && Number(campoQuantidadeCautela.value) > maxVal) {
            mostrarMensagem("Apenas " + maxVal + " unidade(s) disponível(is)!", "erro");
            campoQuantidadeCautela.value = maxVal;
        }
        if (Number(campoQuantidadeCautela.value) < 1) {
            campoQuantidadeCautela.value = 1;
        }
    });
}

// OUVINTES DE LIMITAÇÃO DO SELETOR DE DEVOLUÇÃO AO MUDAR QUEM DEVOLVE
const seletorCautelaAtiva = document.getElementById("selecionarCautelaAtiva");
if (seletorCautelaAtiva) {
    seletorCautelaAtiva.addEventListener("change", () => {
        if (materialDescautelaId === null) return;
        const material = materiais.find(m => String(m.id) === String(materialDescautelaId));
        if (!material) return;
        
        const selectedIdx = seletorCautelaAtiva.value;
        if (selectedIdx !== "") {
            const entry = material.historicoCautelas[Number(selectedIdx)];
            campoQuantidadeDescautela.max = entry.quantidade;
            campoQuantidadeDescautela.value = entry.quantidade;
        } else {
            campoQuantidadeDescautela.max = 0;
            campoQuantidadeDescautela.value = 1;
        }
    });
}

// OUVINTES DE CLIQUE NOS BLOCOS DO PAINEL DE CONTROLE (DASHBOARD)
if (dbCardTotal) dbCardTotal.addEventListener("click", () => aplicarFiltroSituacao(""));
if (dbCardDisponiveis) dbCardDisponiveis.addEventListener("click", () => aplicarFiltroSituacao("Disponível"));
if (dbCardCautelados) dbCardCautelados.addEventListener("click", () => aplicarFiltroSituacao("Cautelado"));
if (dbCardManutencao) dbCardManutencao.addEventListener("click", () => aplicarFiltroSituacao("Em manutenção"));
if (dbCardInutilizados) dbCardInutilizados.addEventListener("click", () => aplicarFiltroSituacao("Inutilizado"));

// BINDINGS DE ESCOPO GLOBAL DO NAVEGADOR (WINDOW)
window.abrirHistorico = abrirHistorico;
window.abrirFoto = abrirFoto;
window.abrirDetalhes = abrirDetalhes;
window.abrirManutencao = abrirManutencao;
window.abrirCautela = abrirCautela;
window.abrirDescautela = abrirDescautela;
window.precisaLogin = precisaLogin;

// INICIALIZAÇÃO ASSÍNCRONA DA APLICAÇÃO
async function inicializarSistema() {
    await carregarDados();
    popularAutocompleteCauteladores();
    carregarEstadoLogin();
    atualizarCategorias();
    atualizarLocais();
    atualizarCompanhias();
    atualizarSituacoes();
    atualizarUI();
    renderizar();
}

inicializarSistema();