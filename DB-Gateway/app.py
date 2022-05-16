from flask import Flask, request
from flask_restful import Api, Resource
import pyodbc

server = 'naamkaran.database.windows.net'
database = 'NaamKaran-DB'
username = 'naamkaran'
password = '{NM@wfh2022}'   
driver= '{ODBC Driver 17 for SQL Server}'

app =   Flask(__name__)
api =   Api(app)

def db_interface(input_json):
    data = {"data": []}
    with pyodbc.connect('DRIVER='+driver+';SERVER=tcp:'+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password) as conn:
        with conn.cursor() as cursor:
            sql_query = input_json["query"]
            cursor.execute(sql_query)
            if input_json["is_resp_expected"] == True:
                row = cursor.fetchone()
                while row:                    
                    data["data"].append([(str(elm) if type(elm)==bytes else elm) for elm in row])
                    row = cursor.fetchone()
    return data

class insert_user(Resource):
    def post(self):
        data = {"status": "To Process"}
        try:
            json_data = request.get_json()
            input_json = {"query": "INSERT INTO Users (UserId, LastName, FirstName, MiddleName, Pswd, NameId, Gender, Nationality, Language, TraitId, UseChoice, Pace) VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6}, {7}, {8}, {9}, {10}, {11})".format(
                json_data["UserId"], json_data["LastName"], json_data["FirstName"], json_data["MiddleName"], json_data["Pswd"], json_data["NameId"], json_data["Gender"], json_data["Nationality"], json_data["Language"], json_data["TraitId"], json_data["UseChoice"], json_data["Pace"]),
                "is_resp_expected": False
            }
            print(input_json["query"])
            output = db_interface(input_json)
            data["status"] = "Processed"
        except Exception as e:
            data["status"] = "Failed"
            data["exception"] = str(e)
        return data
api.add_resource(insert_user,'/insert_user')

class get_user(Resource):
    def post(self):
        data = {"status": "To Process", "result": []}
        try:
            json_data = request.get_json()
            opt = json_data["option"]
            if opt == "select":
                input_json = {"query": "SELECT UserId, LastName, FirstName, MiddleName, Pswd, NameId, Gender, Nationality, Language, TraitId, UseChoice, Pace FROM Users WHERE UserId={0}".format(
                    json_data["UserId"]), 
                    "is_resp_expected": True
                }
            elif opt == "all":
                input_json = {"query": "SELECT * FROM Users", 
                    "is_resp_expected": True
                }
            else:
                raise Exception("Invalid Option")
            output = db_interface(input_json)
            data["status"] = "Processed"
            data["result"] = output["data"]
        except Exception as e:
            data["status"] = "Failed"
            data["exception"] = str(e)
        return data
api.add_resource(get_user,'/get_user')

class insert_name(Resource):
    def post(self):
        data = {"status": "To Process"}
        try:
            json_data = request.get_json()
            input_json = {"query": "INSERT INTO Names (PrefName, AudioId, AudioType) VALUES ({0}, {1}, {2})".format(
                json_data["PrefName"], json_data["AudioId"], json_data["AudioType"]),
                "is_resp_expected": False
            }
            print(input_json["query"])
            output = db_interface(input_json)
            data["status"] = "Processed"
            input_json = {"query": "SELECT IDENT_CURRENT('Names')", "is_resp_expected": True}
            output = db_interface(input_json)
            data["Id"] = int(output["data"][0][0])
        except Exception as e:
            data["status"] = "Failed"
            data["exception"] = str(e)
        return data
api.add_resource(insert_name,'/insert_name')

class get_name(Resource):
    def post(self):
        data = {"status": "To Process", "result": []}
        try:
            json_data = request.get_json()
            opt = json_data["option"]
            if opt == "select":
                input_json = {"query": "SELECT NameId, PrefName, AudioId, AudioType FROM Names WHERE NameId={0}".format(
                    json_data["NameId"]), 
                    "is_resp_expected": True
                }
            elif opt == "all":
                input_json = {"query": "SELECT * FROM Names", 
                    "is_resp_expected": True
                }
            else:
                raise Exception("Invalid Option")
            output = db_interface(input_json)
            data["status"] = "Processed"
            data["result"] = output["data"]
        except Exception as e:
            data["status"] = "Failed"
            data["exception"] = str(e)
        return data
api.add_resource(get_name,'/get_name')

class insert_audio(Resource):
    def post(self):
        data = {"status": "To Process"}
        try:
            json_data = request.get_json()
            input_json = {"query": "INSERT INTO Audio (AudioB64) VALUES (CONVERT(varbinary(max), {0}))".format(
                json_data["AudioB64"]),
                "is_resp_expected": False
            }
            print(input_json["query"])
            output = db_interface(input_json)
            data["status"] = "Processed"
            input_json = {"query": "SELECT IDENT_CURRENT('Audio')", "is_resp_expected": True}
            output = db_interface(input_json)
            data["Id"] = int(output["data"][0][0])
        except Exception as e:
            data["status"] = "Failed"
            data["exception"] = str(e)
        return data
api.add_resource(insert_audio,'/insert_audio')

class get_audio(Resource):
    def post(self):
        data = {"status": "To Process", "result": []}
        try:
            json_data = request.get_json()
            opt = json_data["option"]
            if opt == "select":
                input_json = {"query": "SELECT AudioId, AudioB64 FROM Audio WHERE AudioId={0}".format(
                    json_data["AudioId"]), 
                    "is_resp_expected": True
                }
            elif opt == "all":
                input_json = {"query": "SELECT * FROM Audio", 
                    "is_resp_expected": True
                }
            else:
                raise Exception("Invalid Option")
            output = db_interface(input_json)
            data["status"] = "Processed"
            data["result"] = output["data"]
        except Exception as e:
            data["status"] = "Failed"
            data["exception"] = str(e)
        return data
api.add_resource(get_audio,'/get_audio')

class get_audio_traits(Resource):
    def post(self):
        data = {"status": "To Process", "result": []}
        try:
            json_data = request.get_json()
            opt = json_data["option"]
            if opt == "select":
                input_json = {"query": "SELECT TraitId, Language, Locale, Gender, VoiceName FROM AudioTraits WHERE TraitId={0}".format(
                    json_data["TraitId"]), 
                    "is_resp_expected": True
                }
            elif opt == "all":
                input_json = {"query": "SELECT * FROM AudioTraits", 
                    "is_resp_expected": True
                }
            else:
                raise Exception("Invalid Option")
            output = db_interface(input_json)
            data["status"] = "Processed"
            data["result"] = output["data"]
        except Exception as e:
            data["status"] = "Failed"
            data["exception"] = str(e)
        return data
api.add_resource(get_audio_traits,'/get_audio_traits')

class default(Resource):
	def get(self):
		return {
			"status": "NaamKaran-Database-Gateway"
		}
api.add_resource(default,'/')

if __name__=='__main__':
    app.run()