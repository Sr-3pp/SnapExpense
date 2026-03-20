import type { TicketExtraction } from '~~/types/ticket';

export const useTicketExtraction = () => {
  const extractData = async (ticket: File) => {
    const formData = new FormData();
    formData.append('ticket', ticket);

    return $fetch<TicketExtraction>('/api/extract', {
      method: 'POST',
      body: formData
    });
  };

  return {
    extractData
  };
};
