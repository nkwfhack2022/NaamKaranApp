import base64
import os
from blob_store_service import BlobStoreService
try:
    import azure.cognitiveservices.speech as speechsdk
    import config
except ImportError:
    print("Check requirements file")

class SpeechSynth:

    def __init__(self, voice_name:str, file_name:str=None):
        
        # setup configuration for speech and audio
        self.speech_config = speechsdk.SpeechConfig(subscription=config.SPEECH_SUBSCRIPTION_KEY, region=config.SPEECH_REGION)
        self.audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)
        
        # file configuration for saving audio as file
        if file_name is not None:
            self.file_name = file_name
            self.file_config = speechsdk.audio.AudioOutputConfig(filename=self.file_name)
        
        # # stream configuration
        # self.pull_stream = speechsdk.audio.PullAudioOutputStream()
        # self.stream_config  = speechsdk.audio.AudioOutputConfig(stream=self.pull_stream)

        # The language of the voice that speaks.
        self.speech_config.speech_synthesis_voice_name = voice_name 

        
    # Get audio as wave file or mp3 file
    def synthesize_text_to_audio_file(self, pref_name:str):

        # adding additional configuration for mp3 file
        if '.mp3' in self.file_name:
            self.speech_config.set_speech_synthesis_output_format(speechsdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3)

        # synthesize text
        speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=self.speech_config, audio_config=self.file_config)
        
        speech_synthesis_result = speech_synthesizer.speak_text_async(pref_name).get()
        print(speech_synthesis_result)

        # validation - logs
        if speech_synthesis_result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
            print("Speech synthesized for text [{}], and the audio was saved to [{}]".format(pref_name, self.file_name))
        elif speech_synthesis_result.reason == speechsdk.ResultReason.Canceled:
            cancellation_details = speech_synthesis_result.cancellation_details
            print("Speech synthesis canceled: {}".format(cancellation_details.reason))
            if cancellation_details.reason == speechsdk.CancellationReason.Error:
                print("Error details: {}".format(cancellation_details.error_details))

    # get audio data as data stream
    def synthesize_text_to_bytes(self,pref_name:str):

        speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=self.speech_config, audio_config=None)

        speech_synthesis_result = speech_synthesizer.speak_text_async(pref_name).get()

        if speech_synthesis_result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
            print("Speech synthesized for text [{}]".format(pref_name))
            audio_data_stream = speechsdk.AudioDataStream(speech_synthesis_result)
            
            audio_data_stream.position = 0

            # Reads data from the stream
            audio_buffer = bytes(16000)
            total_size = 0
            filled_size = audio_data_stream.read_data(audio_buffer)
            while filled_size > 0:
                print("{} bytes received.".format(filled_size))
                total_size += filled_size
                filled_size = audio_data_stream.read_data(audio_buffer)
            print("Totally {} bytes received for text [{}].".format(total_size, pref_name))
            
            audio_data_stream.position = 0
            return audio_data_stream

            
        elif speech_synthesis_result.reason == speechsdk.ResultReason.Canceled:
            cancellation_details = speech_synthesis_result.cancellation_details
            print("Speech synthesis canceled: {}".format(cancellation_details.reason))
            if cancellation_details.reason == speechsdk.CancellationReason.Error:
                print("Error details: {}".format(cancellation_details.error_details))

    def encode_b64_mp3(self):
        with open('audio_files/name_test1.wav','rb') as f:
            stream = base64.encodebytes(f.read())
            print(len(stream))
            print(type(stream))
        return stream
        

    def decode_b64_mp3(self,stream:bytes):
        pass
        

### TESTING
# audio file test
name = "Denver"
filepath = config.LOCAL_AUDIO_PATH+name+'.mp3'
filename = name+'.mp3'
s = SpeechSynth('en-IN-PrabhatNeural',filepath)
# audio file test
s.synthesize_text_to_audio_file(name)
store = BlobStoreService()
store.upload_service(filename)


# s.encode_b64_mp3()
# s = SpeechSynth('en-IN-PrabhatNeural')
# # audio file test
# s.synthesize_text_to_bytes('Rabindranath Sahoo')