let renderer = null,
    scene = null,
    camera = null,
    towerGroup = null,
    groundGroup = null,
    airGroup = null,
    bult = null,
    bul = null,

    groundArray = [],
    airArray = [],
    airturretArray = [],
    groundturretArray = [];

var life = 20;
var targetYPos = -15;
var ystart = 10;
var delta = 0.05;
var currentLevel = 1;
var currentEnemies = 0;

var gbulletfired = 0;
var gbulletMax = 1;

var abulletfired = 0;
var abulletMax = 1;

var atargetedEnemy=0;
var gtargetedEnemy=0;
var levelLimit = 5;

var enemyspeed = 0.15;
var enemyLimit = 5;

var score = 0;


var loader = new THREE.GLTFLoader();

function CreateGroundEnemy(y) {
    loader.load('/models/CesiumMan.gltf', function (obj) {
        obj.scene.rotation.x = Math.PI / 2;
        obj.scene.position.set(Math.random()*3, y, 0);
        obj.scene.milestone = 0;
        scene.add(obj.scene);
        //groundGroup.add(obj.scene);
        groundArray.push(obj.scene);

    }, undefined, function (error) {
        console.error(error);
    });
}

function CreatFlyerEnemy(y) {
    loader.load('/models/Duck.gltf', function (obj) {
        obj.scene.rotation.x = Math.PI / 2;
        obj.scene.rotation.y = -Math.PI / 2;
        obj.scene.position.set(-3.2, y + 2, 3);
        obj.scene.milestone = 0;
        scene.add(obj.scene);
        //airGroup.add(obj.scene);
        airArray.push(obj.scene);
        //obj.scene = obj.scene.clone();

    }, undefined, function (error) {
        console.error(error);
    });
}

function createEnemies() {
    for (currentEnemies; currentEnemies < enemyLimit; currentEnemies++) {
        CreateGroundEnemy(10 + currentEnemies);
        CreatFlyerEnemy(10 + currentEnemies * 2);
    };
}

function moveEnemies(array) {
    array.forEach(element => {
        moveEnemy(element);
    });
}

function FireGroundTurret(array, enemy) {
    if (array[0] !== undefined) {
        MoontextureUrl = "/models/CesiumMan_img0.jpg";
        Moontexture = new THREE.TextureLoader().load(MoontextureUrl);
        Moonmaterial = new THREE.MeshPhongMaterial({
            map: Moontexture
        });
        for (var i = 0; i < array.length; i += 2) {
            if (gbulletfired < gbulletMax) {
                let bullet = new THREE.SphereGeometry(.1, 15, 15);
                bult = new THREE.Mesh(bullet, Moonmaterial);
                bult.position.set(array[i], array[i + 1], 0);
                scene.add(bult);
                //groundGroup.add(bult);
            }
        }
        gbulletfired = 1;

        movegroundProj(bult, groundArray[gtargetedEnemy]);
    }


}

function movegroundProj(bult, enemy) {

    if (bult.position.x < enemy.position.x) {
        bult.position.x += 0.05;
    }
    if (bult.position.x > enemy.position.x) {
        bult.position.x -= 0.05;
    }
    if (bult.position.y < enemy.position.y) {
        bult.position.y += 0.05;
    }
    if (bult.position.y > enemy.position.y) {
        bult.position.y -= 0.05;
    }
    if (bult.position.x > enemy.position.x - .051 && bult.position.x < enemy.position.x + .051 &&
        bult.position.y > enemy.position.y - .051 && bult.position.y < enemy.position.y + .051) {

        scene.remove(bult);
        enemyLoose(enemy, groundArray);
        bult.position.set(-100, -100);
        enemy.position.set(100,1000,10000);
        if(groundArray.length==gtargetedEnemy){
            gtargetedEnemy = 0;
        }
        gbulletfired = 0;
    }
}

function FireAirTurret(array, enemy) {
    if (array[0] !== undefined) {
        MoontextureUrl = "/models/CesiumMan_img0.jpg";
        Moontexture = new THREE.TextureLoader().load(MoontextureUrl);
        Moonmaterial = new THREE.MeshPhongMaterial({
            map: Moontexture
        });

        for (var i = 0; i < array.length; i += 2) {
            if (abulletfired < abulletMax) {
                let bulle = new THREE.BoxGeometry(.1, .1, .1);
                bul = new THREE.Mesh(bulle, Moonmaterial);
                bul.position.set(array[i], array[i + 1], 0);
                scene.add(bul);
                //towerGroup.add(bul);
            }
        }
        abulletfired = 1;

        moveairProj(bul, airArray[atargetedEnemy]);
    }

}

function moveairProj(bul, enemy) {
    if (bul.position.x < enemy.position.x) {
        bul.position.x += 0.05;
    }
    if (bul.position.x > enemy.position.x) {
        bul.position.x -= 0.05;
    }
    if (bul.position.y < enemy.position.y) {
        bul.position.y += 0.05;
    }
    if (bul.position.y > enemy.position.y) {
        bul.position.y -= 0.05;
    }
    if (bul.position.z < enemy.position.z) {
        bul.position.z += 0.05;
    }
    if (bul.position.z > enemy.position.z) {
        bul.position.z -= 0.05;
    }
    //console.log("bullet: "+ bul.position.y+" enemy: "+ enemy.position.y)
    if (bul.position.x > enemy.position.x - .051 && bul.position.x < enemy.position.x + .051 &&
        bul.position.y > enemy.position.y - .051 && bul.position.y < enemy.position.y + .051) {

        scene.remove(bul);
        enemyLoose(enemy, airArray);
        bul.position.set(-100, -100);
        enemy.position.set(100,1000,10000);
        if(airArray.length == atargetedEnemy){
            atargetedEnemy = 0;
        }
        abulletfired = 0;
    }

}


function moveEnemy(enemy) {
    switch (enemy.milestone) {
        case 0:
            enemy.position.y -= enemyspeed;
            if (enemy.position.y <= 5) {
                enemy.milestone = 1;
            }
            break;
        case 1:
            enemy.position.x -= enemyspeed
            if (enemy.position.x <= 0) {
                enemy.milestone = 2;
            }
            break;
        case 2:
            enemy.position.y -= enemyspeed
            if (enemy.position.y < -10) {
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

function enemyWin(enemy) {
    life--;
    enemy.position.y = 11;
    enemy.milestone = 4;
    /*
    console.log(enemy);
    */

    scene.remove(enemy);

    document.getElementById("status").innerHTML = "Lives: " + life;

    currentEnemies -= .5;
    if (currentEnemies == 0 && life > 0) {
        currentLevel += 1
        console.log("new level: " + currentLevel)
        level(currentLevel);
    }
}

function enemyLoose(enemy, array) {

    /*
    console.log(enemy);
    scene.remove(enemy);
    */
    score += 50;
    scene.remove(enemy);
    array.shift();
    //array[0].milestone = 4;
    document.getElementById("prompt").innerHTML = "Score: " + score;
    currentEnemies -= .5;

    if (currentEnemies == 0 && life > 0) {
        currentLevel += 1
        console.log("new level: " + currentLevel)
        level(currentLevel);
    }
}

function animate() {
    moveEnemies(groundArray);
    moveEnemies(airArray);

    groundArray.forEach(element => {
        FireGroundTurret(groundturretArray, element);
    });

    airArray.forEach(element => {
        FireAirTurret(airturretArray, element);
    });

}

function run() {


    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(scene.children);

    for (var i = 0; i < intersects.length; i++) {

        intersects[i].object.material.color.set(0xff0000);

    }


    requestAnimationFrame(function () {
        run();
    });
    renderer.render(scene, camera);
    var orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.enabled = true;
    orbitControls.enableZoom = true;
    orbitControls.enablePan = true;
    //orbitControls.enableDamping = true;
    orbitControls.autoRotate = false;
    orbitControls.enableKeys = true;
    orbitControls.panSpeed = 0.005;
    orbitControls.zoomSpeed = 0.005;
    orbitControls.rotateSpeed = 0.005;
    orbitControls.keyPanSpeed = 0.05;
    orbitControls.maxZoom = 2.0;
    //orbitControls.dampingFactor = 0.99;


    animate();
}

function createScene(canvas) {
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    });
    renderer.setSize(canvas.width, canvas.height);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(1.0, 1.0, 0.5);
    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000);
    camera.position.z = 24;
    scene.add(camera);
    let light = new THREE.AmbientLight(0xffffff, 1.0, 100000);
    light.position.set(0, 0, 0);
    scene.add(light);
    let ambientLight = new THREE.AmbientLight(0xffccaa, 0.2);
    scene.add(ambientLight);

    towerGroup = new THREE.Object3D;
    groundGroup = new THREE.Object3D;
    airGroup = new THREE.Object3D;
    groundGroup.position.set(5, 10, 0);
    airGroup.position.set(0, 10, 0);
 
    var planeTexture = "/resources/images/path.jpg";
    let texture = new THREE.TextureLoader().load(planeTexture);
    let material = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide
    });
    geometry = new THREE.PlaneGeometry(15, 20, 15, 20);
    var plane = new THREE.Mesh(geometry, material);
    plane.position.set(0, 0, 0);

    scene.add(plane);
    scene.add(groundGroup);
    scene.add(airGroup);
    scene.add(towerGroup);

    level(currentLevel);
}

function level(number) {
    document.getElementById("title").innerHTML = "Level: " + number;
    enemyLimit = number;

    groundArray = [];
    airArray = [];

    createEnemies();
}

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function createTurret(event) {
    let canvas = document.getElementById("webglcanvas");
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = ((event.clientX / canvas.width) * 2 - 1)*15;
    mouse.y = ((event.clientY / canvas.height) * -2 + 1)*10 ;


    MoontextureUrl = "/models/CesiumMan_img0.jpg";
    Moontexture = new THREE.TextureLoader().load(MoontextureUrl);
    Moonmaterial = new THREE.MeshPhongMaterial({
        map: Moontexture
    });

    switch (event.which) {
        case 1:
            let geom = new THREE.SphereGeometry(1, 15, 15);
            let turr = new THREE.Mesh(geom, Moonmaterial);
            turr.position.set(mouse.x, mouse.y, 0);
            towerGroup.add(turr);
            groundturretArray.push(mouse.x);
            groundturretArray.push(mouse.y);
            break;

        case 3:
            let g = new THREE.BoxGeometry(1.5, 1.5, 1.5);
            let tur = new THREE.Mesh(g, Moonmaterial);
            tur.position.set(mouse.x, mouse.y, 0);
            towerGroup.add(tur);
            airturretArray.push(mouse.x);
            airturretArray.push(mouse.y);
            break;

    }

    console.log(mouse.x);
    console.log(mouse.y);
}


window.addEventListener('mousedown', createTurret, false);