from flask import Flask, request
from flask_restful import Api, Resource
from SpeechSynth import text_synthesize_upload
from TextSimilarity import find_similar_names
import random
import string
import requests
import json

base_url = "https://naamkaran-db-gateway.azurewebsites.net"
# base_url = "http://127.0.0.1:5000"

app =   Flask(__name__)
api =   Api(app)

class tts_call(Resource):
    def post(self):
        data = {"status": "To Process"}
        try:
            json_data = request.get_json()
            rand_name = ''.join(random.choice(string.ascii_lowercase) for i in range(10))
            pref_name = json_data["PrefName"]
            voice_name = json_data["VoiceName"]
            blob_url = text_synthesize_upload(voice_name, pref_name, rand_name)
            # url = base_url + '/insert_audio'
            # payload = {"AudioType": "'A'", 
            #            "AudioB64": "''", 
            #            "BlobAddress":"'" + blob_url + "'"
            #           }
            # x = requests.post(url, json = payload)
            data["status"] = "Processed"
            data["blob_address"] = blob_url
        except Exception as e:
            data["status"] = "Failed"
            data["exception"] = str(e)
        return data
api.add_resource(tts_call,'/tts_call')

class similar_names(Resource):
    def post(self):
        data = {"status": "To Process"}
        try:
            json_data = request.get_json()
            given_name = json_data["GivenName"]
            url = base_url + '/get_name'
            payload = {"option": "all"}
            x = requests.post(url, json = payload)
            name_list = json.loads(x.text)["result"]
            same_names = find_similar_names(given_name, name_list)
            data["status"] = "Processed"
            data["result"] = same_names
        except Exception as e:
            data["status"] = "Failed"
            data["exception"] = str(e)
        return data
api.add_resource(similar_names,'/similar_names')

class default(Resource):
	def get(self):
		return {
			"status": "NaamKaran-Py-Backend"
		}
api.add_resource(default,'/')

if __name__=='__main__':
    app.run()