import { whatsAppClient } from './client';
import { templates } from './templates';

/**
 * Send automated WhatsApp notification
 */
export async function sendWhatsAppNotification(
  to: string,
  type: 'ticket_creation' | 'status_update' | 'resolution' | 'sla_breach' | 'feedback' | 'escalation',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    let message: string;

    switch (type) {
      case 'ticket_creation':
        message = templates.ticketCreation(params);
        break;
      case 'status_update':
        message = templates.statusUpdate(params);
        break;
      case 'resolution':
        message = templates.resolution(params);
        break;
      case 'sla_breach':
        message = templates.slaBreach(params);
        break;
      case 'feedback':
        message = templates.feedbackRequest(params);
        break;
      case 'escalation':
        message = templates.escalation(params);
        break;
      default:
        throw new Error('Unknown notification type');
    }

    return await whatsAppClient.sendTextMessage(to, message);
  } catch (error) {
    console.error('❌ Error sending WhatsApp notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
