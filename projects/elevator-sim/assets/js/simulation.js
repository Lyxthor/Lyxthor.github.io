/* CANVAS */
// get canvases' elements
const powerCvs=document.getElementById('powerCvs')
const accelCvs=document.getElementById('accelCvs')
const veloCvs=document.getElementById('veloCvs')
const yPosCvs=document.getElementById('yPosCvs')
const peCvs=document.getElementById('peCvs')
const keCvs=document.getElementById('keCvs')
const simCvs=document.getElementById('simCvs')
const numCvs=document.getElementById('numCvs')
// get canvases' context
const powerCtx=powerCvs.getContext('2d')
const accelCtx=accelCvs.getContext('2d')
const veloCtx=veloCvs.getContext('2d')
const yPosCtx=yPosCvs.getContext('2d')
const peCtx=peCvs.getContext('2d')
const keCtx=keCvs.getContext('2d')
const simCtx=simCvs.getContext('2d')
const numCtx=numCvs.getContext('2d')
// chart canvases' variables
const chartBgColor="lightgrey"
const chartLnColor="red"
const chartH=150
const chartW=300
powerCtx.strokeStyle=accelCtx.strokeStyle=veloCtx.strokeStyle=yPosCtx.strokeStyle=peCtx.strokeStyle=keCtx.strokeStyle=chartLnColor
powerCtx.fillStyle=accelCtx.fillStyle=veloCtx.fillStyle=yPosCtx.fillStyle=peCtx.fillStyle=keCtx.fillStyle=chartBgColor
powerCvs.height=accelCvs.height=veloCvs.height=yPosCvs.height=peCvs.height=keCvs.height=chartH
powerCvs.width=accelCvs.width=veloCvs.width=yPosCvs.width=peCvs.width=keCvs.width=chartW
const charts=[powerCtx,accelCtx,veloCtx,yPosCtx,peCtx,keCtx]
let drawGraphStamp=''
// sim canvas' variables
const holderPartColor="black"
const movingPartColor="gray"
const fullH=window.innerHeight
const fullW=window.innerWidth
const load=new Image()
load.src="./assets/img/person.svg"
simCtx.fillStyle=movingPartColor
simCtx.lineWidth=lineWidth/2
simCvs.height=numCvs.height=fullH
simCvs.width=numCvs.width=fullW

/* CONTROLLERS */
// get controllers' elements
const controller=document.getElementById('controller')
const floorBtnContainer=document.getElementById('floorBtnContainer')
const floorBtnWraps=document.querySelectorAll('.floorBtnWrap')
const floorBtns=document.querySelectorAll('.floorBtn')
const varInputContainer=document.getElementById('varInputContainer')
const massInput=document.getElementById('massInput')
const snapBtn=document.getElementById('snapBtn')
// set controllers' position
setControllerPos()

/* SIMULATION */
// physics simulation's variables
const gravity=9.8
const cabinMass=1000
const maxLoadMass=cabinMass*80/100
const counterMass=cabinMass+(maxLoadMass/2)
const counterWeight=counterMass*gravity
let time=0
let velo=0
let yPos=0
let deltaY=0
let loadMass=1600
let liftMass=cabinMass+loadMass
let liftWeight=liftMass*gravity
let upForce=0
let downForce=0
let reqMotorForce=0
let defResultant=2000
let resultant=2000
let forceDecrease=defResultant/40
let rawForce=liftWeight+resultant
let accel=resultant/liftMass
let power=0
let pe=0
let ke=0
let balanceCondition='more-counter'
let leftoverTime=0
let simInvert=1


// elevator simulation's variables
const YStart=fullH-landHeight-(buildingHeight-floorHeight)-lineWidth*2
const YEnd=fullH-landHeight-storeyHeight-(lineWidth*2)
const XStart=(fullW/2)-(coridorsArea/2)+counterWgCoridorWd-(lineWidth)
const XEnd=(fullW/2)+(coridorsArea/2)-liftCoridorWd-lineWidth
let floorDestination=1
let currentFloor=3
let currentPos=0
let direction="up"
let lastT=0
let lastH=0
let points=[]
let simulation=[]
let rilTimePoints=[]
let slowingPoints=
{ // to temporary save deacceleration to 0 speed points which later will be push in points array
    accel: 0,
    velo: 0,
    yPos: 0,
    deltaY: 0,
    resultant: 0,
    reqMotorForce: 0,
    points: []
}
// scalles' variables
let buildingScale=buildingHeight/(4*floors)
let chartXScale=0
let powerScale=0
let accelScale=0
let veloScale=0
let yPosScale=0
let peScale=0
let keScale=0
let scalesComparisons=
{
    time: 0,
    power: power,
    accel: accel,
    velo: velo,
    yPos: yPos,
    pe: pe,
    ke: ke
}
currentPos=(currentFloor*4-4)*buildingScale
/* EVENTS LISTENERS */
floorBtns.forEach((floorBtn)=>{
    floorBtn.onclick=(e)=>{
        floorDestination=parseInt(e.target.value)
        if(floorDestination!=currentFloor) {
            resetVar()
            floorDestination>currentFloor?init("up"):init("down")
            simulate(500)
        }
    }
})
massInput.onInput=(e)=>{
    loadMass=parseFloat(e.target.value)
}
snapBtn.onclick=()=>{
    initFall()
    simulate(0)
}
/* FUNCTIONS */
function resetVar() {
    time=0;velo=0;yPos=0;deltaY=0;loadMass=parseFloat(massInput.value);liftMass=cabinMass+loadMass;liftWeight=liftMass*gravity;reqMotorForce=0;resultant=2000;forceDecrease=resultant/40;rawForce=liftWeight+resultant;accel=resultant/liftMass;power=0;pe=0;ke=0;lastH=0

    points=[];simulation=[];slowingPoints={accel:0,velo:0,yPos:0,deltaY:0,resultant:0,reqMotorForce:0,points:[]};rilTimePoints=[]

    chartXScale=0;powerScale=0;accelScale=0;veloScale=0;yPosScale=0;peScale=0;keScale=0;scalesComparisons={time:0,power:power,accel:accel,velo:velo,yPos:yPos,pe:pe,ke:ke}
    

    yPos=currentPos
}
function setForces() {
    if(counterWeight-liftWeight>=defResultant) {// setForceFunction
        switch(direction) {
            case "up" : 
                reqMotorForce=counterWeight-liftWeight-defResultant
                resultant=counterWeight-(liftWeight+reqMotorForce)
                accel=resultant/liftMass
                balanceCondition='more-counter'
                forceDecrease=forceDecrease
                simInvert=1
                break;
            case "down" :
                reqMotorForce=liftWeight-counterWeight-defResultant
                resultant=(counterWeight-liftWeight)+reqMotorForce
                accel=resultant/liftMass
                balanceCondition='more-counter'
                forceDecrease=-forceDecrease
                simInvert=-1
                break;
        }
    } else if(counterWeight-liftWeight<defResultant) {
        switch(direction) {
            case "up" : 
                reqMotorForce=liftWeight-counterWeight+defResultant
                resultant=(counterWeight+reqMotorForce)-liftWeight
                accel=resultant/liftMass
                balanceCondition='more-load'
                forceDecrease=forceDecrease
                simInvert=1
                break;
            case "down" :
                reqMotorForce=counterWeight-liftWeight-defResultant
                resultant=reqMotorForce-(counterWeight-liftWeight)
                accel=resultant/liftMass
                balanceCondition='more-load'
                forceDecrease=-forceDecrease
                simInvert=-1
                break;
        }
        
    }
}
function setControllerPos() {
    controller.style.width=`${fullW}px`
    controller.style.height=`${fullH}px`
    floorBtnContainer.style.width=`${buildingWidth/2}px`
    floorBtnContainer.style.height=`${buildingHeight+(lineWidth*2)}px`
    floorBtnContainer.style.marginBottom=`${landHeight}px`
    varInputContainer.style.right=`${(window.innerWidth-buildingWidth)/2+100}px`
    varInputContainer.style.bottom=`${landHeight+(lineWidth*2)+10}px`
    floorBtnWraps.forEach((btnWrap)=>{
        btnWrap.style.width=buildingWidth+"px"
        btnWrap.style.height=groundHeight+"px"
    })
    floorBtns.forEach((btn)=>{
        btn.style.left=buildingWidth/4+"px"
        btn.style.top=groundHeight/2+"px"
    })
}
function setScales() {
    chartXScale=chartW/scalesComparisons.time
    powerScale=(50)/scalesComparisons.power
    accelScale=(50)/scalesComparisons.accel
    veloScale=(50)/scalesComparisons.velo
    yPosScale=(50)/scalesComparisons.yPos
    peScale=(50)/scalesComparisons.pe
    keScale=(50)/scalesComparisons.ke
}

function pushPoint() {
    time=time+10
    deltaY=(velo*Math.sin(90*Math.PI/180)*10/1000)+(0.5*accel*10*10)/(1000*1000)
    yPos=((yPos/buildingScale)+deltaY)*buildingScale
    pe=liftMass*gravity*(yPos/buildingScale)
    ke=(liftMass*velo*velo)/2
    power=reqMotorForce*velo
    velo=velo+(accel*10/1000)
    points.push({
        y: yPos,
        t: time,
        v: velo,
        a: accel,
        f: reqMotorForce,
        p: power,
        pe: pe,
        ke: ke,
        Tplus: 0
    })
}
function setSlowingPointVar(invert) {
    slowingPoints.accel=accel
    slowingPoints.velo=velo
    slowingPoints.yPos=yPos
    slowingPoints.resultant=resultant
    slowingPoints.reqMotorForce=reqMotorForce
    slowingPoints.time=0
    let limiter=0
    while(slowingPoints.velo*invert>0) {
        slowingPoints.time+=10
        deltaY=(0.5*slowingPoints.accel*10*10)/(1000*1000)
        slowingPoints.yPos=(slowingPoints.velo*Math.sin(90*Math.PI/180)*10/1000+deltaY)*buildingScale
        slowingPoints.velo=slowingPoints.velo+(slowingPoints.accel*10/1000)
        slowingPoints.points.push({
            y: slowingPoints.yPos,
            t: slowingPoints.time,
            v: slowingPoints.velo,
            a: slowingPoints.accel,
            f: slowingPoints.resultant
        })
        slowingPoints.deltaY+=slowingPoints.yPos
        setSlowingPointResultant()
        slowingPoints.accel=slowingPoints.resultant/liftMass
        limiter++
    }
}
function setSlowingPointResultant() {
    if(direction=="up"&&balanceCondition=="more-counter") {
        slowingPoints.resultant=counterWeight-(liftWeight+slowingPoints.reqMotorForce) 
        slowingPoints.reqMotorForce+=forceDecrease
    }
    else if(direction=="down"&&balanceCondition=="more-counter") {
        slowingPoints.resultant=(counterWeight-liftWeight)+slowingPoints.reqMotorForce
        slowingPoints.reqMotorForce-=forceDecrease
    }   
    else if(direction=="up"&&balanceCondition=="more-load") {
        slowingPoints.resultant=(counterWeight+slowingPoints.reqMotorForce)-liftWeight
        slowingPoints.reqMotorForce-=forceDecrease
    }
    else if(direction=="down"&&balanceCondition=="more-load") {
        slowingPoints.resultant=slowingPoints.reqMotorForce-(counterWeight-liftWeight)
        slowingPoints.reqMotorForce-=forceDecrease
    }
}
function initConsSpeedPoints() {
    let currentHeight=points[points.length-1].y
    let lackHeight=(((floorDestination*4-4)*buildingScale)-currentHeight-slowingPoints.deltaY)/buildingScale
    let lackTime=(lackHeight/velo*1000)
    scalesComparisons.velo=velo // set scalesComparisons.velo when velocity is constant
    scalesComparisons.ke=(liftMass*velo*velo)/2 // set scalesComparisons.ke(kinetic energy) after max velocity were setted
    for(let i=0;i<=Math.floor(lackTime/10);i++) pushPoint()
}
function initToIdlePoints(lastPointIsHighest) {
    slowingPoints.points.forEach((p)=>{
        let lastP=points[points.length-1]
        yPos=lastP.y+p.y
        pe=liftMass*gravity*yPos/buildingScale
        ke=(liftMass*p.v*p.v)/2
        power=p.f*p.v
        points.push({
            y: yPos,
            t: lastP.t+10,
            v: p.v,
            a: p.a,
            p: power,
            f: p.f,
            pe: pe,
            ke: ke,
            Tplus: 0
        })
    })
    let highestPoint=lastPointIsHighest?points.length-1:0
    scalesComparisons.yPos=points[highestPoint].y
    scalesComparisons.pe=points[highestPoint].pe // set scalesComparisons.pe at point with highest y position
    currentPos=(floorDestination*4-4)*buildingScale
    currentFloor=floorDestination
}
function initAccelPoints() {
    if(direction=="up") {
        while(velo<1.61) { // acceleration step
            pushPoint()
            scalesComparisons.power=resultant*velo
        }
    } else if(direction=="down" ) {
        while(velo>-1.61) { // acceleration step
            pushPoint()
            scalesComparisons.power=resultant*velo
        }
    }
}
function initDeAccelPoints() {
    if(direction=="up"&&balanceCondition=="more-counter") {
        while(accel>0) {
            pushPoint()
            scalesComparisons.power=resultant*velo
            reqMotorForce+=forceDecrease
            resultant=counterWeight-(liftWeight+reqMotorForce)
            accel=resultant/liftMass
        }
    } else if(direction=="down"&&balanceCondition=="more-counter") {
        while(accel<0) {
            pushPoint()
            scalesComparisons.power=resultant*velo
            reqMotorForce-=forceDecrease
            resultant=(counterWeight-liftWeight)+reqMotorForce
            accel=resultant/liftMass
        }
    } else if(direction=="up"&&balanceCondition=="more-load") {
        while(accel>0) {
            pushPoint()
            scalesComparisons.power=resultant*velo
            reqMotorForce-=forceDecrease
            resultant=(counterWeight+reqMotorForce)-liftWeight
            accel=resultant/liftMass
        }
    } else if(direction=="down"&&balanceCondition=="more-load") {
        while(accel<0) {
            pushPoint()
            scalesComparisons.power=resultant*velo
            reqMotorForce-=forceDecrease
            resultant=reqMotorForce-(counterWeight-liftWeight)
            accel=resultant/liftMass
        }
    }
}
function getComparison() {
    scalesComparisons =
    {
        time: 0,
        power: power,
        accel: accel,
        velo: velo,
        yPos: yPos,
        pe: pe,
        ke: ke
    }
    for(let pt of rilTimePoints) {
        scalesComparisons.time=Math.abs(pt.t) > scalesComparisons.time?Math.abs(pt.t):scalesComparisons.time
        scalesComparisons.power=Math.abs(pt.p) > scalesComparisons.power?Math.abs(pt.p):scalesComparisons.power,
        scalesComparisons.accel=Math.abs(pt.a) > scalesComparisons.accel?Math.abs(pt.a):scalesComparisons.accel,
        scalesComparisons.velo=Math.abs(pt.v) > scalesComparisons.velo?Math.abs(pt.v):scalesComparisons.velo,
        scalesComparisons.yPos=Math.abs(pt.y) > scalesComparisons.yPos?Math.abs(pt.y):scalesComparisons.yPos,
        scalesComparisons.pe=Math.abs(pt.pe) > scalesComparisons.pe?Math.abs(pt.pe):scalesComparisons.pe,
        scalesComparisons.ke=Math.abs(pt.ke) > scalesComparisons.ke?Math.abs(pt.ke):scalesComparisons.ke
    }
}
function init(dir) {
    direction=dir
    let invert=(direction==='up')?1:-1
    let lastPointIsHighest=(direction==='up')
    setForces()
    initAccelPoints() 
    initDeAccelPoints()
    setSlowingPointVar(invert) // deacceleration to 0 speed step 1 : set points
    initConsSpeedPoints() // moving at constant speed step
    initToIdlePoints(lastPointIsHighest)
}
let cabinH=0
let cabinT=0
let sekon=0
function initFall() {
    console.log(rilTimePoints)
    points=[]
    clearTimeout(drawGraphStamp)
    simulation.forEach((sim)=>{
        clearTimeout(sim)
    })
    simulation=[]
    // let weightH=(YStart+lastH)/buildingScale
    cabinH=lastH/buildingScale
    cabinT=Math.sqrt(2*cabinH/gravity)*1000
    time=0
    velo=0
    yPos=lastH
    for(let i=0;i<Math.floor(cabinT/10);i++) {
        deltaY=(velo*Math.sin(90*Math.PI/180)*10/1000)+(0.5*-gravity*10*10)/(1000*1000)
        yPos=((yPos/buildingScale)+deltaY)*buildingScale
        pe=liftMass*gravity*(yPos/buildingScale)
        ke=(liftMass*velo*velo)/2
        power=0
        velo=velo+(-gravity*10/1000)
        points.push({
            y: yPos,
            t: lastT+time,
            v: velo,
            a: gravity,
            p: power,
            f: reqMotorForce,
            pe: pe,
            ke: ke,
            Tplus: lastT
        })
        time=time+10
    }
    leftoverTime=cabinT%10
    time+=leftoverTime
    deltaY=(velo*Math.sin(90*Math.PI/180)*leftoverTime/1000)+(0.5*-gravity*leftoverTime*leftoverTime)/(1000*1000)
    yPos=((yPos/buildingScale)+deltaY)*buildingScale
    pe=liftMass*gravity*(yPos/buildingScale)
    ke=(liftMass*velo*velo)/2
    power=liftWeight*velo
    velo=velo+(-gravity*10/1000)
    points.push({
        y: yPos,
        t: lastT+time,
        v: velo,
        a: gravity,
        f: reqMotorForce,
        p: power,
        pe: pe,
        ke: ke,
        Tplus: lastT
    })
    floorDestination=1
    currentFloor=1
    currentPos=0
}

function simulate(delay) {
    numCtx.fillStyle="red"
    numCtx.textAlign="center"
    let invert=
    setTimeout(()=>{
        points.forEach((point,index)=>{
            point.t-=point.Tplus
            let liftH=0
            let counH=0
            simulation.push(setTimeout(()=>{
                simCtx.fillStyle=movingPartColor
                liftH=YEnd-point.y
                counH=YStart+point.y
                simCtx.clearRect(0,YStart,fullW,buildingHeight)
                numCtx.clearRect(0,YStart,fullW,buildingHeight)
                simCtx.fillRect(XEnd,liftH,liftCoridorWd,storeyHeight)
                simCtx.fillRect(XStart,counH,counterWgCoridorWd,storeyHeight)
                simCtx.drawImage(load, XEnd+(liftCoridorWd/2)-25,liftH+storeyHeight-50,50,50)

                simCtx.beginPath()
                simCtx.moveTo(XEnd+(liftCoridorWd/2),YStart)
                simCtx.lineTo(XEnd+(liftCoridorWd/2),liftH)
                simCtx.stroke()

                simCtx.beginPath()
                simCtx.moveTo(XStart+(counterWgCoridorWd/2),YStart)
                simCtx.lineTo(XStart+(counterWgCoridorWd/2),counH)
                simCtx.stroke()

                
                numCtx.fillText(liftWeight,XEnd+liftCoridorWd/2,liftH+storeyHeight/2)
                numCtx.fillText(liftWeight+point.f*simInvert,XEnd+liftCoridorWd/2,liftH+storeyHeight+20)
                numCtx.fillText(counterWeight,XStart+counterWgCoridorWd/2,counH+storeyHeight/2)
                point.t+=point.Tplus
                console.log(point.Tplus)
                lastH=point.y
                lastT=point.t
                rilTimePoints.push(point)
                
            },point.t))
        })
    },delay)
    drawGraphStamp=setTimeout(drawGraph, points[points.length-1].t+1000)
}
function drawGraph() {
    getComparison()
    setScales()
    let point0=rilTimePoints[0]
    let sekon=0
    
    charts.forEach((c)=>{
        c.fillStyle=chartBgColor
        c.clearRect(0,0,chartW,chartH)
        c.fillRect(0,0,chartW,chartH)
        c.lineWidth=0.5
        // alert(lastP.t)
        c.strokeStyle="lime"
        c.beginPath()
        c.moveTo(0,chartH/2)
        c.lineTo(chartW,chartH/2)
        c.stroke()
        c.strokeStyle="gray"

        for(let i=0;i<Math.ceil(scalesComparisons.time/200);i++) {
            c.beginPath()
            c.moveTo(i*chartXScale*200, 0)
            c.lineTo(i*chartXScale*200, chartH)
            c.stroke()
            sekon+=100
            console.log("berhasil")
        }
    })
    // let scale=0
    // scale=scalesComparisons.accel*accelScale
    // for(let i=0;i<scale;i++) {
    //     accelCtx.beginPath()
    //     accelCtx.moveTo(0,i*accelScale)
    //     accelCtx.lineTo(chartW,i*accelScale)
    //     accelCtx.stroke()
    // }
    // scale=scalesComparisons.velo*veloScale
    // for(let i=0;i<scale;i++) {
    //     veloCtx.beginPath()
    //     veloCtx.moveTo(0,i*veloScale)
    //     veloCtx.lineTo(chartW,i*veloScale)
    //     veloCtx.stroke()
    // }
    // scale=scalesComparisons.power*powerScale
    // for(let i=0;i<50;i++) {
    //     powerCtx.beginPath()
    //     powerCtx.moveTo(0,i/powerScale)
    //     powerCtx.lineTo(chartW,i/powerScale)
    //     powerCtx.stroke()
    // }
    
    charts.forEach((c)=>{
        c.beginPath()
        c.font="12px sans-serif"
        c.fillStyle="red"
        c.strokeStyle="red"
    })
    powerCtx.moveTo(point0.t*chartXScale,chartH/2-(point0.p*powerScale))
    accelCtx.moveTo(point0.t*chartXScale,chartH/2-(point0.a*accelScale))
    veloCtx.moveTo(point0.t*chartXScale,chartH/2-(point0.v*veloScale))
    yPosCtx.moveTo(point0.t*chartXScale,chartH/2-(point0.y*yPosScale))
    peCtx.moveTo(point0.t*chartXScale,chartH/2-(point0.pe*peScale))
    keCtx.moveTo(point0.t*chartXScale,chartH/2-(point0.ke*keScale))

    powerCtx.fillText("power usage", 10, 20)
    accelCtx.fillText("acceleration", 10, 20)
    veloCtx.fillText("velocity", 10, 20)
    yPosCtx.fillText("Y-position", 10, 20)
    peCtx.fillText("potential energy", 10, 20)
    keCtx.fillText("kinetic energy", 10, 20)

    
    for(let i=1;i<rilTimePoints.length;i++) {
        powerCtx.lineTo(rilTimePoints[i].t*chartXScale,chartH/2-(rilTimePoints[i].p*powerScale))
        accelCtx.lineTo(rilTimePoints[i].t*chartXScale,chartH/2-(rilTimePoints[i].a*accelScale))
        veloCtx.lineTo(rilTimePoints[i].t*chartXScale,chartH/2-(rilTimePoints[i].v*veloScale))
        yPosCtx.lineTo(rilTimePoints[i].t*chartXScale,chartH/2-(rilTimePoints[i].y*yPosScale))
        peCtx.lineTo(rilTimePoints[i].t*chartXScale,chartH/2-(rilTimePoints[i].pe*peScale))
        keCtx.lineTo(rilTimePoints[i].t*chartXScale,chartH/2-(rilTimePoints[i].ke*keScale))
    }
    charts.forEach((c)=>{
        c.stroke()
    })
    console.log(rilTimePoints)
    rilTimePoints=[]
}
function drawInitialComponents() {
    charts.forEach((chart)=>{
        chart.fillStyle=chartBgColor
        chart.strokeStyle=chartLnColor
        chart.fillRect(0,0,chartW,chartH)
    })
    simCtx.fillStyle=movingPartColor
    simCtx.strokeStyle=holderPartColor
    simCtx.font="18px arial"
    simCtx.fillStyle="gray"
    simCtx.beginPath()
    simCtx.arc(XStart+(counterWgCoridorWd/2)+15,YStart-floorHeight-(lineWidth*4)-15,15,0,(2*Math.PI))
    simCtx.fill()

    simCtx.beginPath()
    simCtx.arc(XEnd+(liftCoridorWd/2)-20,YStart-floorHeight-(lineWidth*4)-20,20,0,(2*Math.PI))
    simCtx.fill()

    simCtx.fillStyle="black"
    simCtx.fillRect(XEnd+(liftCoridorWd/2)-25,YStart-floorHeight-((lineWidth*4)+15),10,(lineWidth*4)+15)
    simCtx.fillRect(XStart+(counterWgCoridorWd/2)+10,YStart-floorHeight-((lineWidth*4)+15),10,(lineWidth*4)+15)
    simCtx.fillStyle="gray"

    const wireStartX=XStart+(counterWgCoridorWd/2)+15
    const wireEndX=XEnd+(liftCoridorWd/2)-20
    const wireStartY=YStart-floorHeight-(lineWidth*4)-30
    const wireEndY=YStart-floorHeight-(lineWidth*4)-40
    simCtx.strokeStyle="black"
    simCtx.beginPath()
    simCtx.moveTo(XStart+(liftCoridorWd/2)-(lineWidth*2),YStart)
    simCtx.bezierCurveTo(wireStartX-15,wireStartY+10.5,wireStartX-15,wireStartY,wireStartX,wireStartY)
    simCtx.lineTo(wireEndX,wireEndY)
    // simCtx.arcTo(XEnd+(liftCoridorWd/2)+10,YStart-floorHeight-(lineWidth*4)-40,XEnd+(liftCoridorWd/2)+20,YStart-floorHeight-(lineWidth*4)+40,40)
    simCtx.bezierCurveTo(wireEndX+20,wireEndY,wireEndX+20,wireEndY+14,wireEndX+20,wireEndY+80)
    simCtx.stroke()

    simCtx.fillRect(XEnd,YEnd-yPos,liftCoridorWd,storeyHeight)
    simCtx.fillRect(XStart,YStart+yPos,counterWgCoridorWd,storeyHeight)
    simCtx.drawImage(load, XEnd+(liftCoridorWd/2)-25,YEnd+storeyHeight-50-yPos,50,50)

    simCtx.beginPath()
    simCtx.moveTo(XEnd+(liftCoridorWd/2),YStart)
    simCtx.lineTo(XEnd+(liftCoridorWd/2),YEnd-yPos)
    simCtx.stroke()

    simCtx.beginPath()
    simCtx.moveTo(XStart+(counterWgCoridorWd/2),YStart)
    simCtx.lineTo(XStart+(counterWgCoridorWd/2),YStart+yPos)
    simCtx.stroke()
}
window.onload=()=>{
    resetVar()
    drawInitialComponents()
    // initUpward()
}

