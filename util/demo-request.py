import requests
import json

# url = 'http://127.0.0.1:5000/insert_user'
# payload = {"LastName": "'Das'", 
#            "FirstName": "'Prabeen'", 
#            "MiddleName": "''", 
#            "Pswd": "'password'", 
#            "NameId": 2000, 
#            "Gender": "'Male'", 
#            "Nationality": "'India'", 
#            "Language": "'English'", 
#            "TraitId": 3000, 
#            "UseChoice": "'N'", 
#            "Pace": "'S'"}
# x = requests.post(url, json = payload)
# print(x.text)

url = 'https://naamkaran-db-gateway.azurewebsites.net/get_user'
payload = {"UserId": 4003, "option": "select"}
x = requests.post(url, json = payload)
print(x.text)

url = 'https://naamkaran-db-gateway.azurewebsites.net/get_user'
payload = {"option": "all"}
x = requests.post(url, json = payload)
print(x.text)