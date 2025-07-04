# 🚀 Projet Fullstack Messagerie (Frontend + Backend)

Ce projet utilise **Docker Compose** pour orchestrer un frontend (Vite/React/Shadcn) et un backend (NestJS/Gql), avec un reverse proxy Nginx.

---

## 🧾 Prérequis

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/) (souvent inclus avec Docker Desktop)

---

## ⚙️ Configuration des variables d’environnement

Chaque service a un fichier `.env.example`. Tu dois les dupliquer en `.env` :

```bash
cp backend/.env.example backend/.env
cp client/.env.example client/.env
