class Cube{
  constructor(){
    this.type='Cube';
    //this.position=[0.0,0.0,0.0];
    this.color = [0,0,0,0];
    //this.size = 5.0;
    //this.segments = 10;
    this.matrix = new Matrix4(); 
  }


  render(){
    //var xy = this.position;
    var rgba = this.color;
    //var size = this.size;
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    drawTriangle3D([0.0,0.0,0.0,  1.0,1.0,0.0,  1.0,0.0,0.0 ]);
    drawTriangle3D([0.0,0.0,0.0,  0.0,1.0,0.0,  1.0,1.0,0.0 ]);

    gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]*7);

     drawTriangle3D([0.0,1.0,0.0,  0.0,1.0,1.0,  1.0,1.0,1.0 ]);
     drawTriangle3D([0.0,1.0,0.0,  1.0,1.0,1.0,  1.0,1.0,0.0 ]);

    gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]*8);

     drawTriangle3D([0.0,1.0,1.0, 0.0,0.0,1.0,  0.0,1.0,0.0]);
     drawTriangle3D([0.0,1.0,0.0,  0.0,0.0,0.0, 0.0,0.0,1.0]);

   gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]*8);

     drawTriangle3D([1.0,1.0,0.0, 1.0,1.0,1.0, 1.0,0.0,0.0]);
     drawTriangle3D([1.0,1.0,1.0, 1.0,0.0,1.0, 1.0,0.0,0.0]);

     //BACK
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    drawTriangle3D([0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0]);
     drawTriangle3D([0.0,0.0,1.0, 1.0,0.0,1.0, 1.0,1.0,1.0]);

    gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]*9);
    // BOTTOM 
     drawTriangle3D([0.0,0.0,0.0, 1.0,0.0,0.0, 0.0,0.0,1.0]);
     drawTriangle3D([1.0,0.0,1.0, 1.0,0.0,0.0, 0.0,0.0,1.0]);


  }
}

