pipeline {
    agent {
        label 'node'}

    environment {
        REACT_APP_NILO = "mi-react-app"
        DOCKER_IMAGE = "miusuario/mi-react-app"
        DOCKER_TAG = "latest"
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
                sh '''
                docker stop ${REACT_APP_NAME} || true
                docker rm ${REACT_APP_NAME} || true
                docker run -p 9001:80 ${DOCKER_IMAGE}:${DOCKER_TAG}
                docker ps
                '''
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
