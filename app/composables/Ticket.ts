import type { TicketExtraction } from '~~/shared/types/ticket';

export const useTicket = () => {
  const extractData = async (ticket: File) => {
    const formData = new FormData();
    formData.append('ticket', ticket);

    const response = await $fetch<TicketExtraction>('/api/extract', {
      method: 'POST',
      body: formData
    });

    return response;
  };

  return {
    extractData
  };
};
