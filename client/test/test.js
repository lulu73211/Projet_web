import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
const page = await browser.newPage();

// 1. Aller sur la page de login
await page.goto('http://localhost:5173/login');

// 2. Remplir les champs
await page.type('#email', 'mario@test.com');
await page.type('#password', 'test123');

// 3. Cliquer sur "Login"
await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle0' })
]);

console.log("✅ Connecté");

// 4. Attendre que les conversations soient chargées
await page.waitForSelector('aside .flex.flex-col button');

// 5. Cliquer sur la première conversation
const buttons = await page.$$('aside .flex.flex-col button');
if (buttons.length === 0) {
    console.error('❌ Aucune conversation disponible');
    await browser.close();
    process.exit(1);
}

await buttons[0].click();
console.log('📨 Conversation sélectionnée');

// 6. Attendre la zone de texte
await page.waitForSelector('textarea');

// 7. Écrire et envoyer un message
const message = `Hello from Puppeteer 👋 ${Date.now()}`;
await page.type('textarea', message);

await Promise.all([
    page.click('form button[type="submit"]'),
    await new Promise(resolve => setTimeout(resolve, 1000))
]);

console.log('✅ Message envoyé :', message);

// 8. Vérifier que le message apparaît dans l’interface
const content = await page.content();
if (content.includes(message)) {
    console.log('✅ Message visible dans l’interface');
} else {
    console.error('❌ Message non visible');
}

await browser.close();
