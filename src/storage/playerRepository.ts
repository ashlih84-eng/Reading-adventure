import{openDB,type DBSchema}from'idb';import type{PlayerProfile}from'../profiles/types';
interface KingdomDB extends DBSchema{players:{key:string;value:PlayerProfile};settings:{key:string;value:unknown}}
export interface PlayerRepository{list():Promise<PlayerProfile[]>;save(player:PlayerProfile):Promise<void>;remove(id:string):Promise<void>}
const db=openDB<KingdomDB>('cookie-kingdom-v2',1,{upgrade(database){database.createObjectStore('players',{keyPath:'id'});database.createObjectStore('settings')}});
export const playerRepository:PlayerRepository={async list(){return(await(await db).getAll('players')).map(player=>({...player,equippedItems:player.equippedItems??[],masteryByRegion:player.masteryByRegion??{}}))},async save(player){await(await db).put('players',player)},async remove(id){await(await db).delete('players',id)}};
