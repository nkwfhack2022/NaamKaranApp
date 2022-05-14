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
            input_json = {"query": "INSERT INTO Users (LastName, FirstName, MiddleName, Pswd, NameId, Gender, Nationality, Language, TraitId, UseChoice, Pace) VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6}, {7}, {8}, {9}, {10})".format(
                json_data["LastName"], json_data["FirstName"], json_data["MiddleName"], json_data["Pswd"], json_data["NameId"], json_data["Gender"], json_data["Nationality"], json_data["Language"], json_data["TraitId"], json_data["UseChoice"], json_data["Pace"]),
                "is_resp_expected": False
            }
            print(input_json["query"])
            output = db_interface(input_json)
            data["status"] = "Processed"
        except:
            data["status"] = "Failed"
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
                raise Exception()
            output = db_interface(input_json)
            data["status"] = "Processed"
            data["result"] = output["data"]
        except:
            data["status"] = "Failed"
        return data
api.add_resource(get_user,'/get_user')

class default(Resource):
	def get(self):
		return {
			"status": "NaamKaran-Database-Gateway"
		}
api.add_resource(default,'/')

if __name__=='__main__':
    app.run()