import express from 'express';
import cors from 'cors';
import { initializeAgent } from './chatbot';
import { HumanMessage } from '@langchain/core/messages';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let agent: any;
let config: any;

// Initialize the agent when the server starts
(async () => {
  try {
    console.log("Starting Combined CDP & Twitter Agent in chat mode...");
    const result = await initializeAgent();
    agent = result.agent;
    config = result.config;
    console.log('Agent initialized successfully and ready for chat');
  } catch (error) {
    console.error('Failed to initialize agent:', error);
    process.exit(1);
  }
})();

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Received message:', message);
    const stream = await agent.stream(
      { messages: [new HumanMessage(message)] },
      config
    );

    let response = '';
    for await (const chunk of stream) {
      if ('agent' in chunk) {
        response += chunk.agent.messages[0].content;
      } else if ('tools' in chunk) {
        response += chunk.tools.messages[0].content;
      }
    }

    console.log('Sending response:', response);
    res.json({ response: response.trim() });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 