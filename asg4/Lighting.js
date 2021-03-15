

var VSHADER_SOURCE =`

precision mediump float;
attribute vec4 a_Position;
attribute vec2 a_UV;
attribute vec3 a_Normal;
varying vec3  v_Normal;
varying vec2 v_UV;
varying vec4 v_VertPos;
uniform mat4 u_ModelMatrix;
uniform mat4 u_GlobalRotateMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;


  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;

    v_UV = a_UV;

    v_Normal = a_Normal;
    v_VertPos= u_ModelMatrix * a_Position;

  }`;

// //GPU
// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  varying vec2 v_UV;
  varying vec3  v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform int u_whichTextures;
  uniform vec3 u_lightPos;
  varying vec4 v_VertPos;
  uniform vec3 u_cameraPos;
  uniform bool u_lighton;




  void main() {

    if (u_whichTextures ==-3){
        gl_FragColor = u_FragColor;
    }

    else if(u_whichTextures ==-1){
       gl_FragColor = vec4((v_Normal+1.0)/2.0,1.0);
     }


     else if(u_whichTextures ==-2){
       gl_FragColor = vec4(v_UV,1.0,1.0);
     }
     else if(u_whichTextures ==0){
       gl_FragColor = texture2D(u_Sampler0,v_UV);
     }
        else{gl_FragColor = vec4(1,1,1,1);
   }


   vec3 lightVector = u_lightPos-vec3(v_VertPos);
    float r = length(lightVector);

      vec3 L = normalize(lightVector);
      vec3 N = normalize(v_Normal);
      float nDotL = max(dot(N,L),0.0);
  
   vec3 R = reflect(-L,N);
   vec3 E = normalize(u_cameraPos-vec3(v_VertPos));
   float specular = pow(max(dot(E,R),0.0),10.0); 
 
 // gl_FragColor = vec4(vec3(gl_FragColor)/(r*r),1);

   vec3 diffuse = vec3(1.0,1.0,.9) * vec3(gl_FragColor) * nDotL *0.7;
   vec3 ambient = vec3(gl_FragColor) *0.3;
  //gl_FragColor = vec4(diffuse+ambient+specular,1.0);
  //gl_FragColor = vec4(diffuse+ambient,1.0);

  
  if(u_lighton){
    gl_FragColor = vec4(diffuse+ambient+specular,1.0);
    } 
    else
    {
      gl_FragColor = vec4(diffuse+ambient,1.0);
    }

  }`;

     //   if (u_whichTextures ==-3){
   //      gl_FragColor = u_FragColor;
   //  }

   //  else if(u_whichTextures ==-2){
   //     gl_FragColor = vec4(v_UV,1.0,1.0);
   //   }

   //   else if(u_whichTextures ==-1){
   //     gl_FragColor = vec((v_Normal+1)/2,1);
   //   }
   //   else if(u_whichTextures ==0){
   //     gl_FragColor = texture2D(u_Sampler0,v_UV);
   //   }
   //      else{gl_FragColor = vec4(1,1,1,1);
   // }


let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_lightPos;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_whichTextures;
let a_Normal;
let u_cameraPos;
let u_lighton;



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


 u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (u_lightPos < 0) {
    console.log('Failed to get the storage location of u_lightPos');
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
    return;
  }

 u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (u_cameraPos < 0) {
    console.log('Failed to get the storage location of u_cameraPos');
    return;
  }

u_lighton = gl.getUniformLocation(gl.program, 'u_lighton');
  if (u_lighton < 0) {
    console.log('Failed to get the storage location of u_lighton');
    return;
  }




  u_whichTextures = gl.getUniformLocation(gl.program, 'u_whichTextures');

    if(!u_whichTextures){
    console.log('Failed to get the storage location of u_whichTextures');
    return;
  }


   a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return;
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

let g_normalon = false;

let g_lightPos=[0,2,2];

let g_lighton = false;

function addActionsForHtmlUI(){

  document.getElementById('normalon').onclick = function(){g_normalon=true;renderAllShapes();};

  document.getElementById('normaloff').onclick = function(){g_normalon=false;renderAllShapes();};


  document.getElementById('off').onclick = function(){g_lighton=false;renderAllShapes();};
  
  document.getElementById('on').onclick = function(){g_lighton=true;renderAllShapes();};

  document.getElementById('angleSlider').addEventListener('mouseup',function() {g_globalAngle = this.value; renderAllShapes();});


  //document.getElementById('yellowSlider').addEventListener('mouseup',function() {g_yellowAngle = this.value; renderAllShapes();});

 // document.getElementById('lightsliderx').addEventListener('mouseup',function() {g_lightPos[0] =this.value/100; renderAllShapes();});

  document.getElementById('lightslidery').addEventListener('mouseup',function() {g_lightPos[1] =this.value/100; renderAllShapes();} );

  document.getElementById('lightsliderz').addEventListener('mouseup',function() {g_lightPos[2] =this.value/100; renderAllShapes();} );


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

 //renderAllShapes();
 requestAnimationFrame(tick);
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

  g_lightPos[0] = Math.cos(g_seconds);
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

  for(x=0;x<50;x++){
    for(y=0;y<50;y++){
      //if(g_map[x][y] ==1){
        if(x==0 || y==0 || x == 48 || y == 48){
        let body0 = new Cube();
        body0.color = [1,1,1,1];
        body0.textureNum = 0;

        body0.matrix.translate(x/3-7,-2.5,y/3-8);
       //body0.matrix.translate(x/20,-1.5,y/20);



        body0.matrix.scale(0.8,.9,0.45);
        body0.render();
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


  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);

  gl.uniform3f(u_cameraPos, g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2]);

  gl.uniform1i(u_lighton, g_lighton);

  var light = new Cube();
  light.color = [1,1,1,1];
  light.matrix.translate(g_lightPos[0],g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(.1,.1,.1);


  light.render();

//draw body cube
  var body = new Cube();

  body.color = [0,1,1,1];
  if(g_normalon) body.textureNum = -1;
  if(!g_normalon) body.textureNum = -3;
  if(g_lighton) body.textureNum=-1;
  body.matrix.translate(-1,-2,2);
  body.matrix.scale(1.5,1.5,1.5);
  body.render();




 var body1 = new Cube();

  body1.color = [1,0,1,1];
  body1.matrix.translate(-2,-1,1.5);
  if(g_normalon) body1.textureNum = -1;
  if(!g_normalon) body1.textureNum = -3;
  if(g_lighton) body1.textureNum=-1;
  body1.matrix.scale(0.5,.5,0.5);
  body1.render();




  var sp = new Sphere();
  sp.color = [1,0,0,1];
 if(g_normalon) sp.textureNum = -1;
  if(!g_normalon) sp.textureNum = -3;
  if(g_lighton) sp.textureNum=-1;
  sp.matrix.translate(-1,0.2,3);
  sp.matrix.scale(.5,.5,.5);
  sp.render();





  var ground = new Cube();

  ground.color = [0,255,0,.1];
  ground.textureNum = -3;

   ground.matrix.translate(-300,-2.5,-200);

  ground.matrix.scale(500,.1,500);


  ground.render();



  var sky = new Cube();


  sky.color = [0,0,5,1];

  sky.textureNum = -3;

  sky.matrix.scale(150,50,150);
  sky.matrix.translate(-.2,-.4,-.5);

  sky.render();



   drawMap();



 var room = new Cube();
  room.color = [1,1,1,1];
  if(g_normalon) room.textureNum = -1;
  if(!g_normalon) room.textureNum = -3;
  if(g_lighton) room.textureNum=-1;
  room.matrix.translate(-3,-2.5,-5);
  room.matrix.scale(5,5,10);
  room.render();







//animal*******

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






