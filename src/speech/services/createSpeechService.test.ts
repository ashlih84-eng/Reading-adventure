import{describe,expect,it}from'vitest';import{createSpeechService}from'./createSpeechService';
describe('speech service selection',()=>{it('uses fallback when a parent disables the microphone',()=>{expect(createSpeechService(false).kind).toBe('fallback')});it('uses fallback when the browser does not support recognition',()=>{expect(createSpeechService(true).kind).toBe('fallback')})});
