import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import dayjs from 'dayjs';
import { z, ZodSchema } from 'zod';

import { prisma } from './lib/prisma';

type HabitRequest = FastifyRequest<{ Body: { title: string, weekDays: number[] } }>;

/**
 * Recebe todos os hábitos da base de dados e os retorna.
 * @param {FastifyInstance} app - A instância do Fastify.
 */
function getAll(app: FastifyInstance): void {
  app.get('/habits', async (_request, response) => {
    const habits = await prisma.habit.findMany();
    if (habits.length === 0) return response.status(404).send({ errorMessage: 'Não foram encontrados hábitos.' });

    return response.send(habits);
  });
}

/**
 * Recebe um hábito pelo seu ID e o retorna.
 * @param {FastifyInstance} app - A instância do Fastify.
 */
function getById(app: FastifyInstance): void {
  app.get('/habits/:habitId', async (request, response) => {
    const habitIdSchema = z.object({
      habitId: z.string({ invalid_type_error: 'O ID do hábito precisa ser uma string.' })
        .uuid({ message: 'O ID do hábito precisa estar no formato de UUID' }),
    });
    const { habitId } = habitIdSchema.parse(request.params);

    const habit = await prisma.habit.findUnique({ where: { id: habitId } });
    if (!habit) return response.status(404).send({ errorMessage: 'Não foi encontrado hábito com esse ID.' });

    return response.send(habit);
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
 * Recebe um ID de hábito, verifica se ele é valido, verifica se o hábito existe, verifica se o hábito já foi completado. Se sim, o "descompleta", se não, o completa.
 * @param {FastifyInstance} app - A instância do Fastify.
 */
function toggleHabit(app: FastifyInstance): void {
  app.patch('/habits/:habitId/toggle', async (request, response) => {
    if (!(request.params as { habitId: string }).habitId) return response.status(400).send({ errorMessage: 'O ID do hábito não foi informado.' });

    const toggleHabitParamsSchema = z.object({
      habitId: z.string({ invalid_type_error: 'O ID do hábito precisa ser uma string.' })
        .uuid({ message: 'O ID do hábito precisa estar no formato de UUID' }),
    });

    const { isHabitIdValid } = schemaParser(request, 'params', response, toggleHabitParamsSchema, 'isHabitIdValid');
    if (!isHabitIdValid) return;

    const { habitId } = (request.params as { habitId: string });

    const today = dayjs().startOf('day')
      .toDate();

    let day = await prisma.day.findUnique({ where: { date: today } });
    if (!day) day = await prisma.day.create({ data: { date: today } });
    const dayId = day.id;

    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        // eslint-disable-next-line camelcase
        dayId_habitId: {
          dayId,
          habitId,
        },
      },
    });

    const habit = await prisma.habit.findUnique({ where: { id: habitId } });

    if (!habit) return response.status(404).send({ errorMessage: 'Não foi encontrado hábito com esse ID.' });
    else if (dayHabit) {
      const dayHabitId = await prisma.dayHabit.delete({ where: { id: dayHabit.id } });
      return response.send({ dayHabitId, completed: false });
    }

    const dayHabitId = await prisma.dayHabit.create({
      data: {
        dayId,
        habitId,
      },
    });

    return response.send({ dayHabitId, completed: true });
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

  schemaParser(request, 'body', response, createHabitSchema, 'isPostValid');

  return { isPostValid: true };
}

/**
 * It receives a request, a response, a schema and a property name, and returns an object with the
 * property name and a boolean value
 * Recebe uma requesição, uma resposta, um schema e um nome de propriedade. Retorna um objeto com erros e uma false ou um objeto com true.
 * @param {FastifyRequest} request - A requisição.
 * @param {'body' | 'params' | 'query'} requestExtractor - 'body' | 'params' | 'query'. A propriedade da requisição que será extraída.
 * @param {FastifyReply} response - A resposta.
 * @param schema - ZodSchema<any> - O schema Zod para a validação.
 * @param {string} propertyName - O nome da propriedade para ser retornada ao objeto.
 * @returns Um objeto com duas propriedades - error e propertyName - ou { propertyName: true }.
 */
function schemaParser(
  request: FastifyRequest,
  requestExtractor: 'body' | 'params' | 'query',
  response: FastifyReply,
  schema: ZodSchema<any>,
  propertyName: string,
) {
  try {
    schema.parse(request[requestExtractor]);

    return { [propertyName]: true };
  } catch (error: any) {
    const errorsMessage = error.issues.map((issue: { path: string[], message: string }) => ({
      field: issue.path[0],
      message: issue.message,
    }));

    if (Object.keys(errorsMessage).length === 1) {
      return {
        error: response.status(400).send([{
          filed: 'request params',
          message: 'Parâmetros da requisição são obrigatórios.',
        }]),
        [propertyName]: false,
      };
    }
    return {
      error: response.status(400).send(errorsMessage),
      [propertyName]: false,
    };
  }
}

export async function habitRoutes(app: FastifyInstance): Promise<void> {
  getAll(app);
  getById(app);
  getByDay(app);
  post(app);
  toggleHabit(app);
}
