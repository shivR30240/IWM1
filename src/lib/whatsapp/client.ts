import axios from 'axios';

interface WhatsAppApiError {
  response?: {
    data?: {
      error?: {
        message?: string;
      };
    };
  };
  message?: string;
}

interface WebhookPayload {
  entry?: Array<{
    changes?: Array<{
      value?: {
        messages?: Array<{
          from: string;
          text?: { body: string };
          image?: { caption: string };
          type: string;
          timestamp: string;
        }>;
      };
    }>;
  }>;
}

const WHATSAPP_API_URL = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION || 'v17.0'}`;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
  console.warn('⚠️  WhatsApp credentials not configured. WhatsApp features will use mock mode.');
}

/**
 * WhatsApp Business API Client
 */
class WhatsAppClient {
  private baseURL: string;
  private token: string | undefined;
  private phoneNumberId: string | undefined;

  constructor() {
    this.baseURL = WHATSAPP_API_URL;
    this.token = WHATSAPP_TOKEN;
    this.phoneNumberId = WHATSAPP_PHONE_NUMBER_ID;
  }

  /**
   * Send a text message
   */
  async sendTextMessage(
    to: string,
    message: string,
    templateName?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    // Mock mode
    if (!this.token || !this.phoneNumberId) {
      console.log('💬 [MOCK WhatsApp] To:', to, '| Message:', message);
      return { success: true, messageId: 'mock_' + Date.now() };
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to,
          type: templateName ? 'template' : 'text',
          ...(templateName
            ? {
                template: {
                  name: templateName,
                  language: { code: 'en' },
                  components: [
                    {
                      type: 'body',
                      parameters: [
                        { type: 'text', text: message }
                      ]
                    }
                  ]
                }
              }
            : {
                text: { body: message }
              })
        },
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        messageId: response.data.messages[0].id
      };
    } catch (error) {
      const err = error as WhatsAppApiError;
      console.error('❌ Failed to send WhatsApp message:', err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.error?.message || err.message
      };
    }
  }

  /**
   * Send an image message
   */
  async sendImageMessage(
    to: string,
    imageUrl: string,
    caption: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.token || !this.phoneNumberId) {
      console.log('💬 [MOCK WhatsApp Image] To:', to, '| URL:', imageUrl);
      return { success: true, messageId: 'mock_' + Date.now() };
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'image',
          image: {
            link: imageUrl,
            caption
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        messageId: response.data.messages[0].id
      };
    } catch (error) {
      const err = error as WhatsAppApiError;
      console.error('❌ Failed to send WhatsApp image:', err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.error?.message || err.message
      };
    }
  }

  /**
   * Send a message with quick reply buttons
   */
  async sendButtonMessage(
    to: string,
    header: string,
    body: string,
    buttons: Array<{ id: string; title: string }>
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.token || !this.phoneNumberId) {
      console.log('💬 [MOCK WhatsApp Buttons] To:', to, '| Body:', body);
      return { success: true, messageId: 'mock_' + Date.now() };
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'interactive',
          interactive: {
            type: 'button',
            header: {
              type: 'text',
              text: header
            },
            body: {
              text: body
            },
            action: {
              buttons: buttons.map((btn, idx) => ({
                type: 'reply',
                reply: {
                  id: btn.id,
                  title: btn.title
                }
              }))
            }
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        messageId: response.data.messages[0].id
      };
    } catch (error) {
      const err = error as WhatsAppApiError;
      console.error('❌ Failed to send WhatsApp buttons:', err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.error?.message || err.message
      };
    }
  }

  /**
   * Send a location message
   */
  async sendLocationMessage(
    to: string,
    latitude: number,
    longitude: number,
    name: string,
    address: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.token || !this.phoneNumberId) {
      console.log('💬 [MOCK WhatsApp Location] To:', to);
      return { success: true, messageId: 'mock_' + Date.now() };
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'location',
          location: {
            latitude,
            longitude,
            name,
            address
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        messageId: response.data.messages[0].id
      };
    } catch (error) {
      const err = error as WhatsAppApiError;
      console.error('❌ Failed to send WhatsApp location:', err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.error?.message || err.message
      };
    }
  }

  /**
   * Verify webhook token
   */
  verifyWebhookToken(
    mode: string,
    token: string,
    challenge: string
  ): string | null {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
    
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('✅ WhatsApp webhook verified');
      return challenge;
    }
    
    console.log('❌ WhatsApp webhook verification failed');
    return null;
  }

  /**
   * Process incoming webhook message
   */
  processWebhookMessage(data: unknown): {
    from: string;
    message: string;
    type: string;
    timestamp: string;
  } | null {
    try {
      const payload = data as WebhookPayload;
      const entry = payload?.entry?.[0];
      const change = entry?.changes?.[0];
      const message = change?.value?.messages?.[0];

      if (!message) return null;

      return {
        from: message.from,
        message: message.text?.body || message.image?.caption || '',
        type: message.type,
        timestamp: message.timestamp
      };
    } catch (error) {
      console.error('❌ Error processing webhook:', error);
      return null;
    }
  }
}

export const whatsAppClient = new WhatsAppClient();
export default whatsAppClient;
