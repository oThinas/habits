import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import dayjs from 'dayjs';
import { z } from 'zod';

import { prisma } from './lib/prisma';

type HabitRequest = FastifyRequest<{ Body: { title: string, weekDays: number[] } }>;

/**
 * Recebe todos os hábitos da base de dados e os retorna.
 * @param {FastifyInstance} app - FastifyInstance - A instância do Fastify.
 */
function getAll(app: FastifyInstance): void {
  app.get('/habits', async (_request, response) => {
    const habits = await prisma.habit.findMany();
    if (habits.length === 0) return response.status(404).send({ errorMessage: 'Não foram encontrados hábitos.' });

    return response.send(habits);
  });
}

/**
 * Recebe todos os hábitos possíveis de serem completados num determinado dia, e devolve-os juntamente com os hábitos que já tinham sido completados nesse dia
 * @param {FastifyInstance} app - A instância do Fastify.
 */
function getByDay(app: FastifyInstance): void {
  app.get('/day', async (request, response) => {
    const getDaySchema = z.object({ date: z.coerce.date({ invalid_type_error: 'Data precisa ser uma string no formato yyyy-mm-ddThh:mm:ss.000z.' }) });
    const { date } = getDaySchema.parse(request.query);
    const parsedDate = dayjs(date).startOf('day');

    const possibleHabits = await prisma.habit.findMany({
      where: {
        createdAt: { lte: date },
        weekDays: { some: { weekDay: parsedDate.get('day') } },
      },
    });

    const day = await prisma.day.findUnique({
      where: { date: parsedDate.toDate() },
      include: { dayHabits: true },
    });
    const completedHabits = day?.dayHabits.map((dayHabit) => dayHabit.habitId);

    if (possibleHabits.length === 0) return response.status(404).send({ errorMessage: 'Não foram encontrados hábitos para esse dia.' });

    return response.send({ possibleHabits, completedHabits });
  });
}

/**
 * Cria um hábito com um título e uma lista de dias da semana.
 * @param {FastifyInstance} app - A instância do Fastify.
 */
function post(app: FastifyInstance): void {
  app.post('/habits', async (request: HabitRequest, response) => {
    const { isPostValid } = await validatePost(request, response);
    if (!isPostValid) return;

    const { title, weekDays } = request.body;
    const today = dayjs()
      .startOf('day')
      .toDate();

    const habit = await prisma.habit.create({
      data: {
        title,
        createdAt: today,
        weekDays: { create: weekDays.map((day: number) => ({ weekDay: day })) },
      },
    });

    return response.status(201).send(habit);
  });
}

/**
 * Valida o corpo da requisição POST do endpoint /habits
 * @param {HabitRequest} request - HabitRequest - A requisição.
 * @param {FastifyReply} response - FastifyReply - A resposta.
 * @returns Um objeto com duas propriedades - error e isPostValid - ou { isPostValid: true }.
 */
async function validatePost(
  request: HabitRequest,
  response: FastifyReply,
): Promise<{ error?: FastifyReply, isPostValid: boolean }> {
  if (Object.keys(request.body).length !== ['title', 'weekDays'].length) {
    return {
      error: response.status(400).send({ errorMessage: 'Favor, informar "title" e "weekDays".' }),
      isPostValid: false,
    };
  }

  const createHabitSchema = z.object({
    title: z.string({ invalid_type_error: 'Título precisa ser uma string.' }).trim()
      .min(3, { message: 'Título deve ter no mínimo 3 caracteres.' })
      .max(30, { message: 'Título deve ter no máximo 30 caracteres.' }),
    weekDays: z.array(z.number()
      .min(0)
      .max(6), { invalid_type_error: 'Dias da semana precisa ser um array de números.' }),
  });

  try {
    createHabitSchema.parse(request.body);
  } catch (error: any) {
    const errorsMessage = error.issues.map((issue: { path: string[], message: string }) => ({
      field: issue.path[0],
      message: issue.message,
    }));

    return {
      error: response.status(400).send(errorsMessage),
      isPostValid: false,
    };
  }

  return { isPostValid: true };
}

export async function habitRoutes(app: FastifyInstance): Promise<void> {
  getAll(app);
  getByDay(app);
  post(app);
}
