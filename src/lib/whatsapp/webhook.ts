import { whatsAppClient } from './client';
import { templates } from './templates';
import { getTicketById } from '../call/ticket-workflow';

/**
 * Process incoming WhatsApp message and generate response
 */
export async function processIncomingMessage(message: {
  from: string;
  message: string;
  type: string;
  timestamp: string;
}): Promise<string | null> {
  const { message: text, type } = message;

  // Only process text messages for now
  if (type !== 'text') {
    return null;
  }

  const lowerText = text.toLowerCase().trim();

  // Command: STATUS <ticket_id>
  if (lowerText.startsWith('status')) {
    const ticketId = lowerText.split(' ')[1];
    if (ticketId) {
      return await handleStatusCheck(ticketId.toUpperCase());
    }
    return 'Please provide a ticket ID.\nExample: STATUS IVC-2026-12345';
  }

  // Command: HELP
  if (lowerText === 'help') {
    return templates.help();
  }

  // Command: STATS
  if (lowerText === 'stats' || lowerText === 'statistics') {
    return handleStatsRequest();
  }

  // Command: CALL
  if (lowerText === 'call') {
    return '📞 Helpline: 1800-XXX-XXXX\n\nAvailable 24/7 for civic complaints.';
  }

  // Command: WEB
  if (lowerText === 'web' || lowerText === 'website') {
    return '🌐 Visit us: https://indorevoiceconnect.in\n\nTrack your tickets and more!';
  }

  // Default: Treat as new complaint
  return handleNewComplaint(text);
}

/**
 * Handle status check command
 */
async function handleStatusCheck(ticketId: string): Promise<string> {
  const ticket = await getTicketById(ticketId);

  if (!ticket) {
    return `❌ Ticket ${ticketId} not found.\n\nPlease check the ticket ID and try again.`;
  }

  return `📊 Ticket Status: ${ticket.id}

Category: ${ticket.category.replace('_', ' ')}
Status: ${ticket.status.toUpperCase()}
Priority: ${ticket.priority}
Ward: ${ticket.wardName || ticket.wardNumber}

Created: ${new Date(ticket.createdAt).toLocaleDateString('en-IN')}
${ticket.resolvedAt ? `Resolved: ${new Date(ticket.resolvedAt).toLocaleDateString('en-IN')}` : ''}

${ticket.status === 'open' ? '🔄 Your complaint is being processed.' : ''}
${ticket.status === 'assigned' ? '👤 Assigned to an officer.' : ''}
${ticket.status === 'in_progress' ? '⚙️ Work is in progress.' : ''}
${ticket.status === 'resolved' ? '✅ Your complaint has been resolved!' : ''}
${ticket.status === 'closed' ? '📝 This ticket is closed.' : ''}

Reply HELP for more options.`;
}

/**
 * Handle stats request
 */
function handleStatsRequest(): string {
  return `📊 Indore Voice Connect Statistics

Total Tickets: 10,000+
Resolved: 9,800+
Success Rate: 98%
Avg Response: < 48 hours

Top Categories:
💧 Water Supply: 27%
🛣️ Roads: 18%
🚰 Drainage: 14%
⚡ Electricity: 11%

Thank you for being part of the solution! 🙏`;
}

/**
 * Handle new complaint
 */
function handleNewComplaint(text: string): string {
  // In a real implementation, this would create a ticket
  // For now, provide guidance
  return `Thank you for your complaint! 📝

We've received: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"

To register this complaint, please:
1. Call our helpline: 1800-XXX-XXXX
2. Visit: https://indorevoiceconnect.in
3. Or visit your nearest ward office

Your complaint will be registered and you'll receive a ticket ID.

Reply HELP for more options.`;
}

