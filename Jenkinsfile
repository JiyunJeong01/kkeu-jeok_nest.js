node {
    def app
    stage('Clone repository') {
        git 'https://github.com/JiyunJeong01/kkeu-jeok_nest.js.git'
    }
    stage('Build image') {
        app = docker.build("jiyunjeong/test")
    }
    stage('Test image') {
        app.inside {
            sh 'make test'
        }
    }
    stage('Push image') {
        docker.withRegistry('https://registry.hub.docker.com', 'jiyunJeong') {
            app.push("${env.BUILD_NUMBER}")
            app.push("latest")
        }
    }
}