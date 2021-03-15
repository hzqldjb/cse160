class Pyr{
  constructor(){
    this.type='Pyr';
    //this.position=[0.0,0.0,0.0];
    this.color = [1.0,1.0,1.0,1.0];
    //this.size = 5.0;
    //this.segments = 10;
    this.matrix = new Matrix4(); 
  }


  render(){
    //var xy = this.position;
    var rgba = this.color;
    //var size = this.size;
    // Pass the color of a point to u_FragColor variable

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);



    drawTriangle3D([1,-2.5,3, -1,-2.5,3, 0,-.5,4]);


     drawTriangle3D([-1,-2.5,5, 1,-2.5,5, 0,-.5,4]);


     drawTriangle3D([1,-2.5,3, 1,-2.5,5, 0,-.5,4]);

     drawTriangle3D([-1,-2.5,5, -1,-2.5,3, 0,-.5,4]);


    gl.uniform4f(u_FragColor, rgba[0]*9, rgba[1]*9, rgba[2]*9, rgba[3]*9);

  drawTriangle3D([1,-2.5,3, -1,-2.5,3, 0,-3,4]);

    drawTriangle3D([-1,-2.5,5, 1,-2.5,5, 0,-3,4]);


     drawTriangle3D([1,-2.5,3, 1,-2.5,5, 0,-3,4]);

     drawTriangle3D([-1,-2.5,5, -1,-2.5,3, 0,-3,4]);









  }
}
