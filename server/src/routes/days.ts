import { FastifyInstance } from 'fastify';

import { prisma } from '../lib/prisma';

function get(app: FastifyInstance): void {
  app.get('/summary', async (_request, response) => {
    const summary = await prisma.$queryRaw`
      SELECT
        id,
        date,
        (
          SELECT
            CAST(COUNT(*) as FLOAT)
          FROM habitWeekDays
          JOIN
            habits
          ON habits.id = habitWeekDays.habitId
          WHERE
            habitWeekDays.weekDay = CAST(STRFTIME('%w', days.date / 1000, 'unixepoch') as INTEGER)
            AND habits.createdAt <= days.date
        ) as possibleHabits,
        (
          SELECT
            CAST(COUNT(*) as FLOAT)
          FROM dayHabits
          WHERE dayHabits.dayId = days.id
        ) as completedHabits
      FROM days
    `;

    return response.send(summary);
  });
}

export async function dayRoutes(app: FastifyInstance): Promise<void> {
  get(app);
}
