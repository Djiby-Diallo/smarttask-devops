# SmartTask DevOps

Application web de gestion de tâches développée avec Node.js, Express, MySQL, Docker et Docker Compose.

## Services

- Frontend : Nginx sur le port 8080
- Backend : Node.js / Express sur le port 3000
- Base de données : MySQL sur le port 3306

## Lancement

 docker compose up -d --build

## Accès

- Frontend : http://localhost:8080
- Backend : http://localhost:3000
- API : http://localhost:3000/api/tasks

## Fonctionnalités

- Ajouter une tâche
- Afficher les tâches
- Supprimer une tâche
- Stocker les tâches dans MySQL

## Branches Git

- Dev : développement
- Prod : production
