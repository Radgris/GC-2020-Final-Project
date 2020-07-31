let renderer = null, 
scene = null, 
camera = null,
towerGroup = null,
groundGroup = null,
airGroup = null,
groundArray=[],
airArray=[];

var enemyspeed = 0.12;

var life = 100;

var targetYPos = -15;
var ystart = 10;
var delta = 0.05;
var currentEnemies=0;
var enemyLimit = 5;
var levelLimit = 5;

var loader = new THREE.GLTFLoader();
function CreateGroundEnemy(y) {
    loader.load('/models/CesiumMan.gltf', function ( obj ) {
            obj.scene.rotation.x = Math.PI / 2;
            obj.scene.position.set(0,y,0);
            obj.scene.hitpoints = 3;
            obj.scene.milestone = 0;
            scene.add( obj.scene );
            groundGroup.add(obj.scene);
            groundArray.push(obj.scene);
    
    }, undefined, function ( error ) {
        console.error( error );
    });
}

function CreatFlyerEnemy(y){

    loader.load('/models/Duck.gltf', function ( obj ) {

            obj.scene.rotation.x = Math.PI / 2;
            obj.scene.rotation.y = -Math.PI / 2;
            obj.scene.position.set(0,y,3);
            obj.scene.hitpoints = 3;
            obj.scene.milestone = 0;
            scene.add( obj.scene );
            airGroup.add(obj.scene);
            airArray.push(obj.scene);
            obj.scene = obj.scene.clone();

    }, undefined, function ( error ) {
        console.error( error );
    });
}

function moveEnemies(array ) {
    array.forEach(element => {
        moveEnemy(element);
    });
    if(currentEnemies < enemyLimit){
    currentEnemies++;
    CreateGroundEnemy(currentEnemies); 
    CreatFlyerEnemy(currentEnemies*2);
    } 
}

function moveEnemy(enemy) {
    switch(enemy.milestone){
        case 0:
            enemy.position.y -= enemyspeed;
            if(enemy.position.y <= -9)
            {
                enemy.milestone = 1;
            }
            break;
        case 1:
            enemy.position.x-= enemyspeed
            if(enemy.position.x <= -3)
            {
                enemy.milestone = 2;
            }
            break;
        case 2:
            enemy.position.y -= enemyspeed
            if(enemy.position.y < -20)
            {
                enemy.milestone = 3;
            }
            break;
        case 3:
            enemyWin(enemy);
            break;
        case 4:
            break;
    }
}

function enemyWin(enemy){
    life--;
    enemy.position.y = 1;
    enemy.milestone = 4;
    console.log(life);
    //scene.remove(enemy.scene)
}

function animate() 
{
    moveEnemies(groundArray);
    moveEnemies(airArray);  
}

function run() {
    requestAnimationFrame(function() { run(); });
    renderer.render( scene, camera );
    var orbitControls = new THREE.OrbitControls( camera, renderer.domElement );
    orbitControls.enabled = true;
    orbitControls.enableZoom = true;
    orbitControls.enablePan = true;
    //orbitControls.enableDamping = true;
    orbitControls.autoRotate = false;
    orbitControls.enableKeys = true;
    orbitControls.panSpeed=0.005;
    orbitControls.zoomSpeed=0.005;
    orbitControls.rotateSpeed=0.005;
    orbitControls.keyPanSpeed=0.05;
    orbitControls.maxZoom = 2.0;
    //orbitControls.dampingFactor = 0.99;

    animate();
    
}

function createScene(canvas)
{    
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
    renderer.setSize(canvas.width, canvas.height);
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0.0, 0.0, 0.0 );
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 24;
    scene.add(camera);
    let light = new THREE.PointLight( 0xffffff, 1.0, 100000);
    light.position.set(0, 0, 0);
    scene.add(light);
    let ambientLight = new THREE.AmbientLight(0xffccaa, 0.2);
    scene.add(ambientLight);

    towerGroup = new THREE.Object3D;
    groundGroup = new THREE.Object3D;
    airGroup = new THREE.Object3D;
    groundGroup.position.set(5,10,0);
    airGroup.position.set(0,10,0);

    geometry = new THREE.PlaneGeometry( 15, 20, 15, 20 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    var plane = new THREE.Mesh( geometry, material );
    plane.position.set(0,0,0);
    scene.add( plane );     
    scene.add(groundGroup);  
    scene.add(airGroup); 

    CreateGroundEnemy();
    CreatFlyerEnemy();
    
}
