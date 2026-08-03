export type ShopCategory='companion'|'wearable'|'home';
export interface ShopItem{id:string;name:string;cost:number;category:ShopCategory;color:string}
export const SHOP_ITEMS:ShopItem[]=[
 {id:'pony',name:'Pony Friend',cost:150,category:'companion',color:'#b97955'},
 {id:'fox',name:'Sugar Fox',cost:175,category:'companion',color:'#db764d'},
 {id:'owl',name:'Snowy Owl',cost:225,category:'companion',color:'#dce8f2'},
 {id:'dragon',name:'Baby Dragon',cost:500,category:'companion',color:'#75ad83'},
 {id:'hat',name:'Baker Hat',cost:75,category:'wearable',color:'#fff4d8'},
 {id:'boots',name:'Sparkle Boots',cost:90,category:'wearable',color:'#8759ad'},
 {id:'cape',name:'Magic Cape',cost:200,category:'wearable',color:'#b54d7b'},
 {id:'crown',name:'Golden Crown',cost:1000,category:'wearable',color:'#f2c94c'},
 {id:'treehouse',name:'Cookie Treehouse',cost:750,category:'home',color:'#a96842'},
];
