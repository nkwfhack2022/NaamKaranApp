import requests
import json

# url = 'http://127.0.0.1:5000/insert_user'
# payload = {"LastName": "'Sahoo'", 
#            "FirstName": "'Subham'", 
#            "MiddleName": "''", 
#            "Pswd": "'password'", 
#            "NameId": 2000, 
#            "Gender": "'M'", 
#            "Nationality": "'India'", 
#            "Language": "'English'", 
#            "UseChoice": "'N'", 
#            "Pace": "'S'"}
# x = requests.post(url, json = payload)
# print(x.text)

url = 'http://127.0.0.1:5000/get_user'
payload = {"UserId": 3001, "option": "select"}
x = requests.post(url, json = payload)
print(x.text)

url = 'http://127.0.0.1:5000/get_user'
payload = {"option": "all"}
x = requests.post(url, json = payload)
print(x.text)