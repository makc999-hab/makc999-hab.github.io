// functions.js - Серверные функции (для Netlify Functions)
import Stripe from "stripe";
import fetch from 'node-fetch';

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
        chatgpt: { pricePerToken: 0.00003, priceId: 'price_chatgpt' },
        midjourney: { pricePerImage: 0.1, priceId: 'price_midjourney' },
        dalle: { pricePerImage: 0.04, priceId: 'price_dalle' },
        claude: { pricePerToken: 0.000015, priceId: 'price_claude' },
        gemini: { pricePerToken: 0.000025, priceId: 'price_gemini' },
        perplexity: { pricePerToken: 0.00002, priceId: 'price_perplexity' },
        video: { pricePerVideo: 0.5, priceId: 'price_video' },
        presentation: { pricePerPresentation: 0.2, priceId: 'price_presentation' }
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
            success_url: 'https://mak999-hab.github.io/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'https://mak999-hab.github.io/pricing',
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
            success_url: 'https://mak999-hab.github.io/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'https://mak999-hab.github.io/cancel',
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

// ==================== ОСНОВНОЙ ХЕНДЛЕР ====================

export async function handler(event) {
    try {
        const body = JSON.parse(event.body || '{}');
        const { action, priceType, botKey, amount, customerEmail } = body;
        
        console.log('Function called with action:', action);

        switch(action) {
            case 'createSubscription':
                return await createSubscription(priceType, customerEmail);
                
            case 'createBotPayment':
                return await createBotPayment(botKey, amount, customerEmail);
                
            default:
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: 'Unknown action' })
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