import React, { useRef, useEffect } from "react";   
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

function addSnowFlakes() {
    let positions = [];
    let velocities = [];
    const numberSnowflakes = 15000;
    const maxRange = 1000;
    const minRange = maxRange / 2;
    const minHeight = 150;

    const geometry = new THREE.BufferGeometry();
    const textureLoader = new THREE.TextureLoader();
    // create snowflakes
    for (let i = 0; i < numberSnowflakes; i++) {

        // 雪花位置
        const x = Math.floor(Math.random() * maxRange - minRange); // x  -500 to 500
        const y = Math.floor(Math.random() * maxRange + minHeight); // y  250 to 750
        const z = Math.floor(Math.random() * maxRange - minRange); // z  -500 to 500
        positions.push(x, y, z);


        // 雪花速度
        velocities.push(
            Math.floor(Math.random() * 6 - 3) * 0.1, // x -0.3 to 0.3
            Math.floor(Math.random() * 5 + 0.12) * 0.18, // y -0.9 to 0.9
            Math.floor(Math.random() * 6 - 3) * 0.1 // z -0.3 to 0.3
        );
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));

    // 雪花材质
    const snowflakeMaterial = new THREE.PointsMaterial({
        size: 4,
        map: textureLoader.load('/textures/snowflake/snowflake-transparent.png'),
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        opacity: 0.7,
    });
    const particles = new THREE.Points(geometry, snowflakeMaterial);
    return particles;
}

const SnowEffect = ({ show = true }) => {
    const snowRef = useRef();
    const snowflakes = useRef(null);
    const isVisible = useRef(show);

    useEffect(() => {
        // 只在组件挂载时生成一次雪花
        if (!snowflakes.current) {
            snowflakes.current = addSnowFlakes();
            snowRef.current.add(snowflakes.current);
        }

        // 更新可见性
        if (snowflakes.current) {
            snowflakes.current.visible = show;
        }
        isVisible.current = show;

        // 组件卸载时清理
        return () => {
            if (snowflakes.current) {
                snowRef.current.remove(snowflakes.current);
                snowflakes.current.geometry.dispose();
                snowflakes.current.material.dispose();
            }
        };
    }, []);

    // 监听 show 属性变化
    useEffect(() => {
        if (snowflakes.current) {
            snowflakes.current.visible = show;
        }
        isVisible.current = show;
    }, [show]);

    useFrame(() => {
        // 只在可见时更新动画
        if (!isVisible.current || !snowflakes.current) return;

        const positions = snowflakes.current.geometry.attributes.position;
        const velocities = snowflakes.current.geometry.attributes.velocity;

        for (let i = 0; i < positions.count; i++) {
            positions.array[i * 3] += velocities.array[i * 3];     // x
            positions.array[i * 3 + 1] -= velocities.array[i * 3 + 1]; // y (下落)
            positions.array[i * 3 + 2] += velocities.array[i * 3 + 2]; // z

            if (positions.array[i * 3 + 1] < 0) {
                positions.array[i * 3 + 1] = 750;
            }

            if (Math.abs(positions.array[i * 3]) > 500) {
                positions.array[i * 3] *= -0.95;
            }
            if (Math.abs(positions.array[i * 3 + 2]) > 500) {
                positions.array[i * 3 + 2] *= -0.95;
            }
        }

        positions.needsUpdate = true;
    });

    return (
        <group ref={snowRef}>
            {/* Points 渲染由 addSnowFlakes 处理 */}
        </group>
    );
};

export default SnowEffect;

