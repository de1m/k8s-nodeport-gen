# Kubernetes Portgen
![screenshot](webgui-screen.png)
This is a simple example app for kubernetes, that generate a random k8s [nodePort](https://kubernetes.io/docs/concepts/services-networking/service/#nodeport).

The frontend is created with [vue.js](https://vuejs.org) (folder client) and backend was created with [express] (http://expressjs.com/de/) (folder server) 

## Run app without docker
0. Define environment variables
1. Start client 
  - go in folder client
  - run "npm i"
  - run "npm run dev"
  - change url for server in src/components/Index.vue 
The site is accessible on url http://localhost:8080
2. Start server
  - go in folder server
  - run "npm i"
  - run "node index.js" 
Server will be runnning on port 8081

## Run app with docker

1. Install docker
2. Run command
````
sudo docker run -d -p 8080:8080 -e PORT=8080 -e K8SURL=server.com -e K8SPORT=6443 -e K8STIMEOUT=30 -e RESSPATH=/api/v1/services -e K8STOKEN=BEARERTOKEN-FROM-K8S -e K8SPORTSTART=30000 -e K8SPORTEND=32000 --name portgen -t de1m/k8s-nodeport-gen
````
## Environment variables

**K8SURL** - DNS name for k8s cluster 
**K8SPORT** - api port of k8s cluster 
**K8STIMEOUT** - request timeout (default 30sec.) 
**RESSPATH** - api path to services (/api/v1/services) 
**K8STOKEN** - api token (Bearer) 
**K8SPORTSTART** - nodePorts range start number(default 30000) 
**K8SPORTEND** - nodePorts range end number(default 32000) 

**PORT** - backend server http port (default 8081)