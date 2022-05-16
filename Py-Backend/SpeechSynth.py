import base64
import time
from blob_store_service import BlobStoreService
try:
    import azure.cognitiveservices.speech as speechsdk
    import config
except ImportError:
    print("Check requirements file")

class SpeechSynth:

    def __init__(self, voice_name:str, file_name:str=None):
        self.speech_config = speechsdk.SpeechConfig(subscription=config.SPEECH_SUBSCRIPTION_KEY, region=config.SPEECH_REGION)
        self.audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)
        if file_name is not None:
            self.file_name = file_name
            self.file_config = speechsdk.audio.AudioOutputConfig(filename=self.file_name)
        self.speech_config.speech_synthesis_voice_name = voice_name 

    # Get audio as wave file or mp3 file
    def synthesize_text_to_audio_file(self, pref_name:str):
        if '.mp3' in self.file_name:
            self.speech_config.set_speech_synthesis_output_format(speechsdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3)
        speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=self.speech_config, audio_config=self.file_config)
        speech_synthesis_result = speech_synthesizer.speak_text_async(pref_name).get()
        if speech_synthesis_result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
            print("Speech synthesized for text [{}], and the audio was saved to [{}]".format(pref_name, self.file_name))
        elif speech_synthesis_result.reason == speechsdk.ResultReason.Canceled:
            cancellation_details = speech_synthesis_result.cancellation_details
            print("Speech synthesis canceled: {}".format(cancellation_details.reason))
            if cancellation_details.reason == speechsdk.CancellationReason.Error:
                print("Error details: {}".format(cancellation_details.error_details))

## MAIN
def text_synthesize_upload(voicename:str, pref_name:str, filename:str):
            
    file_path = config.LOCAL_AUDIO_PATH+filename+'.mp3'
    s = SpeechSynth(voicename, file_path)
    s.synthesize_text_to_audio_file(pref_name)
    time.sleep(1)
    store = BlobStoreService()
    store.upload_service(filename)

    return r"https://wfhck2022nkstorage1.blob.core.windows.net/audiofiles/"+filename+".mp3"

# print(text_synthesize_upload('en-IN-PrabhatNeural','Prabina', 'Prabina'))