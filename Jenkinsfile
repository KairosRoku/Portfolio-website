pipeline {
    agent any

    tools {
        nodejs 'node18'
        git 'git'
    }

    environment {
        IMAGE_NAME = "react-app"
        DEV_CONTAINER = "react-dev"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/KairosRoku/Portfolio-website.git'
            }
        }

        stage('Install & Test') {
            steps {
                sh '''
                npm ci
                npm test -- --watchAll=false
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Deploy DEV') {
            steps {
                sh '''
                docker stop $DEV_CONTAINER || true
                docker rm $DEV_CONTAINER || true
                docker run -d -p 3001:80 --name $DEV_CONTAINER $IMAGE_NAME
                '''
            }
        }
    } // closes stages
} // closes pipeline
