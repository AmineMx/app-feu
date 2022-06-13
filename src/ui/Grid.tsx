import { useState } from "react";
import produce from "immer";
import { useRef } from "react";
import { useCallback } from "react";
import { Button, Form } from "react-bootstrap";
import { sample } from "underscore";

const generateEmptyGrid = (n: number, p: number = 0.1) => {
  const rows = [];
  //le nombre d’arbres est ntrees=n2×p.
  const ntrees = (n ^ 2) * p;
  for (let i = 0; i < n; i++) {
    const a = Array(n).fill(1);
    const ntr = Array.from(a.keys());
    //avec la fonction sample du module underscore, on tire au hasard l’échantillon de ntrees arbres parmi les n2 emplacements possibles.
    sample(ntr, ntrees).forEach((i) => (a[i] = 0));
    rows.push(a);
  }

  return rows;
};

//  Voisinage de Von Neumann
const neighborhoodIndex = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const cellColor: string[] = ["#fff", "#198754", "#dc3545", "#6c757d"];
export const Grid = (props: { n: number }) => {
  const { n } = props;

  const [density, setDensity] = useState(10);
  const [iteration, setIteration] = useState(0);
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid(n, density / 100);
  });
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setIteration((it) => it + 1);
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        const toFire: number[][] = [];
        const toAshes: number[][] = [];
        for (let i = 0; i < n; i++) {
          for (let k = 0; k < n; k++) {
            const cellState = gridCopy[i][k];
            if (cellState === 0) {
              continue;
            }
            //passage de state en feu vers
            if (cellState === 2) {
              toAshes.push([i, k]);

              continue;
            }
            if (cellState === 1) {
              //pour chaque voisinage de Von Neumann

              for (let [x, y] of neighborhoodIndex) {
                const newI = i + x;
                const newK = k + y;
                if (newI < 0 || newI >= n || newK < 0 || newK >= n) {
                  console.log("out of bound", newI, newK);

                  break;
                }
                const s = gridCopy[newI][newK];
                if (s === 2) {
                  toFire.push([i, k]);
                  break;
                }
              }
            }
          }
        }

        toFire.forEach(([i, k]) => {
          gridCopy[i][k] = 2;
        });

        toAshes.forEach(([i, k]) => {
          gridCopy[i][k] = 3;
        });
      });
    });

    setTimeout(runSimulation, 20);
  }, []);
  const regenrate = useCallback((density: number) => {
    console.log(density);
    setIteration(0);
    setGrid(generateEmptyGrid(n, density / 100));
  }, []);
  return (
    <>
      <div className="row">
        <div className="col-8 p-2">
          <Button
            variant="primary"
            onClick={() => {
              setRunning(!running);
              if (!running) {
                runningRef.current = true;
                runSimulation();
              }
            }}
          >
            {running ? "stop" : "start"}
          </Button>
          <Button className="m-2" onClick={() => regenrate(density)}>
            Generate
          </Button>
          <span>Iteration : {iteration}</span>
        </div>
        <div className="col-4">
          <Form.Label>Density : {density}%</Form.Label>
          <Form.Range
            value={density}
            max={100}
            min={1}
            step={1}
            onChange={(e) => setDensity(e.target.valueAsNumber)}
          />
        </div>
      </div>
      <div
        style={{
          border: "1px solid #000",
          width: `${n * 10 + 2}px`,
          display: "grid",
          gridTemplateColumns: `repeat(${n}, 10px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                if (grid[i][k] !== 1) {
                  return;
                }
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][k] = 2;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 10,
                height: 10,
                backgroundColor: cellColor[grid[i][k]],
                // border: "solid 1px black",
              }}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Grid;
