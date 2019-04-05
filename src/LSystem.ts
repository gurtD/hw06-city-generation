import ExpansionRule from './ExpansionRule';
import DrawRule from './DrawRule';
import {vec3, mat4, mat3, vec4, vec2} from 'gl-matrix';
import Turtle from './Turtle';
//import { transformMat4 } from 'gl-matrix/src/gl-matrix/vec2';
class Point {
    x: number;
    y: number;
    z: number;
    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }
};
//////////////////////
/////////////////////////
///////////////////
class Edge {
    start: Point;
    end: Point;
    rotation: number;
    isStreet: boolean;
    constructor (start: Point, end: Point, rotation: number, isStreet: boolean) {
        this.start = start;
        this.end = end;
        this.rotation = rotation;
        this.isStreet = isStreet;
    }
}

class LSystem {
    
    expansion: string;
    angleMod: number;
    
    edges: Set<Edge>;
    mainHead: Point;
    mainAngle: number;
    offset: number;

    locations: Set<vec3>
    

    constructor (angle: number, x: number, y: number) {
        console.log("made lsystem");
        this.offset = 0.05;
        this.mainHead = new Point(x - this.offset, y );
        this.edges = new Set<Edge>();
        this.edges.add(new Edge(new Point(x, y), new Point(x - this.offset, y), -1.57, false));
        this.mainAngle = -1.57;
        this.locations = new Set<vec3>();
        this.angleMod = angle;
        
    }

    

    mix(a: number, b: number, t: number) {
        return a * (1 - t) + b * t;
    }

    fract(value: number): number {
        return value - Math.floor(value)
    }

    noise(n: vec2): number {
        return (this.fract(Math.sin(vec2.dot(n, vec2.fromValues(12.9898, 4.1414))) * 43758.5453));
    }
    
    interpNoise2D(x: number, y: number, seed: number): number {
        let intX = Math.floor(x);
        let fractX = this.fract(x);
        let intY = Math.floor(y);
        let fractY = this.fract(y);
        //float seed = 1.0;
    
        let v1 = this.noise(vec2.fromValues(seed * intX, seed * intY));
        let v2 = this.noise(vec2.fromValues(seed * (intX + 1.0), seed * intY));
        let v3 = this.noise(vec2.fromValues(seed * intX, seed * (intY + 1.0)));
        let v4 = this.noise(vec2.fromValues(seed * (intX + 1.0), seed * (intY + 1.0)));
    
        let i1 = this.mix(v1, v2, fractX);
        let i2 = this.mix(v3, v4, fractX);
        return this.mix(i1, i2, fractY);
        
    }

    
    
    
    
    
    fbm(x: number, y: number, seed: number): number
    {
        let total = 0.0;
        let persistance = 0.5;
        let octaves = 8;
    
        for (var i = 0; i < octaves; i++) {
            let freq = Math.pow(2,  i);
            let amp = Math.pow(persistance, i);
    
            total += (this.interpNoise2D(x * freq, y * freq, seed)) * amp;
        }
        return (total + 1.0) / 2.0;
    }

    popNoise(x: number, y: number) {
        
        return Math.pow(this.fbm(y, x, 2.3) - 0.5, 1.5);
    }

    step(a: number, x: number): number
    {
        if (x >= a) {
            return 1.0;
        } else{
            return 0.0;
        };
    }
    grid(st: vec2, res: number): number{
        return (this.step(res,this.fract(st[0] * res)) * this.step(res,this.fract(st[1] * res)));
    }   

    expand(n: number) {
        this.locations.add(vec3.fromValues(1.0, 0.0, 1.0));
        this.locations.add(vec3.fromValues(-1.0, 0.0, 1.0));
        this.locations.add(vec3.fromValues(-1.0, 0.0, -1.0));
        this.locations.add(vec3.fromValues(1.0, 0.0, -1.0));
        
        
        for (var i = 0; i < n; i++) {
            let x = Math.random() * 2.0 - 1.0;
            let z = Math.random() * 2.0 - 1.0;
            let y = Math.pow(this.popNoise(x, z), 2.0) * 7.0;

            let landNoise = this.fbm(x , z, 1.0 ) * 0.4;
            let centerGrid = this.grid(vec2.fromValues(x * 100.0, z * 100.0), 0.1);
            
            
            while (landNoise <= 0.3 || centerGrid == 0.0) {
                x = Math.random() * 2.0 - 1.0;
                z = Math.random() * 2.0 - 1.0;
                y = this.popNoise(x, z) * 5.0;
                landNoise = this.fbm(x , z, 1.0 ) * 0.4;
                centerGrid = this.grid(vec2.fromValues(x * 100.0, z * 100.0), 0.1);
                
            
            }
            console.log(landNoise)

            this.locations.add(vec3.fromValues(x, y, -z));
        }
        
        
    }

    drawMatrices(): mat4[] {
        let output: mat4[] = new Array<mat4>();
        for (let location of this.locations) {
            let transformation: mat4 =  mat4.create();
            mat4.identity(transformation);
            mat4.translate(transformation, transformation, vec3.fromValues(location[0], 0, location[2]));
            mat4.scale(transformation, transformation, vec3.fromValues(0.01, 0.025, 0.01));
            output.push(transformation);
            
            for (var i = 1; i < Math.floor(location[1]) + 1; i++) {
                let transformation: mat4 =  mat4.create();
                mat4.identity(transformation);
                mat4.translate(transformation, transformation, vec3.fromValues(location[0], i * 0.025, location[2]));
                mat4.scale(transformation, transformation, vec3.fromValues((1/(i + 1.0)) * 0.01, 0.025, (1/(i + 1.0)) * 0.01));
                output.push(transformation);
            }
            

            
        }

        return output;

       
    }
}


export default LSystem;