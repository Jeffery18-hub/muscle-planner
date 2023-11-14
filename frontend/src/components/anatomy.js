import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Environment} from '@react-three/drei';
import { Mesh } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import styled from 'styled-components';
import {MuscleDictionary} from '../muscleDictionary';

const StyledTag = styled.div`
    background-color: rgba(50, 50, 50, 0.8);  
    color: white;                             
    padding: 5px 10px;                       
    border-radius: 5px;                      
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
    position: absolute;                    
`;

const MuscleTag = ({ name, style }) => {
    return (
        <StyledTag style={style}>{name}</StyledTag>
    )
}

const Tag = styled(MuscleTag)`
    display: 'block';
`

function Model({ setMuscleName, setMousePosition, onMouseClick }) {
    const gltf = useLoader(GLTFLoader, "/models/muscle_jun.glb");
    const { scene, camera } = useThree(); 
    const meshRef = useRef(); // get a reference to the mesh
    const [highlightedMesh, setHighlightedMesh] = useState(false); 


    const onPointerMove = (event) => {
        if (highlightedMesh) {
            highlightedMesh.material.emissive.set(0x000000);  // reset emissive color
            setHighlightedMesh(null);
            setMuscleName(null);
        }

        const intersects = event.intersections;
        if (intersects.length > 0) {
            const target = intersects[0].object;
            if (target instanceof Mesh) {
                target.material.emissive.set(0x555555);  // set emissive color for highlight
                setHighlightedMesh(target);
                if(MuscleDictionary[target.name]){
                    setMuscleName(MuscleDictionary[target.name]);
                }else{
                    setMuscleName(target.name);
                }
            }
        }
        // Save mouse position
        setMousePosition({
            x: event.clientX,
            y: event.clientY,
        });
    };

    const onPointerOut = () => {
        if (highlightedMesh) {
            highlightedMesh.material.emissive.set(0x000000);  // reset emissive color
            setHighlightedMesh(null);
            setMuscleName(null);
        }
    };

    const handleMeshClick = (event) => {
        const clickedObject = event.intersections[0]?.object;
        if (clickedObject instanceof Mesh) {
            if(MuscleDictionary[clickedObject.name]){
                onMouseClick(MuscleDictionary[clickedObject.name]);
            }else{
                onMouseClick(clickedObject.name);
            }
        }
    };

    //Use cloneDeep to ensure not directly modifying the original gltf object
    const sceneClone = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
    useEffect(() => {
        let res = [];
        sceneClone.traverse((child) => {
            if (child instanceof Mesh) {
                const name = child.name;
                if(!name.includes('Object')) res.push(name);
                child.material = child.material.clone();
            }
        });
        console.log(res);
    }, [sceneClone]);

    return (
        <primitive
            object={sceneClone}
            scale={[0.5, 0.5, 0.5]}
            ref={meshRef}
            onPointerMove={onPointerMove}
            onPointerOut={onPointerOut}
            onClick={handleMeshClick}
        >
        </primitive>
    );
}

function Anatomy({onMuscleClicked}) {
    const [muscleName, setMuscleName] = useState("");
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // This function will be called when the user clicks on a muscle on the model.
    const handleMuscleClick = (muscleName) => {
            // pass to parent component
            onMuscleClicked(muscleName);
    };

    return (
        <div
            // TODO:consider the width and height
            style={{ position: 'relative', width: '80%', height: '80%' }}

        >
            <Canvas camera={{ position: [0, 5, 20], fov: 100 }}>
                <ambientLight />
                <OrbitControls />
                <Model 
                    setMuscleName={setMuscleName} 
                    setMousePosition={setMousePosition}
                    onMouseClick={handleMuscleClick}
                    />
                <Environment files="/models/gym_01_4k.hdr" background />
            </Canvas>
            {muscleName && !muscleName.includes('Object')? (
                <MuscleTag 
                    name={muscleName}
                    style={{ 
                        left: `${mousePosition.x}px`, 
                        top: `${mousePosition.y-30}px` 
                    }} 
                />
            ): null}
        </div>
    );
}

export default Anatomy;
