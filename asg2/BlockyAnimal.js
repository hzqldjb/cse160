// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
//GPU
var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;

  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;

  }`;

//GPU
// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`;

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;


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


  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}

// const POINT = 0;
// const TRIANGLE = 1;
// const CIRCLE =2;

let g_selectedColor = [1.0,1.0,1.0,1.0];
// let g_seletedsize = 10;
// let g_seletedType = POINT;
// let g_seletedSegments = 10;
let g_animation = false;
let g_globalAngle = 0; 


let g_yellowAngle = 0;
function addActionsForHtmlUI(){

  document.getElementById('off').onclick = function(){g_animation=false;};
    document.getElementById('on').onclick = function(){g_animation=true;};


  document.getElementById('angleSlider').addEventListener('mouseup',function() {g_globalAngle = this.value; renderAllShapes();});



  document.getElementById('yellowSlider').addEventListener('mouseup',function() {g_yellowAngle = this.value; renderAllShapes();});




}



//CPU
function main() {
 
  setupWebGL();

  connectVariablesToGLSL();

  addActionsForHtmlUI();
  


  canvas.onmousemove = function(ev){if(ev.buttons ==1) {click(ev)}};

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);

 // renderAllShapes();
 requestAnimationFrame(tick);
}

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

function renderAllShapes(){

  var startTime = performance.now();


  var globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);




  gl.uniformMatrix4fv(u_GlobalRotateMatrix,false,globalRotMat.elements);




  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.clear(gl.COLOR_BUFFER_BIT);


//draw body cube
  var body = new Cube();

  body.color = [0.4,0.4,0.4,0.8];


  body.matrix.rotate(g_yellowAngle*0.6,1,1,1);

  body.matrix.translate(-0.25,-.5,0);
  //body.matrix.rotate(-0.5,1,0,0);
  //body.matrix.scale(0.78,0.4,0.5);

    body.matrix.scale(0.78,0.4,0.5);

  body.render();





  //left front
  var leg = new Cube();

  leg.color = [0.4,0.4,0.4,0.85];

  //  body.matrix.rotate(-0.5,1,0,0);
  leg.matrix.rotate(g_yellowAngle,0,0,1);
  //leg.matrix.rotate(5*Math.sin(g_seconds),0,0,1);
  var clawMat = new Matrix4(leg.matrix);


  leg.matrix.translate(-0.2,-.75,0.02);
  //leg.matrix.rotate(-0.5,1,0,0);
  leg.matrix.scale(0.2,.3,0.2);

  leg.render();





//。。。。。。。。。。。。。

  var claw = new Cube();
  claw.color = [1,1,1,1];

  claw.matrix = leg.matrix;


 claw.matrix.rotate(-1.5*g_yellowAngle+7,0,0,1);

  claw.matrix.translate(-0.3,-0.35,0.02);

  claw.matrix.scale(1.3,0.35,1);
  claw.render();


  //right front
  var leg = new Cube();

  leg.color = [0.4,0.4,0.4,0.9];

  var clawMat = new Matrix4(leg.matrix);

  leg.matrix.rotate(-g_yellowAngle,0,0,1);

  //leg.matrix.rotate(-5*Math.sin(g_seconds),0,0,1);
  leg.matrix.translate(-0.2,-.75,0.28);
  //leg.matrix.rotate(-0.5,1,0,0);
  leg.matrix.scale(0.2,0.3,0.2);

  leg.render();





  //draw a claw

  var claw = new Cube();
  claw.color = [1,1,1,1];

  claw.matrix = leg.matrix;

 // claw.matrix.rotate(3*Math.sin(g_seconds)+5,0,0,1);
 claw.matrix.rotate(1.5*g_yellowAngle+7,0,0,1);


  claw.matrix.translate(-0.3,-0.35,0.02);

  claw.matrix.scale(1.3,0.35,1);
  claw.render();


//draw a backward right leg 
  
 

  var leg = new Cube();

  leg.color = [0.4,0.4,0.4,0.8];

  var clawMat = new Matrix4(leg.matrix);
  //leg.matrix.rotate(3*Math.sin(g_seconds),0,0,1);
  leg.matrix.rotate(g_yellowAngle,0,0,1);

  leg.matrix.translate(0.28,-.75,0.27);
  //leg.matrix.rotate(-0.5,1,0,0);
  leg.matrix.scale(0.2,0.3,0.2);

  leg.render();

  //draw a claw

  var claw = new Cube();
  claw.color = [1,1,1,1];

  claw.matrix = leg.matrix;

 claw.matrix.rotate(1.5*g_yellowAngle+7,0,0,1);


  claw.matrix.translate(-0.3,-0.35,0.02);

  claw.matrix.scale(1.3,0.35,1);
  claw.render();

//draw a backward left leg 
  
  var leg2 = new Cube();

  leg2.color = [0.4,0.4,0.4,0.8];
  leg2.matrix.rotate(-g_yellowAngle,0,0,1);

  //leg2.matrix.rotate(-3*Math.sin(g_seconds),0,0,1);
  leg2.matrix.translate(0.26,-.75,0.03);
  //leg.matrix.rotate(-0.5,1,0,0);
  leg2.matrix.scale(0.2,0.3,0.2);

  leg2.render();


  var claw1 = new Cube();
  claw1.color = [1,1,1,1];

  claw1.matrix = leg2.matrix;

 claw1.matrix.rotate(1.5*g_yellowAngle+7,0,0,1);


  claw1.matrix.translate(-0.3,-0.35,0.02);

  claw1.matrix.scale(1.3,0.35,1);
  claw1.render();

//head
  var head = new Cube();
  head.color = [0.4,0.4,0.4,0.8];

 var leye = head.matrix; 
  head.matrix = body.matrix;
  head.matrix.rotate(g_yellowAngle,0,1,1);
  //head.matrix.rotate(3*Math.sin(g_seconds),0,1,1);
  head.matrix.translate(-0.35,0.55,0.15);
  head.matrix.scale(.4,.8,.6);

  head.render();

  mouth
  var mouth = new Cube();
  mouth.color = [1,1,1,1];

  mouth.matrix = body.matrix;

  mouth.matrix.translate(-0.7,0,0.2);
  mouth.matrix.scale(0.7,.5,.6);

  mouth.render();





  //nose
  var nose = new Cube();

  nose.color = [0,0,0,0.8];

  nose.matrix = mouth.matrix;

  nose.matrix.translate(-0.15,0.7,0.3);
  nose.matrix.scale(0.4,.4,.4);

  nose.render();



 

  // //ear

var nose = new Tri();

  nose.color = [0.4,0.4,0.4,0.8];

  nose.matrix = head.matrix;
  nose.matrix.rotate(180,0,1,0);



    nose.matrix.translate(-6,3,-2.5);


  nose.matrix.scale(1,1,1);

  nose.render();

var nose = new Tri();

  nose.color = [0.4,0.4,0.4,0.8];

  nose.matrix = head.matrix;
  nose.matrix.rotate(180,0,1,0);


    nose.matrix.translate(-1,0,-4);


  nose.matrix.scale(1,1,1);

  nose.render();




   var tail = new Pyr();

   tail.color=[0.3,0.3,0.3,0.7];

  tail.matrix.rotate(-g_yellowAngle*2,0,1,0);




    tail.matrix.translate(0.2,-0.2,-0.1);


  tail.matrix.rotate(90,0,0,1);

  tail.matrix.scale(0.1,0.25,0.09);

  tail.render();


  var eye = new Cube();
  eye.matrix = head.matrix;
  eye.color = [0.74,0.84,.84,1];
  eye.matrix.translate(-2.6,-1.5,2.5);
  eye.matrix.scale(.5,1,1);
  eye.render();


  var eye1 = new Cube();
  eye1.matrix = head.matrix;
      eye1.color = [0.74,0.84,.84,1];

  eye1.matrix.translate(0,0,-2);
  eye.matrix.scale(1,1,1);
  eye1.render();

  var eye1 = new Cube();
  eye1.matrix = head.matrix;
      eye1.color = [0,0,0,1];

  eye1.matrix.translate(-0.5,0,2);
  eye.matrix.scale(1/2,1/2,1/2);
  eye1.render();


var eye1 = new Cube();
  eye1.matrix = head.matrix;
      eye1.color = [0,0,0,1];

  eye1.matrix.translate(-0.5,0,-3);
  eye.matrix.scale(1,1,1);
  eye1.render();

var eye1 = new Cube();
  eye1.matrix = head.matrix;
      eye1.color = [1,0,0,1];

  eye1.matrix.translate(-6,-7,1.5);
  eye.matrix.scale(1,2,1);
  eye1.render();





  var duration = performance.now() - startTime;
  // sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10,"numdot");

  
}






