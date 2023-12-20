const cvs=document.getElementById('imageCanvas')
const ctx=cvs.getContext('2d')
cvs.width=window.innerWidth
cvs.height=window.innerHeight
let buildingWidth=640
let buildingHeight=480
let floors=6
let storeyHeight=buildingHeight/floors
let groundHeight=storeyHeight
let floorHeight=storeyHeight/5
let floorWidth=floorHeight
let lineWidth=floorHeight/4
storeyHeight=storeyHeight-floorHeight
let liftCoridorWd=floorWidth*4
let coridorW=floorWidth*4
let counterWgCoridorWd=floorWidth*3
let coridorsArea=floorWidth*18
let landWidth=window.innerWidth
let landHeight=16

// LAND
ctx.fillStyle="#95b88e"
ctx.fillRect(0,(cvs.height-landHeight),landWidth,landHeight)
// BUILDING'S LAYOUT
ctx.fillStyle='#7c5232'
ctx.fillRect((cvs.width/2-(buildingWidth/2)-lineWidth),(cvs.height-landHeight-(lineWidth*6)-buildingHeight),(buildingWidth+(lineWidth*2)),buildingHeight+(lineWidth*6))
// BUILDING'S FLOORS
let colors=['blue','red','magenta','green','yellow','lime']
for(let j=1;j<=floors;j++) {
    ctx.fillStyle="#f4edea"
    ctx.fillRect((cvs.width/2-(buildingWidth/2)),(cvs.height-landHeight-(lineWidth*2)-(storeyHeight*(j))-floorHeight*(j-1)),buildingWidth,storeyHeight)
}

// ELEVATOR'S CORIDOR
ctx.fillStyle="#eae5cf"
ctx.fillRect((cvs.width/2-liftCoridorWd/2),cvs.height-landHeight-(lineWidth*2)-(groundHeight*floors)+floorHeight,liftCoridorWd, (groundHeight*(floors))-floorHeight)

// FLOOR'S PATTERN
for(let j=1;j<=floors;j++) {
    ctx.fillStyle=`#7c5232`
    ctx.fillRect((cvs.width/2-(buildingWidth/2)),(cvs.height-landHeight-(lineWidth*2)-(storeyHeight*(j))-floorHeight*(j)),buildingWidth,floorHeight)
    ctx.fillStyle="#f8d09f"
    for(let i=0;i<buildingWidth/16;i++) {
        ctx.fillRect((cvs.width/2-(buildingWidth/2)+(16*i)+(lineWidth/4)),(cvs.height-landHeight-(lineWidth*2)-(storeyHeight*(j))-(floorHeight*(j))+(lineWidth/4)),16-(lineWidth/2),(floorHeight)-(lineWidth/2))
    }
}
// LIFT CORIDOR'S FRAME
ctx.fillStyle=`#7c5232`
ctx.fillRect(((cvs.width/2)-(liftCoridorWd/2)-(lineWidth*1.5)),cvs.height-landHeight-(lineWidth*2)-(groundHeight*floors)+floorHeight, (lineWidth*1.5),(groundHeight*(floors))-floorHeight)
ctx.fillRect(((cvs.width/2)+(liftCoridorWd/2)),cvs.height-landHeight-(lineWidth*2)-(groundHeight*floors)+floorHeight,(lineWidth*1.5),(groundHeight*(floors))-floorHeight)

// COUNTER WEIGHT CORIDOR'S FRAME
// ctx.fillStyle=`#7c5232`
// ctx.fillRect(((cvs.width/2-(coridorsArea/2))+counterWgCoridorWd-(lineWidth*2.5)),cvs.height-landHeight-(lineWidth*2)-(groundHeight*floors)+floorHeight, (lineWidth*1.5),(groundHeight*(floors))-floorHeight)
// ctx.fillRect(((cvs.width/2-(coridorsArea/2))+(counterWgCoridorWd*2)-(lineWidth)),cvs.height-landHeight-(lineWidth*2)-(groundHeight*floors)+floorHeight,(lineWidth*1.5),(groundHeight*(floors))-floorHeight)

