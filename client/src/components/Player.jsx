import React, { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { CameraMoveInfo } from "../atoms";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";

function Player({ id, socket, coinsArray }) {
  const myMove = useRef(null);
  const [myMoveInfo, setMyMoveInfo] = React.useState({});
  const [cameraFollow, setCameraFollow] = React.useState({ x: 0, y: 0, z: 0 });
  // const [cameraMoveInfo, setCameraMoveInfo] = useRecoilState(CameraMoveInfo);
  // console.log("cameraMoveInfo", cameraMoveInfo);

  const CameraController = () => {
    const Perspectcamera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    Perspectcamera.position.y = 0;
    Perspectcamera.position.z = cameraFollow.z;
    Perspectcamera.position.x = cameraFollow.x;

    console.log("Perspectcamera.position", Perspectcamera.position);

    const { camera, gl } = useThree();
    const orbitControls = new OrbitControls(camera, gl.domElement);
    orbitControls.enableDamping = true;
    orbitControls.minDistance = 5;
    orbitControls.maxDistance = 15;
    orbitControls.enablePan = false;
    orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
    orbitControls.update();

    return null;
  };

  const UpdateCameraMove = (x, y, z) => {
    return setCameraFollow({ x, y, z });
  };

  document.onkeydown = (e) => {
    switch (e.keyCode) {
      case 37:
        myMove.current.position.x = myMove.current.position.x -= 0.5;
        break;
      case 39:
        myMove.current.position.x = myMove.current.position.x += 0.5;
        break;
      case 38:
        myMove.current.position.z = myMove.current.position.z -= 0.5;
        break;
      case 40:
        myMove.current.position.z = myMove.current.position.z += 0.5;
        break;
      default:
    }

    const myIno = {
      id: id,
      x: myMove.current.position.x,
      z: myMove.current.position.z,
      point: 0,
    };

    setMyMoveInfo(myIno);
    console.log("myIno", myIno);

    let target = coinsArray.filter((coin) => {
      return (
        coin.x <= myIno.x + 1 &&
        coin.x >= myIno.x - 1 &&
        coin.z <= myIno.z + 1 &&
        coin.z >= myIno.z - 1
      );
    });

    // console.log("target", target);
    if (target.length > 0) {
      socket.emit("coin-taken", target[0].id, myIno.id);
    }
    socket.emit("move-myPlayer", myIno);
  };

  useEffect(() => {
    UpdateCameraMove(
      myMove.current.position.x,
      myMove.current.position.y,
      myMove.current.position.z
    );
  }, [myMoveInfo]);

  return (
    <>
      <CameraController />
      <group ref={myMove}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
          <meshStandardMaterial attach="material" color="fuchsia" />
        </mesh>
      </group>
    </>
  );
}

export default Player;
