pipeline {
    agent {
        label "docker"
    }

    environment {
        DOCKERHUB_CREDENTIALS = credentials("dockerhub-credentials")
        DOCKERHUB_USERNAME = "djibydiallo"

        BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/smarttask-backend"
        FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/smarttask-frontend"

        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage("Checkout") {
            steps {
                echo "=== Récupération du code source ==="
                checkout scm
            }
        }

        stage("Build Backend") {
            steps {
                echo "=== Construction de l'image Backend ==="

                sh """
                    docker build \
                    -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
                    -t ${BACKEND_IMAGE}:latest \
                    ./backend
                """
            }
        }

        stage("Build Frontend") {
            steps {
                echo "=== Construction de l'image Frontend ==="

                sh """
                    docker build \
                    -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                    -t ${FRONTEND_IMAGE}:latest \
                    ./frontend
                """
            }
        }

        stage("Docker Login") {
            steps {
                echo "=== Connexion à Docker Hub ==="

                sh """
                    echo "${DOCKERHUB_CREDENTIALS_PSW}" | \
                    docker login -u "${DOCKERHUB_CREDENTIALS_USR}" --password-stdin
                """
            }
        }

        stage("Push Backend") {
            steps {
                echo "=== Publication de l'image Backend ==="

                sh """
                    docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                    docker push ${BACKEND_IMAGE}:latest
                """
            }
        }

        stage("Push Frontend") {
            steps {
                echo "=== Publication de l'image Frontend ==="

                sh """
                    docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                    docker push ${FRONTEND_IMAGE}:latest
                """
            }
        }
    }

    post {
        success {
            echo "======================================"
            echo "Pipeline SmartTask terminé avec succès"
            echo "======================================"
        }

        failure {
            echo "======================================"
            echo "ERREUR : le pipeline SmartTask a échoué"
            echo "Consultez les logs ci-dessus."
            echo "======================================"
        }

        always {
            echo "Fin de l'exécution du pipeline."
        }
    }
}
