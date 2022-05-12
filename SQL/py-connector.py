import pyodbc
server = 'naamkaran.database.windows.net'
database = 'NaamKaran-DB'
username = 'naamkaran'
password = '{NM@wfh2022}'   
driver= '{ODBC Driver 17 for SQL Server}'

with pyodbc.connect('DRIVER='+driver+';SERVER=tcp:'+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password) as conn:
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM Users")
        row = cursor.fetchone()
        while row:
            print (row)
            row = cursor.fetchone()
        
        cursor.execute("SELECT * FROM Names")
        row = cursor.fetchone()
        while row:
            print (row)
            row = cursor.fetchone()

            cursor.execute("SELECT * FROM Audio")
        row = cursor.fetchone()
        while row:
            print (row)
            row = cursor.fetchone()

        # cursor.execute("INSERT INTO Audio(AudioB64) VALUES (CONVERT(varbinary(max), 'World_Music'))")