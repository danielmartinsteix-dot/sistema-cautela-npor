const express = require("express");
const cors = require("cors");
const db = require("./firebase");

const app = express();

app.use(cors());
app.use(express.json());

// Função auxiliar para remover propriedades indefinidas e evitar erros no Firestore
function higienizarDados(dados) {
    const limpo = {};
    for (const chave in dados) {
        if (dados[chave] !== undefined) {
            limpo[chave] = dados[chave];
        }
    }
    return limpo;
}

/*
  🔵 BUSCAR TODOS OS MATERIAIS
*/
app.get("/materiais", async (req, res) => {
    try {
        const snapshot = await db.collection("materiais").get();
        const materiais = [];

        snapshot.forEach(doc => {
            materiais.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.json(materiais);
    } catch (error) {
        console.error("Erro ao buscar materiais:", error);
        res.status(500).json({ erro: "Erro ao buscar materiais" });
    }
});

/*
  🟢 CADASTRAR MATERIAL
*/
app.post("/materiais", async (req, res) => {
    try {
        const dadosMaterial = req.body;
        
        // Remove o ID temporário do cliente para adotar o ID definitivo gerado pelo Firestore
        delete dadosMaterial.id;

        // Adiciona registro de data de criação
        dadosMaterial.criadoEm = new Date();

        const docRef = await db.collection("materiais").add(higienizarDados(dadosMaterial));

        // Retorna o material completo com o ID gerado pelo Firestore
        res.json({
            id: docRef.id,
            ...dadosMaterial,
            mensagem: "Material criado com sucesso"
        });
    } catch (error) {
        console.error("Erro ao criar material:", error);
        res.status(500).json({ erro: "Erro ao criar material" });
    }
});

/*
  🟡 ATUALIZAR MATERIAL (PUT)
  Necessário para salvar alterações, registrar cautelas, devoluções e manutenções
*/
app.put("/materiais/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const dadosMaterial = req.body;

        // Remove o ID do corpo para evitar gravação redundante dentro do documento
        delete dadosMaterial.id;

        await db.collection("materiais").doc(id).set(higienizarDados(dadosMaterial), { merge: true });

        res.json({
            id,
            ...dadosMaterial,
            mensagem: "Material updated com sucesso"
        });
    } catch (error) {
        console.error("Erro ao atualizar material:", error);
        res.status(500).json({ erro: "Erro ao atualizar material" });
    }
});

/*
  🔴 EXCLUIR MATERIAL (DELETE)
*/
app.delete("/materiais/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await db.collection("materiais").doc(id).delete();

        res.json({
            id,
            mensagem: "Material removido com sucesso"
        });
    } catch (error) {
        console.error("Erro ao excluir material:", error);
        res.status(500).json({ erro: "Erro ao excluir material" });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:3000`);
});