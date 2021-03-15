class Geometry {
    constructor() {
        this.vertices = new Float32Array();

        // Create a model matrix that will store all the following
        // transformations
        this.modelMatrix = new Matrix4();

        // Create a translation matrix
        this.translationMatrix = new Matrix4();

        // Create a rotation matrix
        this.rotationMatrix = new Matrix4();

        // Create a scale matrix
        this.scaleMatrix = new Matrix4();

        // Color mode
        this.colorMode = 0.0;
    }

    translate(x, y, z) {
        this.translationMatrix.setTranslate(x, y, z);
    }

    rotateX(angle) {
        this.rotationMatrix.setRotate(angle, 1, 0, 0);
    }

    rotateY(angle) {
        this.rotationMatrix.setRotate(angle, 0, 1, 0);
    }

    rotateZ(angle) {
        this.rotationMatrix.setRotate(angle, 0, 0, 1);
    }

    scale(x, y, z) {
        this.scaleMatrix.setScale(x, y, z);
    }
}
