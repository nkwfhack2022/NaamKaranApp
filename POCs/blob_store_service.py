import audioop
import os
from azure.storage.blob import ContainerClient, BlobServiceClient
import config
class BlobStoreService:

    def getfiles(self, dir:str):
        with os.scandir(dir) as entries:
            for entry in entries:
                if entry.is_file() and not entry.name.startswith('.'):
                    yield entry

    def getfiles(self, dir:str, file_name:str):
        with os.scandir(dir) as entries:
            for entry in entries:
                print(entry.name)
                if (entry.is_file() and (entry.name.startswith(file_name))):
                    yield entry

    def uploadfiles(self, files, connection_str:str, container_name:str):
        container_client = ContainerClient.from_connection_string(connection_str, container_name)
        try:
            for file in files:
                blob_client = container_client.get_blob_client(file.name)
                print(file.path)
                with open(file.path,"rb") as data:
                    blob_client.upload_blob(data, overwrite=True)
                    print('uploaded to blob storage: ',file.path)
                    os.remove(file)
        except Exception as ex:
            print(ex)
         
   
                
    def upload_service(self, file_name):
        try:
            audio_file = self.getfiles(config.LOCAL_AUDIO_PATH, file_name)
                
            print('uploading file.. ', file_name)
            self.uploadfiles(audio_file, config.AZURE_STORAGE_CONNECTION_STRING , config.AUDIO_CONTAINER_NAME)
            
        except Exception as ex:
            print(ex)
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
        
    def delete_blob_service(self, file_name):
        blob_service_client = BlobServiceClient.from_connection_string(conn_str=config.AZURE_STORAGE_CONNECTION_STRING)
        blob_client = blob_service_client.get_container_client(config.AUDIO_CONTAINER_NAME)

        for blob in blob_client.list_blobs():
            if(file_name in blob.name):
                blob_client.delete_blob(blob.name,delete_snapshots='include')
        
        print('deleted: ',file_name)
        
