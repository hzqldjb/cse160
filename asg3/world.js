

var VSHADER_SOURCE =`

precision mediump float;
attribute vec4 a_Position;
attribute vec2 a_UV;
varying vec2 v_UV;
uniform mat4 u_ModelMatrix;
uniform mat4 u_GlobalRotateMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;

  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;

    v_UV = a_UV;

  }`;

// //GPU
// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform int u_whichTextures;
  void main() {

     if (u_whichTextures ==-2){
        gl_FragColor = u_FragColor;
    }
     else if(u_whichTextures ==-1){
       gl_FragColor = u_FragColor;
     }
     else if(u_whichTextures ==0){
       gl_FragColor = texture2D(u_Sampler0,v_UV);
     }
        else{gl_FragColor = vec4(1,1,1,1);
   }
  
  //gl_FragColor = u_FragColor;
  //gl_FragColor = vec4(v_UV,1.0,1.0);
  //gl_FragColor = texture2D(u_Sampler0, v_UV);

  }`;

    // gl_FragColor = u_FragColor;
    // gl_FragColor = vec4(v_UV,1.0,1.0);
    // gl_FragColor = texture2D(u_Sampler0, v_UV);


 // if (u_whichTexture ==-2){
    //   gl_FragColor = u_FragColor;
    // }
    // else if(u_whichTexture ==-1){
    //   gl_FragColor = vec4(v_UV,1.0,1.0);
    // }
    // else if(u_whichTexture ==0){
    //   gl_FragColor = texture2D(u_Sampler0,v_UV);
    // }
    // else{gl_FragColor = vec4(1,.2,.2,1);
    // }



let canvas;
let gl;
let a_Position;
let a_UV
let u_FragColor;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_whichTexture;
//let textureNum;



function setupWebGL(){
 // Retrieve <canvas> element
   canvas = document.getElementById('webgl');


   gl = canvas.getContext("webgl",{ preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}


function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
   a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_FragColor
   u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }


   u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }


  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }


    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');

    if(!u_Sampler0){
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }


  u_whichTextures = gl.getUniformLocation(gl.program, 'u_whichTextures');

    if(!u_whichTextures){
    console.log('Failed to get the storage location of u_whichTextures');
    return false;
  }


  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}





// const POINT = 0;
// const TRIANGLE = 1;
// const CIRCLE =2;

let g_selectedColor = [0.0,1.0,1.0,1.0];
// let g_seletedsize = 10;
// let g_seletedType = POINT;
let g_seletedSegments = 10;
let g_animation = false;
let g_globalAngle = 0; 


let g_yellowAngle = 0;

function addActionsForHtmlUI(){

  document.getElementById('off').onclick = function(){g_animation=false;};
    document.getElementById('on').onclick = function(){g_animation=true;};


  document.getElementById('angleSlider').addEventListener('mouseup',function() {g_globalAngle = this.value; renderAllShapes();});



  document.getElementById('yellowSlider').addEventListener('mouseup',function() {g_yellowAngle = this.value; renderAllShapes();});


}




 
//function initTextures(gl,n){ 

function initTextures(){ 

  // var texture = gl.createTexture();
  // if(!texture){
  //   console.log('Failed to create the texture object');
  //   return false;
  // }
  // var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');

  //   if(!u_Sampler0){
  //   console.log('Failed to get the storage location of u_Sampler0');
  //   return false;
  //}

  var image = new Image(); // Create an image object
    if(!image){
    console.log('Failed to create the image object');
    return false;
  }



  //image.onload = function(){ sendTextureToGLSL(gl, n, texture, u_Sampler0, image); }; // Tell the browser to load an image
  image.onload = function(){ sendTextureToGLSL(image); }; // Tell the browser to load an image

  image.src = 'mod.jpg';


  //add mmore
  return true;
}

  //function sendTextureToGLSL(gl, n, texture, u_Sampler0, image){
  function sendTextureToGLSL(image){

     var texture = gl.createTexture();
  if(!texture){
    console.log('Failed to create the texture object');
    return false;
  }


  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, -1); // Flip the image's y axis
// Enable the texture unit 0

  gl.activeTexture(gl.TEXTURE0);
 // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

 // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
 // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

// Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);

  console.log('finished loadTeture');

}



let g_camera=null;
//CPU
function main() {

 // g_camera = new Camera();

  setupWebGL();

  connectVariablesToGLSL();

  addActionsForHtmlUI();


  document.onkeydown = keydown;


  //initTextures(gl,0);
    initTextures();



  //canvas.onmousemove = function(ev){if(ev.buttons ==1) {click(ev)}};

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);
  g_camera = new Camera();

 renderAllShapes();
 //requestAnimationFrame(tick);
}



// moving----

var g_startTime = performance.now()/600;
var g_seconds = performance.now()/600-g_startTime;

function tick(){

 g_seconds = performance.now()/600-g_startTime;

 update();

 //console.log(g_seconds);

  renderAllShapes();

  requestAnimationFrame(tick);
}


function update(){
  if(g_animation){
    g_yellowAngle = (5*Math.sin(g_seconds));
  }
}

// ----



function keydown(ev){

  //var g_Camera = new Camera();

  if(ev.keyCode == 87){
    //g_Camera.eye.elements[0] += 0.2;
    console.log(ev.keyCode);
    g_camera.forward();
  }
  if(ev.keyCode == 83){
    //g_eye[0] -= 0.2;
    g_camera.back();

  }
  if(ev.keyCode == 65){
    g_camera.left();

  }

  if(ev.keyCode == 68){
    g_camera.right();

  }

   if(ev.keyCode == 81){
    g_camera.panleft();

  }

  if(ev.keyCode == 69){
    g_camera.panright();

  }


  renderAllShapes();
  console.log(ev.keyCode);

}

// var g_eye=[0,0,3];
// var g_at=[0,0,-100];
// var g_up = [0,1,0];

var g_map =[ 

[1,1,1,1,1,1,1,1],
[1,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,1],
[1,0,0,1,1,0,0,1],
[1,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,1],
[1,0,0,0,1,0,0,1],
[1,0,0,0,0,0,0,1],


];

function drawMap(){

  for(x=0;x<32;x++){
    for(y=0;y<32;y++){
      //if(g_map[x][y] ==1){
        if(x==0 || y==0 || x == 30 || y == 30){
        let body = new Cube();
        body.color = [1,1,1,1];
        body.textureNum = 0;

        body.matrix.translate(x/3,-1.5,y/3);

        body.matrix.scale(0.45,.9,0.45);
        body.render();
      }

    }
  }
}






function renderAllShapes(){



  var startTime = performance.now();


  var globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix,false,globalRotMat.elements);


  var projMat = new Matrix4();
  projMat.setPerspective(60, canvas.width/canvas.height, .1, 1000);

  gl.uniformMatrix4fv(u_ProjectionMatrix,false,projMat.elements);


  var viewMat = new Matrix4();
  //viewMat.setLookAt(0,0,3, 0,0,-1, 0,1,0);

 // var g_camera = new Camera();

  viewMat.setLookAt(
    g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
    g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
    g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]
    );


  gl.uniformMatrix4fv(u_ViewMatrix,false,viewMat.elements);




  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.clear(gl.COLOR_BUFFER_BIT);


//draw body cube
  var body = new Cube();

  body.color = [0,1,1,1];
  body.textureNum = -2;
  body.matrix.translate(5.5,-1.5,5.5);

  body.matrix.scale(0.5,.5,0.5);


  body.render();


 var body = new Cube();

  body.color = [1,0,1,1];
  body.textureNum = -2;
  body.matrix.translate(6,-1.5,5.5);

  body.matrix.scale(0.5,.5,0.5);


  body.render();



// ground

  var ground = new Cube();

  ground.color = [0,255,0,.1];
  ground.textureNum = -1;

  // ground.matrix.translate(-.5,0,-.5);

  // ground.matrix.translate(0,-1.5,-5);
   ground.matrix.translate(-20,-1.5,-20);

  ground.matrix.scale(500,.1,500);


  ground.render();


//sky

  var sky = new Cube();

  //sky.color = [0.5,0.8,0.9,0.8];

  sky.color = [0,0,1,0.08];

  sky.textureNum = -1;

  sky.matrix.scale(150,20,50);
  sky.matrix.translate(-.1,-.4,-.1);

  sky.render();



  drawMap();



  // //left front
  // var leg = new Cube();

  // leg.color = [1,1,1,0.85];

  // //  body.matrix.rotate(-0.5,1,0,0);
  // //leg.matrix.rotate(g_yellowAngle,0,0,1);
  // //leg.matrix.rotate(5*Math.sin(g_seconds),0,0,1);
  // //var clawMat = new Matrix4(leg.matrix);


  // leg.matrix.translate(0,-.75,0);
  // //leg.matrix.rotate(-0.5,1,0,0);
  // leg.matrix.scale(0.2,.3,0.2);

  // leg.render();





//。。。。。。。。。。。。。

//   var claw = new Cube();
//   claw.color = [1,1,1,1];

//   claw.matrix = leg.matrix;


//  claw.matrix.rotate(-1.5*g_yellowAngle+7,0,0,1);

//   claw.matrix.translate(-0.3,-0.35,0.02);

//   claw.matrix.scale(1.3,0.35,1);
//   claw.render();


//   //right front
//   var leg = new Cube();

//   leg.color = [0.4,0.4,0.4,0.9];

//   var clawMat = new Matrix4(leg.matrix);

//   leg.matrix.rotate(-g_yellowAngle,0,0,1);

//   //leg.matrix.rotate(-5*Math.sin(g_seconds),0,0,1);
//   leg.matrix.translate(-0.2,-.75,0.28);
//   //leg.matrix.rotate(-0.5,1,0,0);
//   leg.matrix.scale(0.2,0.3,0.2);

//   leg.render();





//   //draw a claw

//   var claw = new Cube();
//   claw.color = [1,1,1,1];

//   claw.matrix = leg.matrix;

//  // claw.matrix.rotate(3*Math.sin(g_seconds)+5,0,0,1);
//  claw.matrix.rotate(1.5*g_yellowAngle+7,0,0,1);


//   claw.matrix.translate(-0.3,-0.35,0.02);

//   claw.matrix.scale(1.3,0.35,1);
//   claw.render();


// //draw a backward right leg 
  
 

//   var leg = new Cube();

//   leg.color = [0.4,0.4,0.4,0.8];

//   var clawMat = new Matrix4(leg.matrix);
//   //leg.matrix.rotate(3*Math.sin(g_seconds),0,0,1);
//   leg.matrix.rotate(g_yellowAngle,0,0,1);

//   leg.matrix.translate(0.28,-.75,0.27);
//   //leg.matrix.rotate(-0.5,1,0,0);
//   leg.matrix.scale(0.2,0.3,0.2);

//   leg.render();

//   //draw a claw

//   var claw = new Cube();
//   claw.color = [1,1,1,1];

//   claw.matrix = leg.matrix;

//  claw.matrix.rotate(1.5*g_yellowAngle+7,0,0,1);


//   claw.matrix.translate(-0.3,-0.35,0.02);

//   claw.matrix.scale(1.3,0.35,1);
//   claw.render();

// //draw a backward left leg 
  
//   var leg2 = new Cube();

//   leg2.color = [0.4,0.4,0.4,0.8];
//   leg2.matrix.rotate(-g_yellowAngle,0,0,1);

//   //leg2.matrix.rotate(-3*Math.sin(g_seconds),0,0,1);
//   leg2.matrix.translate(0.26,-.75,0.03);
//   //leg.matrix.rotate(-0.5,1,0,0);
//   leg2.matrix.scale(0.2,0.3,0.2);

//   leg2.render();


//   var claw1 = new Cube();
//   claw1.color = [1,1,1,1];

//   claw1.matrix = leg2.matrix;

//  claw1.matrix.rotate(1.5*g_yellowAngle+7,0,0,1);


//   claw1.matrix.translate(-0.3,-0.35,0.02);

//   claw1.matrix.scale(1.3,0.35,1);
//   claw1.render();

// //head
//   var head = new Cube();
//   head.color = [0.4,0.4,0.4,0.8];

//  var leye = head.matrix; 
//   head.matrix = body.matrix;
//   head.matrix.rotate(g_yellowAngle,0,1,1);
//   //head.matrix.rotate(3*Math.sin(g_seconds),0,1,1);
//   head.matrix.translate(-0.35,0.55,0.15);
//   head.matrix.scale(.4,.8,.6);

//   head.render();

//   mouth
//   var mouth = new Cube();
//   mouth.color = [1,1,1,1];

//   mouth.matrix = body.matrix;

//   mouth.matrix.translate(-0.7,0,0.2);
//   mouth.matrix.scale(0.7,.5,.6);

//   mouth.render();





//   //nose
//   var nose = new Cube();

//   nose.color = [0,0,0,0.8];

//   nose.matrix = mouth.matrix;

//   nose.matrix.translate(-0.15,0.7,0.3);
//   nose.matrix.scale(0.4,.4,.4);

//   nose.render();



 

//   // //ear

// var nose = new Tri();

//   nose.color = [0.4,0.4,0.4,0.8];

//   nose.matrix = head.matrix;
//   nose.matrix.rotate(180,0,1,0);



//     nose.matrix.translate(-6,3,-2.5);


//   nose.matrix.scale(1,1,1);

//   nose.render();

// var nose = new Tri();

//   nose.color = [0.4,0.4,0.4,0.8];

//   nose.matrix = head.matrix;
//   nose.matrix.rotate(180,0,1,0);


//     nose.matrix.translate(-1,0,-4);


//   nose.matrix.scale(1,1,1);

//   nose.render();




//    var tail = new Pyr();

//    tail.color=[0.3,0.3,0.3,0.7];

//   tail.matrix.rotate(-g_yellowAngle*2,0,1,0);




//     tail.matrix.translate(0.2,-0.2,-0.1);


//   tail.matrix.rotate(90,0,0,1);

//   tail.matrix.scale(0.1,0.25,0.09);

//   tail.render();


//   var eye = new Cube();
//   eye.matrix = head.matrix;
//   eye.color = [0.74,0.84,.84,1];
//   eye.matrix.translate(-2.6,-1.5,2.5);
//   eye.matrix.scale(.5,1,1);
//   eye.render();


//   var eye1 = new Cube();
//   eye1.matrix = head.matrix;
//       eye1.color = [0.74,0.84,.84,1];

//   eye1.matrix.translate(0,0,-2);
//   eye.matrix.scale(1,1,1);
//   eye1.render();

//   var eye1 = new Cube();
//   eye1.matrix = head.matrix;
//       eye1.color = [0,0,0,1];

//   eye1.matrix.translate(-0.5,0,2);
//   eye.matrix.scale(1/2,1/2,1/2);
//   eye1.render();


// var eye1 = new Cube();
//   eye1.matrix = head.matrix;
//       eye1.color = [0,0,0,1];

//   eye1.matrix.translate(-0.5,0,-3);
//   eye.matrix.scale(1,1,1);
//   eye1.render();

// var eye1 = new Cube();
//   eye1.matrix = head.matrix;
//       eye1.color = [1,0,0,1];

//   eye1.matrix.translate(-6,-7,1.5);
//   eye.matrix.scale(1,2,1);
//   eye1.render();





  var duration = performance.now() - startTime;
  // sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10,"numdot");

  
}






