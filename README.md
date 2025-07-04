# 🚀 Projet Fullstack Messagerie (Frontend + Backend)

Ce projet utilise **Docker Compose** pour orchestrer un frontend (Vite/React/Shadcn) et un backend (NestJS/GraphQL), avec une base de données PostgreSQL, Redis pour le cache, et RabbitMQ pour les messages.

---

## 🧾 Prérequis

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/) (souvent inclus avec Docker Desktop)
- [Node.js](https://nodejs.org/) (version 22)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

---

## ⚙️ Configuration des variables d'environnement

Chaque service a un fichier `.env.example`. Tu dois les dupliquer en `.env` :

```bash
cp chat-app/.env.example chat-app/.env
cp client/.env.example client/.env
```

### Variables Frontend (client/.env)
```bash
VITE_API_URL=http://localhost:3000/graphql
VITE_API_WS=ws://localhost:3000/graphql
```

### Variables Backend (chat-app/.env)
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

---

## 🚀 Lancement du projet

### Avec Docker Compose (Recommandé)
```bash
# Lancer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter tous les services
docker-compose down
```

Note: Le schema de la BDD doit être mis à jour avant de lancer les services.

```bash
npx prisma migrate dev
```

### Sans Docker (Développement local)
```bash
# Terminal 1 - Base de données
docker-compose up postgres redis rabbitmq -d

# Terminal 2 - Backend
cd chat-app
npm install
npm run start:dev

# Terminal 3 - Frontend
cd client
npm install
npm run dev
```

---

## 📊 Accès aux services

- **Frontend** : [http://localhost:9400](http://localhost:9400)
- **Backend GraphQL** : [http://localhost:3000/graphql](http://localhost:3000/graphql)
- **PostgreSQL** : `localhost:5432`
- **Redis** : `localhost:6379`
- **RabbitMQ Management** : [http://localhost:15672](http://localhost:15672) (guest/guest)

---

## 🧪 Tests

### Backend (NestJS)

#### Tests unitaires
```bash
cd chat-app
npm run test
```

#### Tests avec couverture
```bash
cd chat-app
npm run test:cov
```

#### Tests end-to-end (E2E)
```bash
cd chat-app
npm run test:e2e
```

#### Tests de performance
```bash
cd chat-app
npm run test:perf
```

> **Note** : Les tests de performance incluent des tests de charge sur les endpoints GraphQL, des tests de performance des requêtes de base de données, et des tests de stress sur les WebSockets.

### Frontend (React/Vite)

#### Tests end-to-end avec Puppeteer
```bash
cd client
npm run test:e2e
```

> **Important** : Pour les tests E2E frontend, assurez-vous que :
> - Le backend est en cours d'exécution sur `http://localhost:3000`
> - Le frontend est en cours d'exécution sur `http://localhost:5173` (mode dev)
> - Un utilisateur test existe avec les identifiants `mario@test.com` / `test123`

### Scénarios de test E2E Frontend

Le test E2E du frontend couvre les scénarios suivants :

1. **Connexion utilisateur**
   - Navigation vers la page de login
   - Saisie des identifiants
   - Vérification de la redirection après connexion

2. **Gestion des conversations**
   - Chargement de la liste des conversations
   - Sélection d'une conversation
   - Affichage des messages existants

3. **Envoi de messages**
   - Saisie d'un nouveau message
   - Envoi du message via formulaire
   - Vérification de l'affichage du message en temps réel

### Structure des tests

```
chat-app/
├── test/
│   ├── app.e2e-spec.ts      # Tests E2E backend
│   └── jest-e2e.json        # Configuration Jest E2E
└── src/
    └── **/*.spec.ts         # Tests unitaires

client/
└── test/
    └── test.js              # Tests E2E frontend (Puppeteer)
```

---

## 🔧 Développement

### Génération du code GraphQL (Frontend)
```bash
cd client
npm run codegen
```

### Migrations de base de données (Backend)
```bash
cd chat-app
npx prisma migrate dev
npx prisma generate
```

### Linting et formatage
```bash
# Backend
cd chat-app
npm run lint
npm run format

# Frontend
cd client
npm run lint
```

---

## 🐛 Debugging

### Logs des services Docker
```bash
# Tous les services
docker-compose logs -f

# Service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Connexion à la base de données
```bash
# Via Docker
docker-compose exec postgres psql -U postgres -d postgres

# Via Prisma Studio
cd chat-app
npx prisma studio
```

---

## 📁 Structure du projet

```
Projet_web/
├── chat-app/           # Backend NestJS
│   ├── src/
│   ├── test/
│   ├── prisma/
│   └── Dockerfile
├── client/             # Frontend React/Vite
│   ├── src/
│   ├── test/
│   └── Dockerfile
├── docker-compose.yml  # Configuration des services
└── README.md
```

---

## 🚨 Résolution des problèmes courants

### Le frontend ne trouve pas le backend
Vérifiez que les variables d'environnement sont correctement configurées dans `client/.env`.

### Erreurs de base de données
```bash
# Réinitialiser la base de données
docker-compose down -v
docker-compose up -d postgres
cd chat-app
npx prisma migrate reset
```

### Tests E2E qui échouent
- Vérifiez que les services sont démarrés
- Assurez-vous que les données de test existent
- Vérifiez les ports utilisés dans les tests

---

## 📝 Notes supplémentaires

- Les tests de performance backend nécessitent une base de données de test peuplée
- Les tests E2E frontend utilisent Puppeteer en mode non-headless par défaut
- La configuration GraphQL est générée automatiquement via le codegen
- Les WebSockets sont utilisés pour les messages en temps réel
```
