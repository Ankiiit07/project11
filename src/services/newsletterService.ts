import { apiConfig } from '../config/api';

export interface NewsletterSubscription {
  email: string;
}

export interface NewsletterResponse {
  status: string;
  message: string;
  data?: {
    subscription: any;
  };
}

class NewsletterService {
  private baseURL = `${apiConfig.baseURL}/newsletter`;

  async subscribe(email: string): Promise<NewsletterResponse> {
    try {
      const response = await fetch(`${this.baseURL}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to subscribe to newsletter');
      }

      return data;
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      throw error;
    }
  }

  async unsubscribe(email: string): Promise<NewsletterResponse> {
    try {
      const response = await fetch(`${this.baseURL}/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to unsubscribe from newsletter');
      }

      return data;
    } catch (error) {
      console.error('Newsletter unsubscription error:', error);
      throw error;
    }
  }

  async getStats(): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get newsletter stats');
      }

      return data;
    } catch (error) {
      console.error('Newsletter stats error:', error);
      throw error;
    }
  }
}

export const newsletterService = new NewsletterService(); 