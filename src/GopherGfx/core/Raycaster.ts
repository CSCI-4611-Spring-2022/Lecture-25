import { Ray } from '../math/Ray'
import { Plane } from '../math/Plane'
import { Box } from '../math/Box'
import { Sphere } from '../math/Sphere'
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { Camera } from './Camera'
import { Mesh } from '../geometry/Mesh'

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

    intersectsMeshBoundingBox(mesh: Mesh): Vector3 | null
    {
        const box = new Box();
        box.min.copy(mesh.boundingBox.min);
        box.max.copy(mesh.boundingBox.max);
        box.min.applyMatrix(mesh.getWorldMatrix());
        box.max.applyMatrix(mesh.getWorldMatrix()); 
        return this.intersectsBox(box);
    }

    intersectsMeshBoundingSphere(mesh: Mesh): Vector3 | null
    {
        const sphere = new Sphere();
        sphere.radius = mesh.boundingSphere.radius;
        sphere.center.copy(mesh.boundingSphere.center);
        sphere.center.applyMatrix(mesh.getWorldMatrix());

        return this.intersectsSphere(sphere);
    }

    // Brute force intersection test
    intersectsMesh(mesh: Mesh): Vector3 | null
    { 
        // If we do not intersect the bounding box, then there is no
        // need to load the vertices from GPU memory and conduct
        // an intersection test with each triangle in the mesh.
        if(!this.intersectsMeshBoundingBox(mesh))
            return null;

        const vertices = mesh.getVertices();
        const indices = mesh.getIndices();

        // Compute the ray in object space
        const localRay = new Ray(this.ray.origin.clone(), this.ray.direction.clone());
        localRay.origin.applyMatrix(mesh.getWorldMatrix().inverse());
        localRay.direction.rotate(mesh.rotation.inverse());

        const results = [];
        for(let i=0; i < indices.length; i+=3)
        {
            const intersection = this.intersectsTriangle(localRay,
                new Vector3(vertices[indices[i]*3], vertices[indices[i]*3+1], vertices[indices[i]*3+2]),
                new Vector3(vertices[indices[i+1]*3], vertices[indices[i+1]*3+1], vertices[indices[i+1]*3+2]),
                new Vector3(vertices[indices[i+2]*3], vertices[indices[i+2]*3+1], vertices[indices[i+2]*3+2])
            );
            if(intersection)
            {
                intersection.applyMatrix(mesh.getWorldMatrix());
                results.push(intersection);
            }
        }

        if(results.length == 0)
        {
            return null;
        }
        else
        {
            let closestPoint = 0;
            let closestDistance = this.ray.origin.distanceTo(results[0]);
            for(let i=1; i < results.length; i++)
            {
                const distance = this.ray.origin.distanceTo(results[i]);
                if(distance < closestDistance)
                {
                    closestPoint = i;
                    closestDistance = distance;
                }
            }

            return results[closestPoint];
        }
    }

    // Implementation of the Möller–Trumbore intersection algorithm
    // https://en.wikipedia.org/wiki/M%C3%B6ller%E2%80%93Trumbore_intersection_algorithm
    intersectsTriangle(ray: Ray, vertex0: Vector3, vertex1: Vector3, vertex2: Vector3): Vector3 | null
    {
        const EPSILON = 0.0000001;

        const edge1 = Vector3.subtract(vertex1, vertex0);
        const edge2 = Vector3.subtract(vertex2, vertex0);
        const h = Vector3.cross(ray.direction, edge2);
        const a = edge1.dot(h);
    
        if (a > -EPSILON && a < EPSILON) 
        {
            // This ray is parallel to this triangle.
            return null;    
        }

        const f = 1.0 / a;
        const s = Vector3.subtract(ray.origin, vertex0);
        const u = f * (s.dot(h));
        if (u < 0.0 || u > 1.0)
        {
            return null;
        }

        const q = Vector3.cross(s, edge1);
        const v = f * ray.direction.dot(q);
        if (v < 0.0 || u + v > 1.0) 
        {
            return null;
        }

        // At this stage we can compute t to find out where the intersection point is on the line.
        const t = f * edge2.dot(q);

        // ray intersection
        if (t > EPSILON) 
        {
            const intersection = ray.direction.clone();
            intersection.multiplyScalar(t);
            intersection.add(ray.origin);
            return intersection;
        }

        return null;
    }
}