pipeline {
    agent {
        label 'node'}
    tools{
        nodejs('22.12.0')
    }
    environment {
        DOCKER_IMAGE = "frontend-travel-agency"
        DOCKER_TAG = "latest"
        CONTAINER_NAME = "travel-agency"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Clonando el repositorio...'
                checkout scm
            }
        }

        stage('Instalar dependencias') {
            steps {
                 sh '''
                node -v
                npm -v
                echo 'Instalando dependencias...'
                ls -a
                npm install
                '''
            }
        }

        stage('Construir proyecto') {
            steps {
                echo 'Construyendo el proyecto...'
                sh 'npm run build'
            }
        }

        stage('Crear imagen Docker') {
            steps {
                echo 'Creando la imagen Docker...'
                sh '''
                docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                docker images
                '''
            }
        }

        stage('Aprobar despliegue manual') {
            steps {
                echo 'Esperando aprobación para desplegar...'
                input message: '¿Desplegar esta versión?'
            }
        }

        stage('Desplegar en Docker') {
            steps {
                echo 'Desplegando en Docker...'
                sh """
                docker stop ${CONTAINER_NAME} || true
                docker rm -f ${CONTAINER_NAME} || true

                docker run -d \
                --restart unless-stopped \
                --name ${CONTAINER_NAME}
                -p 9001:80 \
                ${DOCKER_IMAGE}:${DOCKER_TAG}
                """
            }
        }
    }

    post {
        success {
            echo 'Pipeline ejecutado exitosamente.'
        }
        failure {
            echo 'La ejecución del pipeline falló.'
        }
    }
}
