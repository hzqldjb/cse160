


class Cube{
  constructor(){
    this.type='Cube';
    //this.position=[0.0,0.0,0.0];
    this.color = [0,0,1,1];
    //this.size = 5.0;
    //this.segments = 10;
    this.matrix = new Matrix4(); 
    this.textureNum = -2;
  }


  render(){
    //var xy = this.position;
    var rgba = this.color;

    gl.uniform1i(u_whichTextures,this.textureNum);

   gl.uniform4f(u_FragColor, rgba[0],rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

   //back
   //  drawTriangle3DUV([0.0,0.0,0.0,  1.0,1.0,0.0,  1.0,0.0,0.0 ],   [0,0, -1,1, -1,0]);
   // // drawTriangle3DUV([0.0,0.0,0.0,  0.0,1.0,0.0,  1.0,1.0,0.0 ],    [0,0, 1,1, 1,1]);
   // drawTriangle3DUV([0.0,0.0,0.0,  0.0,1.0,0.0,  1.0,1.0,0.0 ],    [0,0, -0,1, -1,1]);

   //   gl.uniform4f(u_FragColor, rgba[0]*.3, rgba[1]*.3, rgba[2]*.3, rgba[3]*.3);

   //  //上底
   //  drawTriangle3DUV([0.0,1.0,0.0,  0.0,1.0,1.0,  1.0,1.0,1.0 ],   [0,0, -1,1, -1,0]);
   //  drawTriangle3DUV([0.0,1.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0 ],    [0,0, -0,1, -1,1]);

   //   gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]*0.7);
   // //  //左边
   //    drawTriangle3DUV([0.0,1.0,1.0, 0.0,0.0,1.0,  0.0,1.0,0.0],   [0,0, -1,1, -1,0]);
   //    drawTriangle3DUV([0.0,1.0,0.0,  0.0,0.0,0.0, 0.0,0.0,1.0],   [0,0, -0,1, -1,1]);

   //   gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]*0.7);
   // // //右边
   //   drawTriangle3DUV([1.0,1.0,0.0, 1.0,1.0,1.0, 1.0,0.0,0.0],   [0,0, -1,1, -1,0]);
   //   drawTriangle3DUV([1.0,1.0,1.0, 1.0,0.0,1.0, 1.0,0.0,0.0],   [0,0, -0,1, -1,1]);

   //   //front
   //   gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]*.7);

   //  drawTriangle3DUV([0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0],   [0,0, -1,1, -1,0]);
   //  drawTriangle3DUV([0.0,0.0,1.0, 1.0,0.0,1.0, 1.0,1.0,1.0],   [0,0, -0,1, -1,1]);

   //   gl.uniform4f(u_FragColor, rgba[0]*.3, rgba[1]*.3, rgba[2]*.3, rgba[3]*.3);
   //  // BOTTOM 
   //   drawTriangle3DUV([0.0,0.0,0.0, 1.0,0.0,0.0, 0.0,0.0,1.0],   [0,0, -1,1, -1,0]);
   //   drawTriangle3DUV([1.0,0.0,1.0, 1.0,0.0,0.0, 0.0,0.0,1.0],   [0,0, -0,1, -1,1]);
   
   drawTriangle3DUVNormal([0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0], [0,0,-1, 0,0,-1, 0,0,-1]);

   drawTriangle3DUVNormal([0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1], [0,0,-1, 0,0,-1, 0,0,-1]);
    
 // gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]*.6);

  drawTriangle3DUVNormal([0,1,0, 0,1,1, 1,1,1], [0,0, 0,1, 1,1], [0,1,0, 0,1,0, 0,1,0]);
  drawTriangle3DUVNormal([0,1,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0], [0,1,0, 0,1,0, 0,1,0]);
 
 // gl.uniform4f(u_FragColor, rgba[0]*.4, rgba[1]*.4, rgba[2]*.4, rgba[3]*.4);

  drawTriangle3DUVNormal([1,1,0, 1,1,1, 1,0,0], [0,0, 0,1, 1,1], [1,0,0, 1,0,0, 1,0,0]);
  drawTriangle3DUVNormal([1,0,0, 1,1,1, 1,0,1], [0,0, 1,1, 1,0], [1,0,0, 1,0,0, 1,0,0]);

 // gl.uniform4f(u_FragColor, rgba[0]*.3, rgba[1]*.3, rgba[2]*.3, rgba[3]*.3);

  drawTriangle3DUVNormal([0,1,0, 0,1,1, 0,0,0], [0,0, 0,1, 1,1], [-1,0,0, -1,0,0, -1,0,0]);
  drawTriangle3DUVNormal([0,0,0, 0,1,1, 0,0,1], [0,0, 1,1, 1,0], [-1,0,0, -1,0,0, -1,0,0]);
 
 // gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]*.7);

  drawTriangle3DUVNormal([0,0,0, 0,0,1, 1,0,1], [0,0, 0,1, 1,1], [0,-1,0, 0,-1,0, 0,-1,0]);
  drawTriangle3DUVNormal([0,0,0, 1,0,1, 1,0,0], [0,0, 1,1, 1,0], [0,-1,0, 0,-1,0, 0,-1,0]);
 
// gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]*.8);

  drawTriangle3DUVNormal([0,0,1, 1,1,1, 1,0,1], [0,0, 0,1, 1,1], [0,0,1, 0,0,1, 0,0,1]);
  drawTriangle3DUVNormal([0,0,1, 0,1,1, 1,1,1], [0,0, 1,1, 1,0], [0,0,1, 0,0,1, 0,0,1]);
 

  }
}

