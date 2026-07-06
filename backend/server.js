const express = require("express");
const cors = require("cors");
const db = require("./firebase");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

function higienizarDados(dados) {
    const limpo = {};
    for (const chave in dados) {
        if (dados[chave] !== undefined) {
            limpo[chave] = dados[chave];
        }
    }
    return limpo;
}

async function gerarProximoCodigo() {
    const snapshot = await db.collection("materiais").get();

    let maiorNumero = 0;

    snapshot.forEach(doc => {
        const dados = doc.data();
        const codigo = dados.codigo || "";

        const match = codigo.match(/MAT-(\d+)/);

        if (match) {
            const numero = Number(match[1]);
            if (numero > maiorNumero) {
                maiorNumero = numero;
            }
        }
    });

    const proximoNumero = maiorNumero + 1;
    return `MAT-${String(proximoNumero).padStart(4, "0")}`;
}

app.get("/", (req, res) => {
    res.send("API do Sistema de Cautela NPOR funcionando!");
});

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

app.post("/materiais", async (req, res) => {
    try {
        const dadosMaterial = req.body;

        delete dadosMaterial.id;

        dadosMaterial.codigo = await gerarProximoCodigo();
        dadosMaterial.criadoEm = new Date();

        if (dadosMaterial.quantidadeCautelada === undefined) {
            dadosMaterial.quantidadeCautelada = 0;
        }

        if (!dadosMaterial.situacao) {
            dadosMaterial.situacao = "Disponível";
        }

        if (!dadosMaterial.historicoCautelas) {
            dadosMaterial.historicoCautelas = [];
        }

        if (dadosMaterial.cautela === undefined) {
            dadosMaterial.cautela = null;
        }

        const docRef = await db.collection("materiais").add(higienizarDados(dadosMaterial));

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

app.put("/materiais/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const dadosMaterial = req.body;

        delete dadosMaterial.id;

        await db.collection("materiais").doc(id).set(higienizarDados(dadosMaterial), { merge: true });

        res.json({
            id,
            ...dadosMaterial,
            mensagem: "Material atualizado com sucesso"
        });
    } catch (error) {
        console.error("Erro ao atualizar material:", error);
        res.status(500).json({ erro: "Erro ao atualizar material" });
    }
});

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});