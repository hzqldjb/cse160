

class Tri{
  constructor(){
    this.type='Tri';
    //this.position=[0.0,0.0,0.0];
    this.color = [0.4,0.4,0.4,0.8];
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

  
       drawTriangle3D([0,0,0, 0,0,1, 0,2,0]);

    gl.uniform4f(u_FragColor, rgba[0]*2, rgba[1]*2, rgba[2]*2, rgba[3]*2);


         drawTriangle3D([0,0,0, 1,0,0, 0,2,0]);

        drawTriangle3D([1,0,0, 0,2,0, 0,0,1]);


  }
}
