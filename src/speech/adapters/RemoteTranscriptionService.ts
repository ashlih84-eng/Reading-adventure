import type{SpeechRecognitionService,SpeechSessionResult}from'../types';
export abstract class RemoteTranscriptionService implements SpeechRecognitionService{readonly kind='remote' as const;abstract isAvailable():boolean;abstract start():Promise<void>;abstract stop():Promise<SpeechSessionResult>;abstract cancel():void}
