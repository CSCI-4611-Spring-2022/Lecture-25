import { Ray } from '../math/Ray'
import { Plane } from '../math/Plane'
import { Box } from '../math/Box'
import { Sphere } from '../math/Sphere'
import { Camera } from './Camera'
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';

export class Raycaster
{
    public ray: Ray;

    constructor(ray = new Ray())
    {
        this.ray = ray;
    }

    setPickRay(deviceCoords: Vector2, camera: Camera): void
    {
        this.ray.origin.copy(camera.position);
        this.ray.direction.set(deviceCoords.x, deviceCoords.y, -1);
        this.ray.direction.applyMatrix(camera.getProjectionMatrix().inverse());
        this.ray.direction.applyMatrix(camera.getWorldMatrix());
        this.ray.direction.subtract(this.ray.origin);
        this.ray.direction.normalize();
    }

    // Reference: https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-plane-and-ray-disk-intersection
    intersectsPlane(plane: Plane): Vector3 | null
    {

        // This method assumes the normals are unit vectors
        const denominator = this.ray.direction.dot(plane.normal);

        if(Math.abs(denominator) > 0.000001)
        {
            const rayOriginToPlanePoint = Vector3.subtract(plane.point, this.ray.origin);
            const t = rayOriginToPlanePoint.dot(plane.normal) / denominator;
            
            if(t > 0)
            {
                const intersectionPoint = Vector3.multiplyScalar(this.ray.direction, t);
                intersectionPoint.add(this.ray.origin);
                return intersectionPoint;
            }
        }
        
        return null;
    }

    // Reference: https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-sphere-intersection
    intersectsSphere(sphere: Sphere): Vector3 | null
    {

        const l = Vector3.subtract(sphere.center, this.ray.origin);
        const tca = l.dot(this.ray.direction);
        const radiusSquared = sphere.radius * sphere.radius;

        const d2 = l.dot(l) - tca * tca;
        if(d2 > radiusSquared)
            return null;

        const thc = Math.sqrt(radiusSquared - d2);
        const t0 = tca - thc;
        const t1 = tca + thc;

        if(t0 < 0 && t1 < 0)
            return null;
        
        const intersection = this.ray.direction.clone();

        if(t0 < t1)
            intersection.multiplyScalar(t0);
        else
            intersection.multiplyScalar(t1);
        
        intersection.add(this.ray.origin);

        return intersection;
    }

    // Reference: https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-box-intersection
    intersectsBox(box: Box): Vector3 | null
    {
        let tmin = (box.min.x - this.ray.origin.x) / this.ray.direction.x; 
        let tmax = (box.max.x - this.ray.origin.x) / this.ray.direction.x; 
    
        if (tmin > tmax)
        {
            const temp = tmin;
            tmin = tmax;
            tmax = temp;
        } 
    
        let tymin = (box.min.y - this.ray.origin.y) / this.ray.direction.y; 
        let tymax = (box.max.y - this.ray.origin.y) / this.ray.direction.y; 
    
        if (tymin > tymax)
        {
            const temp = tymin;
            tymin = tymax;
            tymax = temp;
        } 
    
        if ((tmin > tymax) || (tymin > tmax)) 
            return null; 
    
        if (tymin > tmin) 
            tmin = tymin; 
    
        if (tymax < tmax) 
            tmax = tymax; 
    
        let tzmin = (box.min.z - this.ray.origin.z) / this.ray.direction.z; 
        let tzmax = (box.max.z - this.ray.origin.z) / this.ray.direction.z; 
    
        if (tzmin > tzmax) 
        {
            const temp = tzmin;
            tzmin = tzmax;
            tzmax = temp;
        } 
    
        if ((tmin > tzmax) || (tzmin > tmax)) 
            return null; 
    
        if (tzmin > tmin) 
            tmin = tzmin; 
    
        if (tzmax < tmax) 
            tmax = tzmax; 

        const intersectionPoint = Vector3.multiplyScalar(this.ray.direction, tmin);
        intersectionPoint.add(this.ray.origin);
        return intersectionPoint;
    }
}