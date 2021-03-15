


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

   //正面
        gl.uniform4f(u_FragColor, rgba[0]*9, rgba[1]*9, rgba[2]*9, rgba[3]*9);

    drawTriangle3DUV([0.0,0.0,0.0,  1.0,1.0,0.0,  1.0,0.0,0.0 ],   [0,0, -1,1, -1,0]);
   // drawTriangle3DUV([0.0,0.0,0.0,  0.0,1.0,0.0,  1.0,1.0,0.0 ],    [0,0, 1,1, 1,1]);
   drawTriangle3DUV([0.0,0.0,0.0,  0.0,1.0,0.0,  1.0,1.0,0.0 ],    [0,0, -0,1, -1,1]);

        gl.uniform4f(u_FragColor, rgba[0]*9, rgba[1]*9, rgba[2]*9, rgba[3]*9);

    //上底
    drawTriangle3DUV([0.0,1.0,0.0,  0.0,1.0,1.0,  1.0,1.0,1.0 ],   [0,0, -1,1, -1,0]);
    drawTriangle3DUV([0.0,1.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0 ],    [0,0, -0,1, -1,1]);

        gl.uniform4f(u_FragColor, rgba[0]*9, rgba[1]*9, rgba[2]*9, rgba[3]*9);
    //左边
      drawTriangle3DUV([0.0,1.0,1.0, 0.0,0.0,1.0,  0.0,1.0,0.0],   [0,0, -1,1, -1,0]);
      drawTriangle3DUV([0.0,1.0,0.0,  0.0,0.0,0.0, 0.0,0.0,1.0],   [0,0, -0,1, -1,1]);

        gl.uniform4f(u_FragColor, rgba[0]*9, rgba[1]*9, rgba[2]*9, rgba[3]*9);
   //右边
     drawTriangle3DUV([1.0,1.0,0.0, 1.0,1.0,1.0, 1.0,0.0,0.0],   [0,0, -1,1, -1,0]);
     drawTriangle3DUV([1.0,1.0,1.0, 1.0,0.0,1.0, 1.0,0.0,0.0],   [0,0, -0,1, -1,1]);

     //BACK
        gl.uniform4f(u_FragColor, rgba[0]*9, rgba[1]*9, rgba[2]*9, rgba[3]*9);

    drawTriangle3DUV([0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0],   [0,0, -1,1, -1,0]);
    drawTriangle3DUV([0.0,0.0,1.0, 1.0,0.0,1.0, 1.0,1.0,1.0],   [0,0, -0,1, -1,1]);

    gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]*9);
    // BOTTOM 
     drawTriangle3DUV([0.0,0.0,0.0, 1.0,0.0,0.0, 0.0,0.0,1.0],   [0,0, -1,1, -1,0]);
     drawTriangle3DUV([1.0,0.0,1.0, 1.0,0.0,0.0, 0.0,0.0,1.0],   [0,0, -0,1, -1,1]);
    

  }
}

