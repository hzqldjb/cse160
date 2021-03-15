// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
//GPU
var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  uniform float u_Size;

  void main() {
    gl_Position = a_Position;
    gl_PointSize=u_Size;
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

function setupWebGL(){
 // Retrieve <canvas> element
   canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
   // gl = getWebGLContext(canvas);

   gl = canvas.getContext("webgl",{ preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
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

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }

}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE =2;

let g_selectedColor = [1.0,1.0,1.0,1.0];
let g_seletedsize = 10;
let g_seletedType = POINT;
let g_seletedSegments = 10;

function addActionsForHtmlUI(){

  document.getElementById('redslider').addEventListener('mouseup',function() {g_selectedColor[0] = this.value/100;});
  document.getElementById('greenslider').addEventListener('mouseup',function() {g_selectedColor[1] = this.value/100;});
  document.getElementById('blueslider').addEventListener('mouseup',function() {g_selectedColor[2] =this.value/100;});

  document.getElementById('sizeslider').addEventListener('mouseup',function() {g_seletedsize = this.value;});

  document.getElementById('clear').onclick = function(){g_shapelist=[]; renderAllShapes();};

  document.getElementById('tri').onclick = function(){g_seletedType = TRIANGLE};

  document.getElementById('square').onclick = function(){g_seletedType = POINT};

  document.getElementById('circle').onclick = function(){g_seletedType = CIRCLE};


  document.getElementById('segments').addEventListener('mouseup',function() {g_seletedSegments = this.value;});


}



//CPU
function main() {
 
  setupWebGL();

  connectVariablesToGLSL();

  addActionsForHtmlUI();
  
  // Register function (event handler) to be called on a mouse press
  // canvas.onmousedown = function(ev){ click(ev) };
  canvas.onmousedown = click;
  // canvas.onmousemove = click;


  canvas.onmousemove = function(ev){if(ev.buttons ==1) {click(ev)}};

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}



// class Point{
//   constructor(){
//     this.type='point';
//     this.position=[0.0,0.0,0.0];
//     this.color = [1.0,1.0,1.0,1.0];
//     this.size = 5.0;
//   }


//   render(){
//     var xy = this.position;
//     var rgba = this.color;
//     var size = this.size;
//     // Pass the position of a point to a_Position variable
//     gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
//     // Pass the color of a point to u_FragColor variable
//     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

//     gl.uniform1f(u_Size,size);
//     // Draw
//     gl.drawArrays(gl.POINTS, 0, 1);

//   }
// }


var g_shapelist =[];

//..............................
// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_size = [];

function click(ev) {
  
  let [x,y] = convertCoordinatesEventToGL(ev);

  let point;
  if(g_seletedType == POINT)
  {
    point = new Point();
  }

  else if(g_seletedType == CIRCLE) {
    
    point = new Circle();
    point.segments=g_seletedSegments;

  }
  else{
    point = new Triangle();
  }

  // let point = new Point();

  point.position=[x,y];

  point.color = g_selectedColor.slice();
  point.size = g_seletedsize;
  g_shapelist.push(point);


  //.........................
  // g_points.push([x,y]);
  // g_colors.push(g_selectedColor.slice());

  // g_size.push(g_seletedsize);



  // g_colors.push(g_selectedColor.slice());
  // Store the coordinates to g_points array
  // if (x >= 0.0 && y >= 0.0) {      // First quadrant
  //   g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  // } else if (x < 0.0 && y < 0.0) { // Third quadrant
  //   g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  // } else {                         // Others
  //   g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  // }

  renderAllShapes();
}





function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x,y]);
}



function renderAllShapes(){


  var startTime = performance.now();
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapelist.length;


  for(var i = 0; i < len; i++) {

  g_shapelist[i].render();
  
  }

  var duration = performance.now() - startTime;
  // sendTextToHTML("numdot: "+ len +"ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10,"numdot");


//.................................
  // var len = g_points.length;

  // for(var i = 0; i < len; i++) {

  //   var xy = g_points[i];
  //   var rgba = g_colors[i];
  //   var size = g_size[i];
  //   // Pass the position of a point to a_Position variable
  //   gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
  //   // Pass the color of a point to u_FragColor variable
  //   gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

  //   gl.uniform1f(u_Size,size);
  //   // Draw
  //   gl.drawArrays(gl.POINTS, 0, 1);
}

// function sendTextToHTML(text,htmlID){
//   var htmlElm = document.getElementById(htmlID);
//   if(!htmlElm){
//     console.log("Failed to get " + htmlID + " from HTML");
//     return;
//   }
//   htmlElm.innerHTML = text;
// }






