import { IncomeSource, Expense } from '../context/FinanceContext';

export interface FinanceUpdate {
  incomes?: Omit<IncomeSource, 'id'>[];
  expenses?: Omit<Expense, 'id'>[];
  message?: string;
}

export class ChatGPTService {
  private apiKey: string | null = null;
  private baseUrl = 'https://api.openai.com/v1';

  setApiKey(key: string) {
    this.apiKey = key;
    console.log('ChatGPT API key set');
  }

  async transcribeAudio(audioUri: string): Promise<string | null> {
    try {
      if (!this.apiKey) {
        throw new Error('OpenAI API key not set');
      }

      // For web platform, we'll simulate transcription
      if (audioUri.includes('web')) {
        console.log('Simulating transcription for web platform');
        return 'I spent $50 on groceries today and received $2000 salary this month';
      }

      // Create FormData for audio file upload
      const formData = new FormData();
      formData.append('file', {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      } as any);
      formData.append('model', 'whisper-1');

      const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Transcription result:', result.text);
      return result.text;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      return null;
    }
  }

  async processFinanceText(text: string): Promise<FinanceUpdate | null> {
    try {
      if (!this.apiKey) {
        throw new Error('OpenAI API key not set');
      }

      const prompt = `
        You are a financial assistant. Parse the following text and extract financial information.
        Convert it into a JSON object with the following structure:
        {
          "incomes": [{"name": "string", "amount": number, "type": "monthly" | "yearly"}],
          "expenses": [{"name": "string", "amount": number, "type": "monthly" | "static" | "yearly", "category": "string"}],
          "message": "string - brief confirmation of what was processed"
        }

        Rules:
        - Extract only clear financial amounts and descriptions
        - Categorize as income or expense based on context
        - Use appropriate frequency (monthly, yearly, static)
        - If no clear financial data, return empty arrays
        - Categories can be: "food", "transport", "housing", "entertainment", "utilities", "other"

        Text to process: "${text}"

        Respond only with valid JSON, no additional text.
      `;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful financial assistant that extracts financial data from text and returns valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`ChatGPT request failed: ${response.statusText}`);
      }123

      const result = await response.json();
      const content = result.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content in ChatGPT response');
      }

      console.log('ChatGPT response:', content);

      // Parse the JSON response
      const financeData = JSON.parse(content);
      console.log('Parsed finance data:', financeData);

      return financeData;
    } catch (error) {
      console.error('Error processing finance text:', error);
      
      // Fallback: try to extract basic information manually
      return this.fallbackProcessing(text);
    }
  }

  private fallbackProcessing(text: string): FinanceUpdate {
    console.log('Using fallback processing for:', text);
    
    const incomes: Omit<IncomeSource, 'id'>[] = [];
    const expenses: Omit<Expense, 'id'>[] = [];

    // Simple regex patterns to extract amounts
    const amountPattern = /\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/g;
    const amounts = text.match(amountPattern);

    // Keywords that suggest income
    const incomeKeywords = ['salary', 'wage', 'income', 'earned', 'paid', 'bonus', 'received'];
    const expenseKeywords = ['spent', 'cost', 'paid for', 'bought', 'expense', 'bill'];

    if (amounts) {
      amounts.forEach((amountStr, index) => {
        const amount = parseFloat(amountStr.replace(/[$,]/g, ''));
        const contextBefore = text.substring(Math.max(0, text.indexOf(amountStr) - 50), text.indexOf(amountStr));
        const contextAfter = text.substring(text.indexOf(amountStr) + amountStr.length, Math.min(text.length, text.indexOf(amountStr) + amountStr.length + 50));
        const context = (contextBefore + ' ' + contextAfter).toLowerCase();

        const isIncome = incomeKeywords.some(keyword => context.includes(keyword));
        const isExpense = expenseKeywords.some(keyword => context.includes(keyword));

        if (isIncome) {
          incomes.push({
            name: `Voice Income ${index + 1}`,
            amount,
            type: 'monthly'
          });
        } else if (isExpense || (!isIncome && !isExpense)) {
          // Default to expense if unclear
          expenses.push({
            name: `Voice Expense ${index + 1}`,
            amount,
            type: 'monthly',
            category: 'other'
          });
        }
      });
    }

    return {
      incomes,
      expenses,
      message: `Processed ${incomes.length} income(s) and ${expenses.length} expense(s) from voice input`
    };
  }
}

export const chatGPTService = new ChatGPTService();