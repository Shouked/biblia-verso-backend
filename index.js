import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/verso', async (req, res) => {
  console.log('📩 Requisição recebida para /verso'); // ← aqui é o log que mostra se a função foi chamada

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct:free', // ✅ modelo gratuito correto
        messages: [
          {
            role: 'user',
            content: 'Me diga um versículo bíblico curto, impactante e inspirador em português.',
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://biblia-app.com',
          'X-Title': 'BibliaApp',
        },
      }
    );

    const texto = response.data.choices[0].message.content;
    res.json({ verso: texto });
  } catch (error) {
    console.error('Erro ao gerar verso:', error.response?.data || error.message);
    res.status(500).json({ erro: 'Erro ao gerar verso' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});