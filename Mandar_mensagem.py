import requests
import os
from dotenv import load_dotenv
import json
import sys

load_dotenv()

nome = sys.argv[1]
remetente_numero = sys.argv[2]
categorias = sys.argv[3]

def Mandar_mensagem (nome, remetente_numero, categorias):
    # Conexão da GREEN API
    url_enviar = os.getenv('URL_ENVIAR')
    url_enviar_imagem = "https://7103.media.greenapi.com/waInstance7103105509/sendFileByUpload/8eab77cb68e442d9a43f429c244ca8d38ad337dc2b974255a1"

    # Fortmatar o número do cliente para mandar as mensagens
    remetente_numero += "@c.us"

    # Enviar a mensagem de intrudução
    mensagem_inicial = f"""Olá, {nome}! Eu sou o chatbot da BDM, e você acaba de assinar um dos planos que te dá acesso a essa conversa. Estou aqui para facilitar sua experiência e fornecer as informações que você precisa!

    Minhas principais utilidades são:

    *Filtrar as notícias* que serão enviadas para você.
    Responder às suas principais *dúvidas sobre o mercado de ações*.

    Atualmente, você está recebendo notícias das seguintes categorias: *{categorias}*. Se desejar mudar suas categorias, é só me enviar a mensagem "Mudar categorias"!

    Todas as minhas respostas são formuladas com base nas notícias escritas pelos jornalistas da BDM, garantindo a integridade das informações que compartilho com você.

    A seguir, vou mostrar alguns dos meus principais casos de uso:"""

    payload = {
    "chatId": remetente_numero, 
    "message": mensagem_inicial
    }
    headers = {
    'Content-Type': 'application/json'
    }

    response = requests.request("POST", url_enviar, data=json.dumps(payload), headers=headers)

    print(response.text.encode('utf8'))

    #------------------------------------------------------------------------------------------

    # Enviar a foto de resumo por categoria
    payload = {
        'chatId': remetente_numero
    }
    files = {
        'file': open('teste.png', 'rb')
    }
    headers = {}

    response = requests.post(url_enviar_imagem, data=payload, files=files, headers=headers)

    # Fechando o arquivo após o envio
    files['file'].close()

    print(response.text.encode('utf8'))

    # Enviar a foto de pergunta mencionando mensagem
    payload = {
        'chatId': remetente_numero
    }
    files = {
        'file': open('teste2.png', 'rb')
    }
    headers = {}

    response = requests.post(url_enviar_imagem, data=payload, files=files)

    # Fechando o arquivo após o envio
    files['file'].close()

    # Imprimindo a resposta
    print(response.text.encode('utf8'))

    # Enviar a imagem de pergunta sobre entidades/ações
    payload = {
        'chatId': remetente_numero,
        'caption': """Resumo de diário/semanal por categoria
Perguntas mencionando uma mensagem específica
Perguntas sobre entidades/ações específicas"""
    }
    files = {
        'file': open('teste3.png', 'rb') 
    }
    headers = {}

    response = requests.post(url_enviar_imagem, data=payload, files=files, headers=headers)

    # Fechando o arquivo após o envio
    files['file'].close()

    print(response.text.encode('utf8'))

    #------------------------------------------------------------------------------------------

    mensagem_inicial = """Não se preocupe, pois, caso sua pergunta não possa ser respondida por mim, encaminharei-a para os jornalistas da BDM! Pronto para utilizar esse serviço?"""

    payload = {
    "chatId": remetente_numero, 
    "message": mensagem_inicial
    }
    headers = {
    'Content-Type': 'application/json'
    }

    response = requests.request("POST", url_enviar, data=json.dumps(payload), headers=headers)

    print(response.text.encode('utf8'))

Mandar_mensagem (nome, remetente_numero, categorias)