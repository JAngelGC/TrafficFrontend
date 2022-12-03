# Guia de instalacion

## **Instalacion**

### **Backend**

Instalar Python 2.7.18 o superior

Instalar pip

Actualizar pip\
`$ pip install --upgrade pip`

Instalar pipenv\
`$ pip install --upgrade pipenv`

Instalar dependencias\
`$ pip install -r /requirements.txt/`

### **Frontend**

Instalar NodeJS 16.8 o superior

Instalar dependencias de Node\
`$ npm install`

<br/>

## **Configuracion**

### **Deployment en IBM Cloud**

Colocarse en la carpeta del proyecto y ejecutar los siguientes comandos

```
$ ibmcloud login
$ ibmcloud target --cf
$ ibmcloud api https://cloud.ibm.com
$ ibmcloud login
$ ibmcloud target --cf
$ ibmcloud cf push
```

<br/>

## **Ejecución**

### **Backend**

`$ python backend.py`
<br/><br/>

### **Frontend**

`$ npm start`
