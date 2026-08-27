import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const SERVICES = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
  contact: process.env.CONTACT_SERVICE_URL || 'http://localhost:5002',
  newsletter: process.env.NEWSLETTER_SERVICE_URL || 'http://localhost:5003',
  content: process.env.CONTENT_SERVICE_URL || 'http://localhost:5004'
};

const forwardRequest = (serviceUrl) => async (req, res) => {
  const url = `${serviceUrl}${req.originalUrl}`;
  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers['authorization'] || ''
      },
      body: req.method !== 'GET' && req.method !== 'DELETE' ? JSON.stringify(req.body) : undefined
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ message: `Gateway error: Unable to reach microservice at ${serviceUrl}`, error: err.message });
  }
};

app.use('/api/auth', forwardRequest(SERVICES.auth));
app.use('/api/contacts', forwardRequest(SERVICES.contact));
app.use('/api/newsletters', forwardRequest(SERVICES.newsletter));
app.use('/api/services', forwardRequest(SERVICES.content));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Gateway is running' });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
export default app;
