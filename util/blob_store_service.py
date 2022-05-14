import os
from azure.storage.blob import ContainerClient, BlobServiceClient
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
                print('uploaded to blob storage: ',file.path)
                os.remove(file)
            del blob_client
        del container_client
                
    def upload_service(self, file_name):
        try:
            audio_file = self.__getfiles(config.LOCAL_AUDIO_PATH, file_name)
            print('uploading file.. ', file_name)
            self.__uploadfiles(audio_file, config.AZURE_STORAGE_CONNECTION_STRING , config.AUDIO_CONTAINER_NAME)
        except:
            pass

    def list_files_in_blobstore(self):

        container_client = ContainerClient.from_connection_string(config.AZURE_STORAGE_CONNECTION_STRING, config.AUDIO_CONTAINER_NAME)
        blobs = container_client.list_blobs()
        names_list = []
        for blob in blobs:
            names_list.append(str(blob.name))

        del container_client

        return names_list

    def download_service(self, file_name):
        container_client = ContainerClient.from_connection_string(config.AZURE_STORAGE_CONNECTION_STRING, config.AUDIO_CONTAINER_NAME)
        blob_client = container_client.get_blob_client(file_name)

        download_path = os.path.join(config.LOCAL_AUDIO_PATH,file_name)
        print('Downloading: ',download_path )
        with open(download_path,"wb") as download_file:
            download_file.write(blob_client.download_blob().readall())
        
        
