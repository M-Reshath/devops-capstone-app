pipeline {
    agent { label 'vm-docker' }

    triggers {
        pollSCM('H/2 * * * *')
    }

    environment {
        IMAGE_NAME = 'reshath/capstone-app'
        DOCKERHUB_CREDS = credentials('dockerhub-creds')
        EC2_HOST = '13.204.76.201'
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

        stage('Deploy to EC2') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'EC2_KEY')]) {
                    sh '''
                    ssh -i /home/joker/.ssh/capstone-key.pem -o StrictHostKeyChecking=no ubuntu@$EC2_HOST "
                      sudo docker pull $IMAGE_NAME:latest &&
                      (sudo docker rm -f capstone-app || true) &&
                      sudo docker run -d --restart unless-stopped -p 3000:3000 --name capstone-app $IMAGE_NAME:latest &&
                      sleep 3 &&
                      curl -f http://localhost:3000/health
                    "
                    '''
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }
        success {
            echo 'Pipeline finished successfully. App is live at http://13.204.76.201:3000'
        }
    }
}
