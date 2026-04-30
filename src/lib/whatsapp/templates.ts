/**
 * WhatsApp Message Templates
 * Pre-defined templates for automated notifications
 */

export interface TemplateParams {
  [key: string]: string | number;
}

/**
 * Ticket Creation Confirmation
 */
export function ticketCreationTemplate(params: {
  name: string;
  ticket_id: string;
  category: string;
  tracking_url: string;
}): string {
  return `Dear ${params.name}, your complaint has been registered! 🎫

Ticket ID: ${params.ticket_id}
Category: ${params.category.replace('_', ' ')}
Status: Open

Track your ticket: ${params.tracking_url}

Thank you for helping improve Indore! 🙏

Reply:
• STATUS ${params.ticket_id} - Check status
• HELP - Get help`;
}

/**
 * Status Update Notification
 */
export function statusUpdateTemplate(params: {
  ticket_id: string;
  old_status: string;
  new_status: string;
  officer_name: string;
  sla_date: string;
}): string {
  return `📢 Update on your complaint ${params.ticket_id}

Status changed: ${params.old_status} → ${params.new_status}
Assigned to: ${params.officer_name}
Expected resolution: ${params.sla_date}

We're working on your complaint.

Reply STATUS ${params.ticket_id} for more details.`;
}

/**
 * Resolution Confirmation
 */
export function resolutionTemplate(params: {
  ticket_id: string;
  officer_name: string;
  hours: number;
}): string {
  return `✅ Your complaint has been resolved!

Ticket: ${params.ticket_id}
Resolved by: ${params.officer_name}
Resolution time: ${params.hours} hours

Please rate your experience (1-5):
Reply with a number.

1 - Very Poor
2 - Poor
3 - Average
4 - Good
5 - Excellent

Thank you for your feedback! 🙏`;
}

/**
 * SLA Breach Warning
 */
export function slaBreachTemplate(params: {
  ticket_id: string;
  category: string;
  sla_hours: number;
  delay_hours: number;
}): string {
  return `⚠️ Alert: Your complaint ${params.ticket_id} is delayed

Category: ${params.category.replace('_', ' ')}
Original SLA: ${params.sla_hours} hours
Current delay: ${params.delay_hours} hours

We're working to resolve this urgently.

Our team has been notified and is prioritizing your complaint.

Reply HELP if you need assistance.`;
}

/**
 * Feedback Request
 */
export function feedbackRequestTemplate(params: {
  ticket_id: string;
  category: string;
}): string {
  return `📝 We value your feedback!

Ticket: ${params.ticket_id}
Category: ${params.category.replace('_', ' ')}
Status: Resolved

Please rate your experience (1-5):

1 - Very Poor 😞
2 - Poor 😕
3 - Average 😐
4 - Good 😊
5 - Excellent 😄

Reply with a number.

Your feedback helps us improve Indore! 🙏`;
}

/**
 * Escalation Alert
 */
export function escalationTemplate(params: {
  ticket_id: string;
  category: string;
  reason: string;
}): string {
  return `🔴 Escalation Notice

Ticket: ${params.ticket_id}
Category: ${params.category.replace('_', ' ')}
Reason: ${params.reason}

Your complaint has been escalated to senior officers for immediate attention.

Expected response time: 24 hours

We apologize for the delay and are working to resolve this urgently.`;
}

/**
 * Welcome Message (for new WhatsApp contacts)
 */
export function welcomeTemplate(params: {
  name: string;
}): string {
  return `Welcome to Indore Voice Connect! 🎉

Dear ${params.name}, you're now connected to our WhatsApp service.

How can we help you?

📝 *Register a complaint*: Send your complaint details
🔍 *Check status*: Reply STATUS <ticket_id>
📞 *Get help*: Reply HELP
📊 *View statistics*: Reply STATS

Your voice matters! Let's make Indore better together. 🙏`;
}

/**
 * Auto-Reply for Unknown Commands
 */
export function unknownCommandTemplate(): string {
  return `I'm sorry, I didn't understand that command. 🤔

Here's what you can do:

📝 *New complaint*: Just type your complaint
🔍 *Check status*: STATUS <ticket_id>
📞 *Get help*: HELP
📊 *Statistics*: STATS

Example: STATUS IVC-2026-12345

Feel free to describe your issue in Hindi, English, or Malwi! 🙏`;
}

/**
 * Help Message
 */
export function helpTemplate(): string {
  return `📞 Indore Voice Connect - Help

*Available Commands:*

📝 NEW - Register a new complaint
🔍 STATUS <id> - Check ticket status
📊 STATS - View statistics
📞 CALL - Get our helpline number
🌐 WEB - Visit our website
❓ HELP - Show this help

*Examples:*
• STATUS IVC-2026-12345
• Water supply issue in ward 15
• Road damaged near Rajwada

*Helpline*: 1800-XXX-XXXX
*Website*: https://indorevoiceconnect.in

We're here to help! 🙏`;
}

/**
 * All templates export
 */
export const templates = {
  ticketCreation: ticketCreationTemplate,
  statusUpdate: statusUpdateTemplate,
  resolution: resolutionTemplate,
  slaBreach: slaBreachTemplate,
  feedbackRequest: feedbackRequestTemplate,
  escalation: escalationTemplate,
  welcome: welcomeTemplate,
  unknownCommand: unknownCommandTemplate,
  help: helpTemplate
};
