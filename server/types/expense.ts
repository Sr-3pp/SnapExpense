import type { ObjectId } from 'mongodb';

import type { TicketExtraction } from '~~/shared/types/ticket';

export type ExpenseDocument = TicketExtraction & {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
