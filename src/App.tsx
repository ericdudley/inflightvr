import { Fragment, useEffect, useState } from "react";
import { Camera, Entity, Globe, Scene, Viewer, useCesium } from "resium";
import "./App.css";
import rawData from "./data.json";
let data = rawData as Data;
import { Ion } from "cesium";

Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5NTI0N2QxZi02OGM2LTQ4NmQtOThiZC1lMGRlNzdmNGExMTkiLCJpZCI6MTg1Mzk4LCJpYXQiOjE3MDMwMzAzNDl9.zrryI43JaiIomLJAFrFurownKzveN-JxWL1ChoEtyOk";

// Filter out duplicate points
data = data.filter(
  (d, i) =>
    i === 0 ||
    !isCloseFloat(d.latitude, data[i - 1].latitude) ||
    !isCloseFloat(d.longitude, data[i - 1].longitude) ||
    !isCloseFloat(d.altitude, data[i - 1].altitude)
);

function smoothData(data: Data, k: number) {
  return data.map((d, i) => {
    // Determine the range for averaging
    const startIdx = Math.max(i - k, 0);
    const endIdx = Math.min(i + k, data.length - 1);
    const count = endIdx - startIdx + 1;

    // Calculate the sum of latitudes, longitudes, and altitudes within the range
    let sumLatitude = 0,
      sumLongitude = 0,
      sumAltitude = 0,
      sumHeading = 0;
    for (let j = startIdx; j <= endIdx; j++) {
      sumLatitude += data[j].latitude;
      sumLongitude += data[j].longitude;
      sumAltitude += data[j].altitude;
      sumHeading += data[j].heading;
    }

    // Calculate averages
    return {
      ...d,
      latitude: sumLatitude / count,
      longitude: sumLongitude / count,
      altitude: sumAltitude / count,
      heading: sumHeading / count,
    };
  });
}

// Usage
data = smoothData(data, 15);

const DURATION_MS = 16;
const ROUTE_SIZE = 10;
const INTERPOLATION_RATIO = 10;

function isCloseFloat(a: number, b: number) {
  return Math.abs(a - b) < 0.00001;
}

const headingToCartesian3 = (heading: number) => {
  const radians = (heading * Math.PI) / 180;
  return new Cartesian3(Math.sin(radians), Math.cos(radians), 0);
};

const positionToUpCartesian3 = (position: Cartesian3) => {
  const transform = Transforms.eastNorthUpToFixedFrame(position);
  const up = new Cartesian3(transform[8], transform[9], transform[10]);
  Cartesian3.normalize(up, up);
  return up;
};

function getInterpolatedPosition(
  start: Cartesian3,
  end: Cartesian3,
  t: number
) {
  const startCartographic = Cartographic.fromCartesian(start);
  const endCartographic = Cartographic.fromCartesian(end);
  const startLatitude = startCartographic.latitude;
  const startLongitude = startCartographic.longitude;
  const endLatitude = endCartographic.latitude;
  const endLongitude = endCartographic.longitude;
  const startAltitude = startCartographic.height;
  const endAltitude = endCartographic.height;

  const latitude = startLatitude + (endLatitude - startLatitude) * t;
  const longitude = startLongitude + (endLongitude - startLongitude) * t;
  const altitude = startAltitude + (endAltitude - startAltitude) * t;

  return Cartesian3.fromRadians(longitude, latitude, altitude);
}

import { Cartesian3, Cartographic, Color, Transforms } from "cesium";

interface Datum {
  latitude: number;
  longitude: number;
  altitude: number;
  heading: number;
}

const positions = data.map((d) =>
  Cartesian3.fromDegrees(d.longitude, d.latitude, d.altitude)
);

type Data = Datum[];

const highlightPointGraphics = { pixelSize: 20 };
const polylineGraphics = {
  positions: positions.map((p) => p),
  width: ROUTE_SIZE,
  material: Color.WHITE,
};

function App() {
  const [rawIdx, setRawIdx] = useState(0);
  const idx = Math.floor(rawIdx / INTERPOLATION_RATIO);
  const { viewer } = useCesium();
  const [lookdown, setLookdown] = useState(0);

  useEffect(() => {
    let interval: any;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setRawIdx(
          (idx) => (idx + 1) % (positions.length * INTERPOLATION_RATIO)
        );
        console.count("test");
      }, DURATION_MS);
    }, 500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  let cameraPosition = Cartesian3.fromDegrees(
    data[idx].longitude,
    data[idx].latitude,
    data[idx].altitude + 10
  );

  let nextCameraPosition =
    idx > 0 && idx < positions.length - 1
      ? Cartesian3.fromDegrees(
          data[(idx + 1) % positions.length].longitude,
          data[(idx + 1) % positions.length].latitude,
          data[(idx + 1) % positions.length].altitude + 10
        )
      : null;

  let nextCameraLookAtPosition =
    idx > 0 && idx < positions.length - 1
      ? Cartesian3.fromDegrees(
          data[(idx + 1) % positions.length].longitude,
          data[(idx + 1) % positions.length].latitude,
          viewer?.scene?.globe?.getHeight(
            Cartographic.fromDegrees(
              data[(idx + 1) % positions.length].longitude,
              data[(idx + 1) % positions.length].latitude
            )
          ) ??
            Math.max(
              0,
              data[idx % positions.length].altitude -
                ((lookdown + 40) / 100) * 1000
            )
        )
      : null;

  const directionToNextPosition = nextCameraLookAtPosition
    ? new Cartesian3(
        nextCameraLookAtPosition.x - cameraPosition.x,
        nextCameraLookAtPosition.y - cameraPosition.y,
        nextCameraLookAtPosition.z - cameraPosition.z
      )
    : headingToCartesian3(data[idx].heading);

  Cartesian3.normalize(directionToNextPosition, directionToNextPosition);

  if (nextCameraPosition) {
    cameraPosition = getInterpolatedPosition(
      cameraPosition,
      nextCameraPosition,
      (rawIdx % INTERPOLATION_RATIO) / INTERPOLATION_RATIO
    );
  }

  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <div className="flex items-center gap-8 h-16 px-4">
          <h1 className="text-2xl font-bold mr-2">Inflight VR</h1>
          <p>{Math.floor(data[(idx + 1) % positions.length].altitude)}ft</p>
          <div className="flex flex-col gap-2 items-start">
            <label htmlFor="lookdown">Lookdown</label>
            <input
              id="lookdown"
              type="range"
              min="0"
              max="100"
              value={lookdown}
              onChange={(e) => setLookdown(parseInt(e.target.value))}
            />
          </div>
        </div>

        <div style={{ height: "90%" }}>
          <Viewer
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Scene />
            <Globe />
            {/* <CameraFlyTo
              // position={cameraPosition}
              destination={cameraPosition}
              duration={(DURATION_MS * RATIO) / 1000}
              orientation={
                {
                  heading:
                    (data[idx].heading / 180) * Math.PI +
                    (camera === "backward" ? Math.PI : 0),
                  pitch:
                    camera === "down"
                      ? -Math.PI / 2
                      : camera === "angle"
                      ? -Math.PI / 4
                      : -Math.PI / 16,
                  roll: 0.0,
                } as any
              }
            /> */}
            <Camera
              position={cameraPosition}
              direction={directionToNextPosition}
              up={positionToUpCartesian3(positions[idx])}
              // Convert this to
            />
            {/* <CameraLookAt
              offset={
                new Cartesian3(
                  cameraPosition.x -
                    positions[Math.min(positions.length - 1, idx + 10)].x,
                  cameraPosition.y -
                    positions[Math.min(positions.length - 1, idx + 10)].y,
                  cameraPosition.z -
                    positions[Math.min(positions.length - 1, idx + 10)].z
                )
              }
              target={positions[Math.min(positions.length - 1, idx + 10)]}
            /> */}
            <Entity
              polyline={polylineGraphics}
              description="This is a description"
            />
            {/* {headingPolylineGraphics.map((graphics, i) => (
              <Entity
                key={i}
                polyline={graphics}
                description="This is a description"
              />
            ))} */}
            {positions.map((_p, i) => (
              <Fragment key={i}>
                {/* <Entity
                  position={p}
                  point={pointGraphics}
                  description="This is a description"
                /> */}
                {/* <PolylineCollection>
                  <Polyline
                    positions={i > 0 ? [positions[i - 1], p] : []}
                    width={ROUTE_SIZE}
                  />
                </PolylineCollection> */}
                {/* <Entity
                  position={p}
                  polyline={{
                    positions:
                      i > 0
                        ? [
                            p,
                            new Cartesian3(
                              p.x +
                                headingToCartesian3(data[i].heading).x * 100,
                              p.y +
                                headingToCartesian3(data[i].heading).y * 100,
                              p.z + headingToCartesian3(data[i].heading).z * 100
                            ),
                          ]
                        : [],
                    width: ROUTE_SIZE,
                    material: Color.RED,
                  }}
                  description="This is a description"
                /> */}

                {/* <PolylineCollection>
                  <Polyline
                    positions={
                      i > 0 ? [p, headingToCartesian3(data[i].heading)] : []
                    }
                    width={ROUTE_SIZE}
                    material={RedMAterial}
                  />
                </PolylineCollection> */}
              </Fragment>
            ))}
            <Entity
              position={positions[idx]}
              point={highlightPointGraphics}
              description="This is a description"
            >
              {/* <ModelGraphics uri={file} /> */}
              {/* <Model url={file}  /> */}
              {/* </ModelGraphics> */}
            </Entity>
          </Viewer>
        </div>
      </div>
    </div>
  );
}

export default App;
