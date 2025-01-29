const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require('cors');
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const port = 8080;

// Cria uma instância do Sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './data.sqlite',
    define: {
        timestamps: false
    }
});

// Define o modelo Medidas
const Medidas = sequelize.define('medida', {
    date: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    sis: { type: DataTypes.INTEGER, allowNull: false },
    dia: { type: DataTypes.INTEGER, allowNull: false },
    freq: { type: DataTypes.INTEGER, allowNull: false }
});

// Sincroniza com o Banco de dados
sequelize.sync();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Rotas

// Tela inicial
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/main0.html'));
});

// Lista todas as medidas
app.get('/medidas', async (req, res) => {
    try {
        const medidas = await Medidas.findAll();
        if (medidas.length > 0) {
            res.status(200).json({
                message: "Operação realizada com sucesso.",
                data: medidas
            });
        } else {
            res.status(404).json({ message: "Não foram encontradas medidas salvas." });
        }
    } catch (error) {
        console.log(`Houve um erro ao realizar a ação.\n${error.message}`);
    }
});

// Lista uma medida
app.get('/medida/:id', async (req, res) => {
    try {
        const medida = await Medidas.findByPk(req.params.id);
        if (medida) {
            res.status(200).json({
                message: "Operação realizada com sucesso.",
                data: medida
            });
        } else {
            res.status(404).json({ message: "Medida não encontrada." });
        }
    } catch (error) {
        console.log(`Houve um erro ao realizar a ação.\n${error.message}`);
    }
});

// Cria uma medida
app.post('/medidas', async (req, res) => {
    try {
        const medida = await Medidas.create(req.body);
        if (medida) {
            res.status(201).json({
                message: "Medida criada com sucesso.",
                data: medida
            });
            res.status(400).json({ message: "Já existe uma medida com essa data.", result: true });
        } else {
            res.status(404).json({ message: "Medida não criada.", result: false });
        }
    } catch (error) {
        console.log(`Houve um erro ao realizar a ação.\n${error.message}`);
    }
});

// Atualiza uma medida
app.put('/medida/:id', async (req, res) => {
    try {
        const medida = await Medidas.findByPk(req.params.id);
        if (medida) {
            await medida.update(req.body);
            res.status(200).json({
                message: "Medida atualizada com sucesso.",
                data: medida
            });
        } else {
            res.status(404).json({ message: "Medida não encontrada." });
        }
    } catch (error) {
        console.log(`Houve um erro ao realizar a ação.\n${error.message}`);
    }
});

// Deleta uma medida
app.delete('/medida/:id', async (req, res) => {
    try {
        const medida = await Medidas.findByPk(req.params.id);
        if (medida) {
            await medida.destroy();
            res.status(200).json({
                message: "Medida deletada com sucesso.",
                data: medida
            });
        } else {
            res.status(404).json({ message: "Medida não encontrada." });
        }
    } catch (error) {
        console.log(`Houve um erro ao realizar a ação.\n${error.message}`);
    }
});
    
// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}'`);
});
