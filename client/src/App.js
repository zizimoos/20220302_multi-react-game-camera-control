import React, { useState } from "react";
import styled from "styled-components";

import { Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";

import GroundField from "./components/GroundField";
import Player from "./components/Player";

import io from "socket.io-client";
import Coin from "./components/Coin";
import OtherPlayers from "./components/OtherPlayers";

import { useRecoilState } from "recoil";
import { CameraMoveInfo } from "./atoms";

const socket = io("http://localhost:3001");

const CanvasContainer = styled.div`
  width: 800px;
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: black;
`;

// const CameraController = () => {
//   const Perspectcamera = new THREE.PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000
//   );
//   Perspectcamera.position.y = 5;
//   Perspectcamera.position.z = 5;
//   Perspectcamera.position.x = 0;

//   console.log("Perspectcamera.position", Perspectcamera.position);

//   const { camera, gl } = useThree();
//   const orbitControls = new OrbitControls(camera, gl.domElement);
//   orbitControls.enableDamping = true;
//   orbitControls.minDistance = 5;
//   orbitControls.maxDistance = 15;
//   orbitControls.enablePan = false;
//   orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
//   orbitControls.update();

//   return null;
// };

function App() {
  const [PlayerArry, setPlayerArry] = useState([]);
  const [myId, setMyId] = useState("");
  const [coinsArray, setCoinsArray] = useState([]);

  const [cameraMoveInfo, setCameraMoveInfo] = useRecoilState(CameraMoveInfo);
  console.log("ATOM : cameraMoveInfo", cameraMoveInfo);

  socket.on("init", ({ id, playersArrayServer, coinsArrayServer }) => {
    setMyId(id);
    setPlayerArry(playersArrayServer);
    setCoinsArray(coinsArrayServer);

    socket.on("move-otherPlayer", (playersArrayServer) => {
      setPlayerArry(playersArrayServer);
    });
    socket.on("coin-destroied", (coinsArrayServer) => {
      setCoinsArray(coinsArrayServer);
    });
  });

  return (
    <CanvasContainer>
      <Canvas shadows>
        {/* <CameraController /> */}
        <ambientLight />
        <directionalLight
          position={[10, 10, 10]}
          color="white"
          intensity={1}
          castShadow
        />
        <Player id={myId} socket={socket} coinsArray={coinsArray} />
        {PlayerArry.map((otherPlayer, index) => {
          return (
            <OtherPlayers
              key={index}
              id={otherPlayer.id}
              x={otherPlayer.x}
              z={otherPlayer.z}
            />
            // <group key={index}>
            //   <mesh position={[otherPlayer.x, 0.5, otherPlayer.z]}>
            //     <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
            //     <meshStandardMaterial attach="material" color="fuchsia" />
            //   </mesh>
            // </group>
          );
        })}
        {coinsArray.map((coin, index) => {
          return <Coin key={index} id={coin.id} x={coin.x} z={coin.z} />;
        })}
        <GroundField />
        <axesHelper args={[10]} />
      </Canvas>
    </CanvasContainer>
  );
}

export default App;
