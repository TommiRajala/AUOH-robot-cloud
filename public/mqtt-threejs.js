let threeView = document.getElementById('three_view');

let renderer = new THREE.WebGLRenderer();

let scene = new THREE.Scene();

let width = window.innerWidth;
let height = window.innerHeight;
let viewAngle = 45;
let near = 0.1; // meters
let far = 1000; // meters

let camera = new THREE.PerspectiveCamera(viewAngle, width / height, near, far);
camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 5;
camera.up = new THREE.Vector3(0, 0, 1);
camera.lookAt(scene.position);

renderer.setSize(width, height);
threeView.appendChild(renderer.domElement);



// Plane
{
    let geometry = new THREE.PlaneBufferGeometry(40, 40);
    let material = new THREE.MeshPhongMaterial({
        color: 0xAAAAAA,
        specular: 0x101010
    });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -1;
    scene.add(mesh);
}

// TEST CUBE
{
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshLambertMaterial({
        color: 0xff0000
    });
    let mesh = new THREE.Mesh(geometry, material);
    //scene.add(mesh);
}

let light = new THREE.DirectionalLight(0xAAAAAA, 1.5);
light.position.x = 10;
light.position.y = 10;
light.position.z = 10;
light.lookAt(scene.position);
scene.add(light);
scene.add(new THREE.HemisphereLight(0x443333, 0x111122));
scene.background = new THREE.Color(0xFFFFFF);
scene.fog = new THREE.Fog(0xFFFFFF, 3, 30);

const stlLoader = new THREE.STLLoader();
const loadStl = (url) => {
    return new Promise((resolve) => {
        stlLoader.load(url, resolve);
    });
};

let dark = new THREE.MeshLambertMaterial({
    color: 0x111111
});

let yellow = new THREE.MeshLambertMaterial({
    color: 0xFFFF00
});

let joints = [];
const loadGeometries = async () => {
    {
        let geometry = await loadStl('./FANUC_R2000iA165F-STL/BASE.stl');
        joints.push(new THREE.Mesh(geometry, dark));
        joints[0].geometry.scale(0.001, 0.001, 0.001);
        //scene.add(joints[0]);
    }
    {
        let geometry = await loadStl('./FANUC_R2000iA165F-STL/J1-1.stl');
        let geometry2 = await loadStl('./FANUC_R2000iA165F-STL/J1-2.stl');
        geometry.merge(geometry2);
        joints.push(new THREE.Mesh(geometry, yellow));
        joints[1].geometry.scale(0.001, 0.001, 0.001);
    }
    {
        let geometry = await loadStl('./FANUC_R2000iA165F-STL/J2.stl');
        joints.push(new THREE.Mesh(geometry, yellow));
        joints[2].geometry.scale(0.001, 0.001, 0.001);
    }
    {
        let geometry = await loadStl('./FANUC_R2000iA165F-STL/J3.stl');
        joints.push(new THREE.Mesh(geometry, yellow));
        joints[3].geometry.scale(0.001, 0.001, 0.001);
    }
    {
        let geometry = await loadStl('./FANUC_R2000iA165F-STL/J4.stl');
        joints.push(new THREE.Mesh(geometry, yellow));
        joints[4].geometry.scale(0.001, 0.001, 0.001);
    }
    {
        let geometry = await loadStl('./FANUC_R2000iA165F-STL/J5.stl');
        joints.push(new THREE.Mesh(geometry, yellow));
        joints[5].geometry.scale(0.001, 0.001, 0.001);
    }
};

loadGeometries().then(() => {
    joints[1].geometry.translate(0, -0.282, 0);
    joints[2].geometry.translate(-0.312, -0.670, 0.117);
    joints[3].geometry.translate(-0.26869, -1.74413, 0.19685);
    joints[4].geometry.translate(-1.31519, -1.96913, 0.00015);
    joints[5].geometry.translate(-1.54869, -1.96913, 0.08715);
    //joints[6].geometry.translate(-1.76369, -1.96913, 0.02047);

    scene.add(joints[0]);
    joints[0].rotation.set(THREE.Math.degToRad(90), 0, 0);

    offsets.push(new THREE.Group());
    offsets[0].position.set(0, 0.282, 0);
    joints[0].add(offsets[0]);
    offsets[0].add(joints[1]);

    offsets.push(new THREE.Group());
    offsets[1].position.set(0.312, 0.388, -0.117);
    joints[1].add(offsets[1]);
    offsets[1].add(joints[2]);

    offsets.push(new THREE.Group());
    offsets[2].position.set(-0.04331, 1.74413 - 0.670, -0.19685 + 0.117);
    joints[2].add(offsets[2]);
    offsets[2].add(joints[3]);

    offsets.push(new THREE.Group());
    offsets[3].position.set(1.31519 - 0.26869, 1.96913 - 1.74413, -0.00015 + 0.19685);
    joints[3].add(offsets[3]);
    offsets[3].add(joints[4]);

    offsets.push(new THREE.Group());
    offsets[4].position.set(1.54869 - 1.31519, 0, -0.08715 + 0.00015);
    joints[4].add(offsets[4]);
    offsets[4].add(joints[5]);

    //joints[1].rotation.set(0, THREE.Math.degToRad(45), 0);
    //joints[2].rotation.set(0, 0, THREE.Math.degToRad(45));
});
let offsets = [];

const orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
orbitControls.target = new THREE.Vector3(0, 0, 0);

const animate = () => {
    requestAnimationFrame(animate);
    orbitControls.update();
    renderer.render(scene, camera);
};
animate();

const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

window.onresize = resize;

//const mqtt_client = mqtt.connect('wss://auoh-mqtt-broker.herokuapp.com');
const mqtt_client = mqtt.connect('wss://auoh-mqtt-test.herokuapp.com');
mqtt_client.on('connect', () => {
    console.log('connected to mqtt broker');
    //mqtt_client.subscribe('joints');
    mqtt_client.subscribe('Robot data');
});

mqtt_client.on('message', (topic, message) => {
    if (joints.length == 6) {
        const joint_data = JSON.parse(message);

        joints[1].rotation.set(0, THREE.Math.degToRad(joint_data.joints[0]), 0);
        joints[2].rotation.set(0, 0, THREE.Math.degToRad(joint_data.joints[1]));
        joints[3].rotation.set(0, 0, THREE.Math.degToRad(joint_data.joints[2]) - THREE.Math.degToRad(joint_data.joints[1]));
        joints[4].rotation.set(THREE.Math.degToRad(joint_data.joints[3]), 0, 0);
        joints[5].rotation.set(0, 0, THREE.Math.degToRad(joint_data.joints[4]));
    }
});
/* ORIGOS AND ROTATION AXISES
J1: [0, 282,0] Y
J2: [312, 670, -117] Z
J3: [268.69, 1744.13, -196.85] Z
J4: [1315.19, 1969.13, 0.15] X
J5: [1548.69, 1969.13, 87.15] Z
J6: [1763.69, 1969.13, 20.47] X
*/