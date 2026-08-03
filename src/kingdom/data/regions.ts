export interface Region{id:number;name:string;villain:string;palette:[string,string];motion:'petals'|'steam'|'bubbles'|'leaves'|'mist'|'fireflies'|'drips'|'glow'|'crumbs'|'waves'|'wind'|'snow'|'sparkles'|'ink'|'flour'}
export const REGIONS:Region[]=[
 {id:1,name:'Sprinkle Meadows',villain:'The Sprinkle Snatcher',palette:['#8bd56c','#ff8fc8'],motion:'petals'},
 {id:2,name:'Vanilla Village',villain:'Baron Bland',palette:['#f4dba5','#fff7dc'],motion:'steam'},
 {id:3,name:'Gumdrop Gardens',villain:'The Gumdrop Gobbler',palette:['#78d8c6','#e77ac8'],motion:'bubbles'},
 {id:4,name:'Gingerbread Grove',villain:'Crumbly Jack',palette:['#b97043','#f3b45d'],motion:'leaves'},
 {id:5,name:'Marshmallow Marsh',villain:'Mistress Mallow',palette:['#b9d9ed','#ead8f5'],motion:'mist'},
 {id:6,name:'Chocolate Forest',villain:'The Cocoa Creeper',palette:['#5e3a29','#65a65d'],motion:'fireflies'},
 {id:7,name:'Caramel Crossing',villain:'Captain Caramel',palette:['#c87632','#f6c36a'],motion:'drips'},
 {id:8,name:'Cocoa Castle',villain:'Duke Dark Cocoa',palette:['#573548','#a66064'],motion:'glow'},
 {id:9,name:'Toffee Tunnels',villain:'The Toffee Trickster',palette:['#9b6134','#e5a954'],motion:'crumbs'},
 {id:10,name:'Peppermint Port',villain:'Admiral Mint',palette:['#50b9b0','#e75c69'],motion:'waves'},
 {id:11,name:'Cupcake Cliffs',villain:'The Cupcake Cyclone',palette:['#db8db6','#8fc7ef'],motion:'wind'},
 {id:12,name:'Frosting Mountains',villain:'The Frost Queen',palette:['#92c9ee','#d9f2ff'],motion:'snow'},
 {id:13,name:'Truffle Territory',villain:'The Truffle Twins',palette:['#6f4134','#b77b57'],motion:'sparkles'},
 {id:14,name:'Royal Recipe Archives',villain:'The Ink Blot Baker',palette:['#7e6998','#d5bd89'],motion:'ink'},
 {id:15,name:'The Royal Bakery',villain:'Lady Licorice',palette:['#9b5cc1','#f0b649'],motion:'flour'},
];
