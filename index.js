import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import { Sequelize, DataTypes } from "sequelize";

const app = express();
const port = 8080;

app.use(cors());

// Cria uma instância do Sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './data.sqlite'
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

// Rotas

// Lista todas as medidas
app.get('/medidas', async (req, res) => {
    try {
        const medidas = await Medidas.findAll();
        res.status(200).json({
            message: "Operação realizada com sucesso.",
            data: medidas
        });
    } catch (error) {
        res.status(500).json({ message: "Houve um erro ao realizar a ação"})
    }
});

// Lista uma medida
app.get('/medida/:id', async (req, res) => {
    try {
        const medida = await Medidas.findByPk(req.params.id);
        res.status(200).json({
            message: "Operação realizada com sucesso.",
            data: medida
        });
    } catch (error) {
        res.status(404).json({ message: "Medida não encontrada." });
    }
});

// Cria uma medida
app.post('/medidas', async (req, res) => {
    try {
        const medida = await Medidas.create(req.body);
        res.status(201).json({
            message: "Medida criada com sucesso.",
            data: medida
        });
    } catch (error) {
        res.status(400).json({ message: "Já existe uma medida com essa data." });
    }
});

// Atualiza uma medida
app.put('/medida/:id', async (req, res) => {
    try {
        const medida = await Medidas.findByPk(req.params.id);
        await medida.update(req.body);
        res.status(200).json({
            message: "Medida atualizada com sucesso.",
            data: medida
        });
    } catch (error) {
        res.status(404).json({ message: "Medida não encontrada." });
    }
});

// Deleta uma medida
app.delete('/medida/:id', async (req, res) => {
    try {
        const medida = await Medidas.findByPk(req.params.id);
        await medida.destroy();
        res.status(200).json({
            message: "Medida deletada com sucesso.",
            data: medida
        });
    } catch (error) {
        res.status(404).json({ message: "Medida não encontrada." });
    }
});
    
// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor iniciado em 'http://127.0.0.1:${port}'`);
});
