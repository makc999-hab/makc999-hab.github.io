// functions/api.js
import fetch from 'node-fetch';

// Конфигурация цен (в рублях)
const PRICING = {
  subscriptions: {
    basic: { 
      name: 'Базовый', 
      price: 1500, // 15 рублей (в копейках)
      rubles: 15,
      description: 'Подписка на тариф Базовый - 500 токенов в месяц'
    },
    pro: { 
      name: 'PRO', 
      price: 7500, // 75 рублей
      rubles: 75,
      description: 'Подписка на тариф PRO - 3000 токенов в месяц'
    },
    enterprise: { 
      name: 'Enterprise', 
      price: 15000, // 150 рублей
      rubles: 150,
      description: 'Подписка на тариф Enterprise - 10000 токенов в месяц'
    }
  },
  tokenPackages: {
    100: { price: 500, rubles: 5, description: '100 токенов для небольших задач' },
    500: { price: 2000, rubles: 20, description: '500 токенов для активного использования' },
    1000: { price: 3500, rubles: 35, description: '1000 токенов для профессионалов' },
    5000: { price: 15000, rubles: 150, description: '5000 токенов для команд и бизнеса' }
  }
};

// Основной обработчик
export async function handler(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Обработка OPTIONS запросов (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const path = event.path.replace('/.netlify/functions/api/', '');
    const body = event.body ? JSON.parse(event.body) : {};
    
    console.log('Request:', { path, method: event.httpMethod, body });

    // === СОЗДАНИЕ ПОДПИСКИ (симуляция для теста) ===
    if (path === 'create-subscription' && event.httpMethod === 'POST') {
      const { priceType, customerEmail } = body;
      
      if (!priceType || !customerEmail) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing required fields' }),
        };
      }

      const plan = PRICING.subscriptions[priceType];
      if (!plan) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid price type' }),
        };
      }

      // Для тестирования возвращаем успешный URL
      // В реальном проекте здесь будет интеграция с ЮKassa API
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          url: `${process.env.URL || 'https://maxperepelitsa.store'}/success.html`,
          testMode: true,
          message: `Тестовый режим: оплата ${plan.rubles}₽ за ${plan.name}`
        }),
      };
    }

    // === ПОКУПКА ТОКЕНОВ (симуляция для теста) ===
    if (path === 'buy-tokens' && event.httpMethod === 'POST') {
      const { tokenAmount, customerEmail } = body;
      
      if (!tokenAmount || !customerEmail) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing required fields' }),
        };
      }

      const tokenPackage = PRICING.tokenPackages[tokenAmount];
      if (!tokenPackage) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid token amount' }),
        };
      }

      // Для тестирования возвращаем успешный URL
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          url: `${process.env.URL || 'https://maxperepelitsa.store'}/success.html`,
          testMode: true,
          message: `Тестовый режим: оплата ${tokenPackage.rubles}₽ за ${tokenAmount} токенов`
        }),
      };
    }

    // === ПРОВЕРКА СТАТУСА ПЛАТЕЖА ===
    if (path === 'check-payment' && event.httpMethod === 'POST') {
      const { paymentId } = body;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          status: 'succeeded',
          metadata: { type: 'test', amount: 100 }
        }),
      };
    }

    // === ПРОКСИ ДЛЯ OPENAI ===
    if (path === 'proxy/openai' && event.httpMethod === 'POST') {
      const { messages } = body;
      
      if (!process.env.OPENAI_API_KEY) {
        // Если нет ключа OpenAI, возвращаем тестовый ответ
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            choices: [{
              message: {
                content: "Это тестовый ответ. Для работы с реальным OpenAI добавьте OPENAI_API_KEY в переменные окружения Netlify."
              }
            }]
          }),
        };
      }

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: messages || [{ role: 'user', content: 'Hello' }],
            temperature: 0.7,
          }),
        });

        const data = await response.json();
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(data),
        };
      } catch (error) {
        console.error('OpenAI API error:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Failed to call OpenAI API' }),
        };
      }
    }

    // === ПРОКСИ ДЛЯ ANTHROPIC (CLAUDE) ===
    if (path === 'proxy/anthropic' && event.httpMethod === 'POST') {
      const { messages } = body;
      
      if (!process.env.ANTHROPIC_API_KEY) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            content: [{
              text: "Это тестовый ответ Claude. Для работы с реальным Claude добавьте ANTHROPIC_API_KEY."
            }]
          }),
        };
      }

      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-opus-20240229',
            messages: messages,
            max_tokens: 1000
          })
        });

        const data = await response.json();
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(data),
        };
      } catch (error) {
        console.error('Anthropic API error:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Failed to call Anthropic API' }),
        };
      }
    }

    // 404 для неизвестных путей
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' }),
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}