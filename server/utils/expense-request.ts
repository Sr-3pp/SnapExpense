import type { H3Event } from 'h3';

import type { TicketExtraction } from '~~/shared/types/ticket';

import { ticketExtractionSchema } from '~~/server/utils/expense-schema';

export const requireExpenseId = (event: H3Event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing expense id.'
    });
  }

  return id;
};

export const readValidatedExpense = async (event: H3Event): Promise<TicketExtraction> => {
  const body = await readBody(event);

  return ticketExtractionSchema.parse(body);
};
