import { extractTicketData, parseTicketUpload } from '~~/server/utils/ticket-extraction';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const ticketFile = await parseTicketUpload(event);

  return extractTicketData({
    mimeType: ticketFile.type,
    data: ticketFile.data
  }, config);
});
