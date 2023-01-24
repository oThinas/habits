import Fastify from 'fastify';
import cors from '@fastify/cors';

import { dayRoutes, habitRoutes } from './routes';

const app = Fastify({ logger: true });
app.register(cors, { origin: true });

app.register(habitRoutes);
app.register(dayRoutes);

app.listen({ port: 3000 });
