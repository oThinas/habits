import Fastify from 'fastify';
import cors from '@fastify/cors';
import { habitRoutes } from './routes';

const app = Fastify({ logger: true });
app.register(cors, { origin: 'http:localhost/3000' });
app.register(habitRoutes);

app.listen({ port: 3000 });
