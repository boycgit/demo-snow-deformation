import { Canvas } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";
import InfiniteSnowGround from "./components/InfiniteSnowGround";
// import SnowEffect from "./components/SnowEffect";

import FrameLimiter from "./utils/FPSLimiter";

const BG_COLOR = '#e3e3e3'

const Scene = () => {
  return (
    <Canvas camera={{ fov: 65, position: [0, 30, 100] }} dpr={1}>
      <color attach="background" args={[BG_COLOR]} />

      <directionalLight position={[4, 5, 0]} intensity={3} />

      <ambientLight intensity={1} />

      <InfiniteSnowGround />

      {/* <Stats /> */}

      <FrameLimiter />
      {/* <OrbitControls
        makeDefault
        enableDamping={false}
        enableRotate={true}
        enableZoom={true}
        enablePan={true}
      /> */}
      {/* <SnowEffect/> */}
    </Canvas>
  );
};

export default Scene;
