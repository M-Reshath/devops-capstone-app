pipeline {
    agent { label 'vm-docker' }

    triggers {
        pollSCM('H/2 * * * *')
    }

    environment {
        IMAGE_NAME = 'reshath/capstone-app'
        DOCKERHUB_CREDS = credentials('dockerhub-creds')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Test') {
            steps {
                sh '''
                docker run --rm -v "$PWD":/app -w /app -e HOME=/tmp --user "$(id -u):$(id -g)" node:20-alpine sh -c "npm install && npm test"
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$BUILD_NUMBER -t $IMAGE_NAME:latest .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh '''
                echo "$DOCKERHUB_CREDS_PSW" | docker login -u "$DOCKERHUB_CREDS_USR" --password-stdin
                docker push $IMAGE_NAME:$BUILD_NUMBER
                docker push $IMAGE_NAME:latest
                '''
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }
        success {
            echo 'Pipeline finished successfully.'
        }
    }
}
