class Camera{
	constructor(){

		this.eye = new Vector3([0,0,3]);
		//this.eye = new Vector3([25,25,25]);
		this.at = new Vector3([0,0,-1]);

		//this.at = new Vector3([55,50,52]);
		this.up = new Vector3([0,1,0]);
		//this.up = new Vector3([10,10,0]);

	}


	forward(){
		let f = new Vector3();
		f.set(this.at);
		f.sub(this.eye);
		f.normalize();
		f.mul(1.0);
		console.log(f);
		this.at = this.at.add(f);
		this.eye = this.eye.add(f);

	}


	back(){
		let b = new Vector3();
		b.set(this.eye);
		b.sub(this.at);
		b.normalize();
		b.mul(1);

		console.log(b);
		//f.mul(speed);
		this.at = this.at.add(b);
		this.eye = this.eye.add(b);
	}

	left(){
		let f = new Vector3();
		f.set(this.at);
		f.sub(this.eye);
		let s = new Vector3();
		s.set(Vector3.cross(this.up,f));
		s.normalize();
		s.mul(1);

		console.log(s);
		this.at = this.at.add(s);
		this.eye = this.eye.add(s);
	}

	right(){
		let f = new Vector3();
		f.set(this.at);
		f.sub(this.eye);
		let s = new Vector3();
		s.set(Vector3.cross(f,this.up));
		s.normalize();
		s.mul(1);

		console.log(s);
		this.at = this.at.add(s);
		this.eye = this.eye.add(s);
	}

	panleft(){
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let rotataionMatrix = new Matrix4();
        rotataionMatrix.setRotate(10, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let f_prime = new Vector3();
        f_prime = rotataionMatrix.multiplyVector3(f);
        let tempEye = new Vector3();
        tempEye.set(this.eye);
        this.at = tempEye.add(f_prime);

	}

	panright(){
	      var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let rotataionMatrix = new Matrix4();
        rotataionMatrix.setRotate(-10, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let f_prime = new Vector3();
        f_prime = rotataionMatrix.multiplyVector3(f);
        let tempEye = new Vector3();
        tempEye.set(this.eye);
        this.at = tempEye.add(f_prime);


	}


}