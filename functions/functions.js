// functions.js - Серверные функции (для Netlify Functions)
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Конфигурация цен для разных ботов и тарифов
const PRICING = {
    // Тарифы подписки
    subscriptions: {
        basic: { priceId: 'price_basic_monthly', name: 'Базовый', price: 15 },
        pro: { priceId: 'price_pro_monthly', name: 'PRO', price: 75 },
        enterprise: { priceId: 'price_enterprise_monthly', name: 'Enterprise', price: 100 }
    },
    // Оплата за использование ботов
    bots: {
        chatgpt52: { pricePerToken: 0.00003, priceId: 'price_chatgpt52' },
        'nano-banana': { pricePerImage: 0.1, priceId: 'price_nano_banana' },
        'video-generator': { pricePerVideo: 0.5, priceId: 'price_video' },
        'presentation-pro': { pricePerPresentation: 0.2, priceId: 'price_presentation' },
        'image-generator': { pricePerImage: 0.05, priceId: 'price_image' },
        suno: { pricePerAudio: 0.1, priceId: 'price_suno' },
        sora2: { pricePerVideo: 0.5, priceId: 'price_sora2' },
        'image-animation': { pricePerVideo: 0.3, priceId: 'price_animation' },
        'google-veo': { pricePerVideo: 0.5, priceId: 'price_veo' },
        midjourney: { pricePerImage: 0.1, priceId: 'price_midjourney' },
        'kling-turbo': { pricePerVideo: 0.4, priceId: 'price_kling_turbo' },
        'feb-photo': { pricePerImage: 0.05, priceId: 'price_feb_photo' },
        'feb-song': { pricePerAudio: 0.1, priceId: 'price_feb_song' },
        'love-card': { pricePerImage: 0.05, priceId: 'price_love' },
        'eleven-labs': { pricePerAudio: 0.1, priceId: 'price_eleven' },
        'gemini-pro': { pricePerToken: 0.000025, priceId: 'price_gemini' },
        chatgpt51: { pricePerToken: 0.000025, priceId: 'price_chatgpt51' },
        chatgpt5: { pricePerToken: 0.000025, priceId: 'price_chatgpt5' },
        kling26: { pricePerVideo: 0.5, priceId: 'price_kling26' },
        'presentation-generator': { pricePerPresentation: 0.2, priceId: 'price_presentation_gen' },
        claude: { pricePerToken: 0.000015, priceId: 'price_claude' },
        perplexity: { pricePerToken: 0.00002, priceId: 'price_perplexity' }
    }
};

// ==================== ОБРАБОТКА ПЛАТЕЖЕЙ ====================

// Создание сессии для подписки
export async function createSubscription(priceType, customerEmail) {
    try {
        const price = PRICING.subscriptions[priceType];
        if (!price) {
            throw new Error('Invalid price type');
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{ 
                price: price.priceId, 
                quantity: 1 
            }],
            mode: 'subscription',
            success_url: 'https://maxperepelitsa.store/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'https://maxperepelitsa.store/pricing',
            customer_email: customerEmail,
            metadata: {
                type: 'subscription',
                plan: priceType
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                id: session.id,
                url: session.url,
                message: `Сессия для ${price.name} создана`
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
}

// Создание сессии для покупки токенов/запросов
export async function createBotPayment(botKey, amount, customerEmail) {
    try {
        const bot = PRICING.bots[botKey];
        if (!bot) {
            throw new Error('Invalid bot key');
        }

        // Рассчитываем стоимость
        let totalAmount = 0;
        if (bot.pricePerToken) {
            totalAmount = bot.pricePerToken * amount;
        } else if (bot.pricePerImage) {
            totalAmount = bot.pricePerImage * amount;
        } else if (bot.pricePerVideo) {
            totalAmount = bot.pricePerVideo * amount;
        } else if (bot.pricePerPresentation) {
            totalAmount = bot.pricePerPresentation * amount;
        } else if (bot.pricePerAudio) {
            totalAmount = bot.pricePerAudio * amount;
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${botKey} - ${amount} запросов`,
                        description: `Оплата за использование ${botKey}`,
                    },
                    unit_amount: Math.round(totalAmount * 100), // Stripe использует центы
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'https://maxperepelitsa.store/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'https://maxperepelitsa.store/cancel',
            customer_email: customerEmail,
            metadata: {
                type: 'bot_payment',
                bot: botKey,
                amount: amount
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                id: session.id,
                url: session.url,
                totalAmount: totalAmount
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
}

// ==================== ПРОКСИ ДЛЯ API БОТОВ ====================

// Прокси для OpenAI (ChatGPT)
export async function proxyOpenAI(event) {
    try {
        const { messages, model = 'gpt-4' } = JSON.parse(event.body);
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        // Логирование использования
        await logUsage(event.userId, 'openai', data.usage);

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
}

// Прокси для Anthropic (Claude)
export async function proxyAnthropic(event) {
    try {
        const { messages } = JSON.parse(event.body);
        
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-opus',
                messages: messages,
                max_tokens: 1000
            })
        });

        const data = await response.json();
        
        await logUsage(event.userId, 'claude', data.usage);

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
}

// Прокси для Stability AI (Stable Diffusion)
export async function proxyStabilityAI(event) {
    try {
        const { prompt } = JSON.parse(event.body);
        
        const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`
            },
            body: JSON.stringify({
                text_prompts: [{ text: prompt }],
                cfg_scale: 7,
                height: 1024,
                width: 1024,
                steps: 30,
                samples: 1
            })
        });

        const data = await response.json();
        
        await logUsage(event.userId, 'stability', { images: 1 });

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
}

// ==================== ЛОГИРОВАНИЕ ====================

// Логирование использования (можно сохранять в базу данных)
async function logUsage(userId, service, usage) {
    // Здесь можно сохранять в Firebase/Firestore или другую БД
    console.log(`User ${userId} used ${service}:`, usage);
    
    // TODO: Сохранить в базу данных
    // await db.collection('usage').add({
    //     userId,
    //     service,
    //     usage,
    //     timestamp: new Date().toISOString()
    // });
}

// ==================== ВЕБХУК ДЛЯ STRIPE ====================

// Обработка вебхуков от Stripe (подтверждение платежей)
export async function stripeWebhook(event) {
    const sig = event.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
        const stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);

        switch (stripeEvent.type) {
            case 'checkout.session.completed':
                const session = stripeEvent.data.object;
                await handleSuccessfulPayment(session);
                break;
                
            case 'invoice.payment_succeeded':
                const invoice = stripeEvent.data.object;
                await handleSuccessfulInvoice(invoice);
                break;
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ received: true })
        };
    } catch (err) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: `Webhook Error: ${err.message}` })
        };
    }
}

// Обработка успешного платежа
async function handleSuccessfulPayment(session) {
    const { metadata } = session;
    
    if (metadata.type === 'bot_payment') {
        console.log(`Начислено ${metadata.amount} запросов для бота ${metadata.bot} пользователю ${session.customer_email}`);
        // TODO: Сохранить в базу данных
        // await db.collection('users').doc(session.customer_email).update({
        //     [`tokens.${metadata.bot}`]: firebase.firestore.FieldValue.increment(parseInt(metadata.amount))
        // });
    }
}

async function handleSuccessfulInvoice(invoice) {
    console.log(`Оплачен счет для подписки ${invoice.subscription}`);
    // TODO: Продлить подписку
}

// ==================== ОСНОВНОЙ ХЕНДЛЕР ====================

export async function handler(event) {
    try {
        const body = JSON.parse(event.body || '{}');
        const { action, priceType, botKey, amount, customerEmail, messages, prompt } = body;
        const path = event.path;
        const method = event.httpMethod;
        
        console.log('Function called with path:', path, 'method:', method);

        // Платежи
        if (path.includes('/api/create-subscription') && method === 'POST') {
            return await createSubscription(priceType, customerEmail);
        }
        
        if (path.includes('/api/create-bot-payment') && method === 'POST') {
            return await createBotPayment(botKey, amount, customerEmail);
        }

        // Прокси для API ботов
        if (path.includes('/api/proxy/openai') && method === 'POST') {
            return await proxyOpenAI(event);
        }
        
        if (path.includes('/api/proxy/anthropic') && method === 'POST') {
            return await proxyAnthropic(event);
        }
        
        if (path.includes('/api/proxy/stability') && method === 'POST') {
            return await proxyStabilityAI(event);
        }

        // Вебхук Stripe
        if (path.includes('/api/stripe-webhook') && method === 'POST') {
            return await stripeWebhook(event);
        }

        // Старый формат (для обратной совместимости)
        switch(action) {
            case 'createSubscription':
                return await createSubscription(priceType, customerEmail);
                
            case 'createBotPayment':
                return await createBotPayment(botKey, amount, customerEmail);
                
            default:
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: 'Unknown action or path' })
                };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
}