import os
from azure.storage.blob import ContainerClient
import config
class BlobStoreService:

    def __getfiles(self, dir:str):
        with os.scandir(dir) as entries:
            for entry in entries:
                if entry.is_file() and not entry.name.startswith('.'):
                    yield entry

    def __getfiles(self, dir:str, file_name:str):
        with os.scandir(dir) as entries:
            for entry in entries:
                if (entry.is_file() and (entry.name==file_name)):
                    yield entry

    def __uploadfiles(self, files, connection_str:str, container_name:str):
        container_client = ContainerClient.from_connection_string(connection_str, container_name)

        for file in files:
            blob_client = container_client.get_blob_client(file.name)
            with open(file.path,"rb") as data:
                blob_client.upload_blob(data)
                print('uploaded: ',file.path)

            blob_client.close()
                
    def upload_service(self, file_name):
        try:
            audio_file = self.__getfiles(config.LOCAL_AUDIO_PATH, file_name)
            print('uploading file.. ', file_name)
        except:
            pass
        
        self.__uploadfiles(audio_file, config.AZURE_STORAGE_CONNECTION_STRING, config.AUDIO_CONTAINER_NAME)
