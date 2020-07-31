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



//var waypoints = [[5,5],[1,-1],[-1,-1],[-1,1]]

var loader = new THREE.GLTFLoader();
function CreateGroundEnemy(y) {
    loader.load('/Proyecto final/models/CesiumMan.gltf', function ( obj ) {
            obj.scene.rotation.x = Math.PI / 2;
            obj.scene.position.set(0,y,0);
            obj.scene.hitpoints = 3;
            obj.scene.milestone = 0;
            scene.add( obj.scene );
            groundGroup.add(obj.scene);
            groundArray.push(obj.scene);


    
    
    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );
}

function CreatFlyerEnemy(y){

    loader.load('/Proyecto final/models/Duck.gltf', function ( obj ) {

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
    
    } );
}

function moveEnemies(array ) {
    array.forEach(element => {
        //element.position.y-=0.05;
        moveEnemy(element);
    });
    if(currentEnemies < enemyLimit){
    currentEnemies++;
    CreateGroundEnemy(currentEnemies); 
    CreatFlyerEnemy(currentEnemies*2);
    } 

}

function createArenaGeometry( arena ){

    this.arena = [];

    for (var r = 0; r < arena.fullH; r++)
    {
        this.arena[r] = [];
        
        for (var c = 0; c < arena.fullW; c++)
        {
            var position = new THREE.Vector3(S_W * c, S_W * r, 0);
            var material = new THREE.MeshBasicMaterial({
                color: 0x003300
            });
            
            if (! arena.fullToNormal([r, c]))
            {
                material.opacity = 0;
            }
            
            var geom = new THREE.CubeGeometry(S_W, S_W, 0.001, 1, 1, 1);
            var square = new THREE.Mesh(geom, material);
            square.position = position;
            
            //var squareModel = Loader.get( 'square' );
            //squareModel.position = position.clone();
            //Geometry.scene.add( squareModel );
            
            // Location in game... null if outside buildable area
            square.coord = arena.fullToNormal([r, c]);
            square.fullCoord = [r, c];
            
            this.arena[r][c] = square;
        }
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
    //enemy model must dissapear
    //live count must lower
    //console.log("win");
    life--;
    enemy.position.y = 0;
    enemy.milestone=4;
    console.log(life);
}

/**
 * Creates an instance of Tower
 *
 * @constructor
 * @this {Tower}
 * @param {player} player The owner of this tower.
 * @param {array} coord The coord of this tower in the arena.
 * @param {string} type The type of this tower.
 * @param {number} level The current level of this tower.
 */
function Tower( player, coord, type, level ){
    
    // Add all default values to this tower instance
    _.defaults(this, TOWER[type][level]);
    
    this.type = type;
    this.level = level;
    this.coord = coord; // Coordinate on game board
    
    this.busy = 0;

};

// Default tower values
TOWER = {  
    GATTLING : [
        {
            name : 'Gatling Tower',
            damage : 6,
            range : 180,
            cooldown : 1000, // Milliseconds?
            cost : 5,
            attack : 'gatling',
        }
    ],
    MISSILE : [
        {
            damage : 70,
            range : 300,
            cooldown : 3000,
            cost : 15,
            attack : 'missile'
        }
    ]   
};

function applyDamage ( arena, enemies, towers, delta )
{
    
    for (var id in towers)
    {
        var tower = towers[id];
        tower.busy = Math.max(tower.busy - delta, 0);
            
        for (var id in enemies )
        {       
            var enemy = enemies[id];
        
            if (! enemy)
            {
                continue;
            }
            
            var coord = arena.normalToFull( tower.coord );
            
            var t = new THREE.Vector2( coord[1] * S_W,
                                       coord[0] * S_W);
            
            var e = new THREE.Vector2( enemy[MESH].position.x,
                                       enemy[MESH].position.y);
            
            var dist = e.distanceTo( t );
            
            // Minimum distance is (usually) 60, the size of a square.
            if (dist < tower.range)
            { 
                if ('gattling' == tower.attack)
                {
                    var dir = new THREE.Vector2( t.x - e.x, t.y - e.y );
                    dir.normalize();
                    
                    if (tower[TOP])
                    {
                        var theta = Math.atan( dir.y / dir.x );
                        if (dir.x < 0)
                        {  
                            theta -= PI;   
                        }     
                        tower[TOP].rotation.z = theta;     
                        enemy.damage( tower.damage );     
                    }     
                }
                else if ('missile' == tower.attack)
                { 
                    var dir = new THREE.Vector2( t.x - e.x, t.y - e.y );
                    dir.normalize();
            
                    if (tower[TOP])
                    {
                        var theta = Math.atan( dir.y / dir.x );
                        if (dir.x < 0)
                        {
                            theta -= PI;
                        }
                        tower[TOP].rotation.z = theta;
                        Geometry.createProjectile( arena, tower, enemy );  
                    } 
                }  
                tower.busy = tower.cooldown;
                break;  
            }  
        }      
    }   
}

function createProjectile ( arena, tower, enemy )
{  
    var f;
    var speed = 0.2;
    var damage = tower.damage;

    // Tower location
    var coord = arena.normalToFull( tower.coord );
    var source = new THREE.Vector2( coord[1] * S_W, coord[0] * S_W );
    
    // Projectile object
    var proj = Loader.get( 'torpedo' );
    
    proj.position.x = source.x;
    proj.position.y = source.y;
    
    Geometry.scene.add( proj );
    
    f = Idle.add( function( delta )
    {
        
        var source = proj.position;
        var target = enemy[MESH].position;
        
        // Vector between enemy and projectile
        var path = new THREE.Vector3().sub(target, source);
        path.z = 0;

        // Vector to travel
        var dist = path.clone().normalize().multiplyScalar( speed * delta );
        
        // Rotate projectile
        var theta = Math.atan( dist.y / dist.x );
        
        if (dist.x > 0)
        {
            theta -= PI;
        }
        
        proj.rotation.z = theta;
        // If the target is dead, or if the projectile has reached the target
        if ( enemy.health <= 0 ||
            ( path.length() <= dist.length() ) ||
            ( path.length() <= 12 ))
        {
            // Remove the projectile and deal damage
            Geometry.createExplosion( target );
            Geometry.scene.remove( proj );
            Idle.remove( f );
            enemy.damage( damage );      
        }
        else
        { 
            proj.position.x += dist.x;
            proj.position.y += dist.y; 
        } 
    });
    
};

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
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Set the background color 
    scene.background = new THREE.Color( 0.0, 0.0, 0.0 );
    // scene.background = new THREE.Color( "rgb(100, 100, 100)" );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 24;
    scene.add(camera);

    // Create a group to hold all the objects
    groundGroup = new THREE.Object3D;
    
    // Add a directional light to show off the objects
    let light = new THREE.PointLight( 0xffffff, 1.0, 100000);
    // let light = new THREE.DirectionalLight( "rgb(255, 255, 100)", 1.5);

    // Position the light out from the scene, pointing at the origin
    light.position.set(0, 0, 0);
    //light.target.position.set(0,-2,0);
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
