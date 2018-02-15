webpackJsonp([0],[,function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default=class extends Phaser.TileSprite{constructor(e,t,s,a,i,l){super(e,t,s,a,a,i,l[0]),this.anchor.set(.5,.5),l.length>1&&(this.animations.add("idle",l,10,!0),this.play("idle"))}kill(){this.alive=this.exists=this.visible=!1}}},,,,function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.randomBetween=((e,t,s=!1)=>{let a=e+Math.random()*(t-e);return s&&(a=Math.floor(a)),a})},,,,,,function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),s(3),s(2),s(4);const a=s(12),i=s(13),l=s(14),r=s(19);new class extends Phaser.Game{constructor(e){super(e),this.state.add("Boot",a.default),this.state.add("Preload",i.default),this.state.add("Game",l.default),this.state.add("GameOver",r.default),this.state.start("Boot")}}({width:576,height:576,renderer:Phaser.AUTO,parent:"game",resolution:1})},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default=class extends Phaser.State{init(){this.game.stage.backgroundColor="#000",this.scale.scaleMode=Phaser.ScaleManager.NO_SCALE,this.scale.pageAlignHorizontally=!0,this.scale.pageAlignVertically=!0}preload(){this.load.image("bar","assets/images/preloader-bar.png")}create(){this.state.start("Preload")}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default=class extends Phaser.State{preload(){const e=this.add.sprite(this.game.world.centerX,this.game.world.centerY,"bar");e.anchor.setTo(.5),e.scale.setTo(100,1),this.load.setPreloadSprite(e),this.load.spritesheet("heroes","assets/images/uf_heroes.png",48,48,void 0,0,0),this.load.spritesheet("items","assets/images/uf_items.png",48,48,void 0,0,0),this.load.spritesheet("terrain","assets/images/uf_terrain.png",48,48,void 0,0,0),this.load.json("gameBaseData","assets/data/gameBaseData.json")}create(){this.state.start("Game")}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=s(15),i=s(5),l=10,r=10,o=48,n={font:"8px Pixel",fill:"#ffffff",align:"center"},h={floor:1,theme:0,stats:{health:25,attack:2,defense:1,gold:0,hasKey:!1}};t.default=class extends Phaser.State{constructor(){super(...arguments),this.__board={rows:l,cols:r,size:o}}init(e=h){this.__currentFloor=e.floor,this.__playerStats=Object.assign({},e.stats),this.__currentTheme=e.theme}create(){this.__levelData=this.game.cache.getJSON("gameBaseData"),this.__backgroundTiles=this.game.add.group(),this.__backgroundTiles.x=this.__board.size,this.__backgroundTiles.y=this.__board.size,this.__mapElements=this.game.add.group(),this.__mapElements.x=this.__board.size,this.__mapElements.y=this.__board.size,a.createBackgroundTiles(this.__backgroundTiles,this.__levelData,this.__currentTheme,this.__board,e=>{a.clearDarknessTile(this.__darkTiles,this.__mapElements,e,this.__board,!0)}),a.createProps(this.__mapElements,this.__board,this.__levelData,this.__currentTheme),a.createItems(this.__mapElements,this.__board,this.__levelData,(e,t)=>{a.clearDarknessTile(this.__darkTiles,this.__mapElements,e,this.__board,!0,!1,!1),this.__playerStats.gold+=t.data.gold||0,this.__playerStats.health+=t.data.health||0,this.__playerStats.attack+=t.data.attack||0,this.__playerStats.defense+=t.data.defense||0,this.refreshStats(),t.kill()}),a.createKey(this.__mapElements,this.__levelData.levels[this.__currentTheme].key,this.__board,(e,t)=>{a.clearDarknessTile(this.__darkTiles,this.__mapElements,e,this.__board,!0,!1),this.__playerStats.hasKey=!0,this.refreshStats(),t.kill(),this.showLabel(t,"You found the key. Find the exit",1e3)}),a.createEnemies(this.__mapElements,this.__board,this.__levelData,this.__currentTheme,this.__currentFloor,(e,t)=>{const s=Math.round(100*Math.max(.5,this.__playerStats.attack*Math.random()-t.data.defense*Math.random()))/100;t.data.health-=s,this.showLabel(t,s.toString()),this.game.add.tween(t).to({tint:16711680},300,null,!0).onComplete.addOnce(()=>{if(this.game.tweens.removeFrom(t),t.tint=16777215,t.data.health<=0)this.__playerStats.gold+=t.data.gold,t.kill(),a.clearDarknessTile(this.__darkTiles,this.__mapElements,e,this.__board,!0,!1,!1);else{const e=this.__playerStats.health-Math.max(.5,t.data.attack*Math.random()-this.__playerStats.defense*Math.random());Math.ceil(this.__playerStats.health)>Math.ceil(e)&&(this.camera.flash(13369344,300,!1,.25),this.camera.onFlashComplete.addOnce(()=>{this.__playerStats.health=e}))}this.refreshStats(),this.__playerStats.health<=0&&this.gameOver()})}),a.createExit(this.__mapElements,this.__levelData.levels[this.__currentTheme].exit,this.__board,(e,t)=>{this.__playerStats.hasKey?this.nextLevel():this.showLabel(t,"You need a key",1e3)});const e=a.createEntrance(this.__mapElements,this.__board);this.__darkTiles=a.createDarkTiles(this.game,this.__board),this.__darkTiles.x=this.__board.size,this.__darkTiles.y=this.__board.size,a.clearDarknessTile(this.__darkTiles,this.__mapElements,e,this.__board,!0,!1,!1),this.__walls=this.game.add.group(),a.createWalls(this.__walls,this.__levelData,this.__currentTheme,this.__board),this.initGui(),this.refreshStats(),this.__hudMessages=this.game.add.group(),this.__hudMessages.x=this.__board.size,this.__hudMessages.y=this.__board.size}refreshStats(){this.__healthLabel.text=Math.ceil(this.__playerStats.health).toString(),this.__attackLabel.text=Math.ceil(this.__playerStats.attack).toString(),this.__defenseLabel.text=Math.ceil(this.__playerStats.defense).toString(),this.__goldLabel.text=Math.ceil(this.__playerStats.gold).toString(),this.__keyIcon.alpha=this.__playerStats.hasKey?1:.25,this.__playerStats.health<5?this.__healthIcon.frame=16:this.__playerStats.health<15?this.__healthIcon.frame=17:this.__healthIcon.frame=18}nextLevel(){this.camera.fade(0),this.camera.onFadeComplete.addOnce(()=>{this.game.state.start("Game",!0,!1,{floor:this.__currentFloor+1,theme:i.randomBetween(0,this.__levelData.levels.length,!0),stats:Object.assign({},this.__playerStats,{hasKey:!1})})})}initGui(){const e=o*l+o,t=this.add.bitmapData(this.game.width,this.game.height-o);t.ctx.fillStyle="#111111",t.ctx.fillRect(0,0,this.game.width,o),this.add.sprite(0,e,t);const s={font:"12px Pixel",fill:"#fff",align:"left"};this.__healthIcon=this.add.tileSprite(0,e,o,o,"items",18),this.__healthLabel=this.add.text(0+o,e+20,"99+",s),this.__attackIcon=this.add.tileSprite(0+2*o,e,o,o,"items",44),this.__attackLabel=this.add.text(0+3*o,e+20,"99+",s),this.__defenseIcon=this.add.tileSprite(0+4*o,e,o,o,"items",115),this.__defenseLabel=this.add.text(0+5*o,e+20,"99+",s),this.__goldIcon=this.add.tileSprite(0+6*o,e,o,o,"items",15),this.__goldLabel=this.add.text(0+7*o,e+20,"999+",s),this.__keyIcon=this.add.tileSprite(0+o*r+o,e,o,o,"items",this.__levelData.levels[this.__currentTheme].key[0]),this.__levelLabel=this.add.text(10,10,`${this.__levelData.levels[this.__currentTheme].name}: floor ${this.__currentFloor}`,Object.assign({},s,{font:"9px Pixel"}))}gameOver(){this.game.input.enabled=!1,this.camera.fade(3342336,300,!0,1),this.camera.onFadeComplete.addOnce(()=>{this.game.input.enabled=!0,this.game.state.start("GameOver")})}showLabel(e,t,s=500){const a=new Phaser.Text(this.game,e.x,e.y,t,n);a.anchor.setTo(.5,.5),this.game.add.tween(a).to({y:a.y-.5*e.height,alpha:.25},s,null,!0).onComplete.addOnce(()=>{a.destroy(!0)}),this.__hudMessages.add(a)}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=s(16),i=s(5),l=s(1),r=s(17),o=s(18);t.getFreeCell=((e,t)=>{let s,l,r,o,n,h,d;const _=e.length;for(;!s;){for(r=!1,n=i.randomBetween(0,t.rows,!0),h=i.randomBetween(0,t.cols,!0),d=0;d<_;d++)if(o=e.children[d],l=a.getCellFromXY(o,t),o&&o.alive&&l.row===n&&l.col===h){r=!0;break}r||(s={row:n,col:h})}return s}),t.createBackgroundTiles=((e,t,s,a,l)=>{let r,o;const n=t.levels[s];for(let t=0;t<a.rows;t++)for(let s=0;s<a.cols;s++)r=i.randomBetween(0,n.tiles.length,!0),(o=new Phaser.TileSprite(e.game,s*a.size,t*a.size,a.size,a.size,"terrain",n.tiles[r])).inputEnabled=!0,o.events.onInputDown.add(()=>{l({row:t,col:s},o)}),e.add(o)}),t.createDarkTiles=((e,t)=>{const s=new Phaser.Group(e);let a;for(let i=0;i<t.rows;i++)for(let l=0;l<t.cols;l++)(a=new Phaser.TileSprite(e,l*t.size,i*t.size,t.size,t.size,"terrain",153)).alpha=.7,s.add(a);return s}),t.createProps=((e,s,r,o)=>{const n=a.countCells(s),h=Math.round(n*r.coefs.propOccupation*i.randomBetween(1-r.coefs.propVariation,1+r.coefs.propVariation)),d=r.levels[o],_=[...r.common.props,...d.props];let c,m,u,g,f;for(let r=0;r<h;r++)m=_[c=i.randomBetween(0,_.length,!0)],g=t.getFreeCell(e,s),f=a.getXYFromCell(g,s),(u=new l.default(e.game,f.x,f.y,s.size,"terrain",m.frames)).inputEnabled=!1,e.add(u)}),t.createItems=((e,s,l,o)=>{const n=a.countCells(s),h=Math.round(n*l.coefs.itemOccupation*i.randomBetween(1-l.coefs.itemVariation,1+l.coefs.itemVariation));let d,_,c,m,u;const g=(e,t)=>()=>o(e,t);for(let o=0;o<h;o++)d=i.randomBetween(0,l.items.length,!0),_=l.items[d],m=t.getFreeCell(e,s),u=a.getXYFromCell(m,s),(c=new r.default(e.game,u.x,u.y,s.size,_)).visible=!1,c.inputEnabled=!0,c.events.onInputDown.addOnce(g(m,c)),e.add(c)}),t.createEnemies=((e,s,l,r,n,h)=>{const d=a.countCells(s),_=Math.round(d*l.coefs.enemyOccupation*i.randomBetween(1-l.coefs.enemyVariation,1+l.coefs.enemyVariation)),c=l.levels[r];let m,u,g,f,p;const w=(e,t)=>()=>h(e,t),b=Math.pow(l.coefs.levelIncrement,n),y=[...l.common.enemies,...c.enemies];for(let l=0;l<_;l++)u=y[m=i.randomBetween(0,y.length,!0)],f=t.getFreeCell(e,s),p=a.getXYFromCell(f,s),(g=new o.default(e.game,p.x,p.y,s.size,Object.assign({},u,{attack:u.attack*b,defense:u.defense*b,health:u.health*b,gold:u.gold*b}))).visible=!1,g.inputEnabled=!0,g.events.onInputDown.add(w(f,g)),e.add(g)}),t.createKey=((e,s,i,r)=>{const o=t.getFreeCell(e,i),n=a.getXYFromCell(o,i),h=new l.default(e.game,n.x,n.y,i.size,"items",s);return h.visible=!1,h.inputEnabled=!0,h.events.onInputDown.addOnce(()=>{r(o,h)}),e.add(h),o}),t.createExit=((e,s,i,r)=>{const o=t.getFreeCell(e,i),n=a.getXYFromCell(o,i),h=new l.default(e.game,n.x,n.y,i.size,"terrain",s);return h.anchor.set(.5,.5),h.visible=!1,h.inputEnabled=!0,h.events.onInputDown.add(()=>{r(o,h)}),e.add(h),o}),t.createEntrance=((e,s)=>{const i=t.getFreeCell(e,s),r=a.getXYFromCell(i,s),o=new l.default(e.game,r.x,r.y,s.size,"terrain",[571]);return e.add(o),i}),t.clearDarknessTile=((e,t,s,i,l=!0,r=!0,n=!0)=>{const h=a.getSurroundingCells(s,i);if(n){const l=a.getIndexFromCell(s,i),r=e.children[l];if(!(r.alive&&r.visible&&r.exists))return;const o=a.getXYFromCell(s,i),n=t.children.find(e=>e.x===o.x&&e.y===o.y);if(n&&n.visible)return}if(r){if(!(-1!==h.findIndex(t=>{const s=a.getIndexFromCell(t,i),l=e.children[s];return!(l.alive&&l.visible&&l.exists)})))return}const d=[s,...h];if(l){if(d.some(e=>{const s=a.getXYFromCell(e,i),l=t.children.find(e=>e instanceof o.default&&e.x===s.x&&e.y===s.y);return l&&l.alive&&l.visible}))return}d.forEach((s,l)=>{const r=a.getIndexFromCell(s,i),o=e.children[r],n=a.getXYFromCell(s,i),h=t.children.find(e=>e.x===n.x&&e.y===n.y);h&&h.alive&&(h.visible=!0),o.game.add.tween(o).to({alpha:0},150,null,!0,25*l).onComplete.add(()=>{o.alive=o.exists=o.visible=!1})})}),t.createWalls=((e,t,s,a)=>{let l,r;for(l=0;l<a.cols;l++)r=i.randomBetween(0,t.levels[s].walls.top.length,!0),e.add(new Phaser.TileSprite(e.game,a.size*l+a.size,0,a.size,a.size,"terrain",t.levels[s].walls.top[r]));for(l=0;l<a.rows+1;l++)r=i.randomBetween(0,t.levels[s].walls.side.length,!0),e.add(new Phaser.TileSprite(e.game,0,a.size*l,a.size,a.size,"terrain",t.levels[s].walls.side[r]));for(l=0;l<a.rows+1;l++)r=i.randomBetween(0,t.levels[s].walls.side.length,!0),e.add(new Phaser.TileSprite(e.game,a.cols*a.size+a.size,a.size*l,a.size,a.size,"terrain",t.levels[s].walls.side[r]))})},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=[{row:1,col:-1},{row:1,col:0},{row:1,col:1},{row:0,col:-1},{row:0,col:1},{row:-1,col:-1},{row:-1,col:0},{row:-1,col:1}];t.countCells=(e=>e.rows*e.cols),t.getSurroundingCells=((e,t)=>{const s=[];return a.forEach(a=>{let i=e.row+a.row,l=e.col+a.col;i>=0&&i<t.rows&&l>=0&&l<t.cols&&s.push({row:i,col:l})}),s}),t.getXYFromCell=((e,t)=>({x:e.col*t.size+.5*t.size,y:e.row*t.size+.5*t.size})),t.getCellFromXY=((e,t)=>({row:e.y/t.size-.5,col:e.x/t.size-.5})),t.getCellFromIndex=((e,t)=>({row:Math.floor(e/(t.rows-1)),col:e%t.cols})),t.getIndexFromCell=((e,t)=>e.row*t.cols+e.col),t.compareCells=((e,t)=>e.row===t.row&&e.col===t.col)},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=s(1);t.default=class extends a.default{constructor(e,t,s,a,i){super(e,t,s,a,"items",i.frames),this.__data=i}get data(){return this.__data}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const a=s(1);t.default=class extends a.default{constructor(e,t,s,a,i){super(e,t,s,a,"heroes",i.frames),this.__data=i}get data(){return this.__data}}},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default=class extends Phaser.State{init(){this.game.stage.backgroundColor=3342336}create(){this.game.add.text(.5*this.game.world.width,.5*this.game.world.height,"Congratulations!\nYou died.\n\nPress any key to restart",{font:"16px Pixel",fill:"#ffffff",align:"center"}).anchor.set(.5,.5),this.game.input.keyboard.addCallbacks(null,()=>{this.game.input.keyboard.removeCallbacks(),this.state.start("Game")})}}}],[11]);
//# sourceMappingURL=game.js.map