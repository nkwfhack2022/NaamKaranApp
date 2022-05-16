from flask import Flask, request
from flask_restful import Api, Resource
from SpeechSynth import text_synthesize_upload
import random
import string

app =   Flask(__name__)
api =   Api(app)

class insert_user(Resource):
    def post(self):
        data = {"status": "To Process"}
        try:
            json_data = request.get_json()
            rand_name = ''.join(random.choice(string.ascii_lowercase) for i in range(10))
            data["status"] = "Processed"
        except Exception as e:
            data["status"] = "Failed"
            data["exception"] = str(e)
        return data
api.add_resource(insert_user,'/insert_user')

class default(Resource):
	def get(self):
		return {
			"status": "NaamKaran-Py-Backend"
		}
api.add_resource(default,'/')

if __name__=='__main__':
    app.run()