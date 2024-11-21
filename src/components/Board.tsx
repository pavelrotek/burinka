import { useState, useEffect, useRef, useLayoutEffect } from "react";
import cx from "classnames";

interface IWORD {
  text: string;
  foundCount?: number;
  used?: IPosition[];
}

interface IHistory {
  index: number;
  array: IHistoryItem[];
}

interface IHistoryItem {
  x: number;
  y: number;
  letter: string;
}

// SIZE = 20;

const WORDS: IWORD[] = [
  { text: "BOUŘKA" },
  { text: "BUŘINKA" },
  { text: "CYLINDR" },
  { text: "ČIKOŠ" },
  { text: "DIPLOMAT" },
  { text: "FLORENTIN" },
  { text: "HUČKA" },
  { text: "KALAP" },
  { text: "KAPIŠON" },
  { text: "KAPOTEK" },
  { text: "KASTOR" },
  { text: "KASTROL" },
  { text: "KAŠKET" },
  { text: "KLAK" },
  { text: "KLOBOUK" },
  { text: "KLOPÁČEK" },
  { text: "KOKRHEL" },
  { text: "KOMÍN" },
  { text: "KVĚTINÁČ" },
  { text: "LODIČKA" },
  { text: "NALEJVÁK" },
  { text: "NAPOLEOŇÁK" },
  { text: "PALOUK" },
  { text: "PANAMA" },
  { text: "PLSŤÁK" },
  { text: "PLYŠÁK" },
  { text: "SLAMÁK" },
  { text: "SOMBRERO" },
  { text: "ŠIRÁK" },
  { text: "ŠIŠÁK" },
  { text: "TOKA" },
  { text: "TRALALÁČEK" },
  { text: "TURBAN" },
  { text: "TVRĎÁK" },
  { text: "VELURÁK" },
];

function getNewBoard(): string[][] {
  let border = [
    Array(15).fill(undefined),
    Array(15).fill(undefined),
    Array(15).fill(undefined),
    Array(15).fill(undefined),
    Array(15).fill(undefined),
    Array(15).fill(undefined),
    Array(15).fill(undefined),
    Array(15).fill(undefined),
    Array(15).fill(undefined),
    Array(15).fill(undefined),
  ];
  applyBorders(border);
  return border;
}

function applyBorders(board: string[][]) {
  board[0] = Array(15).fill(".");
  board[1][0] = ".";
  board[2][0] = ".";
  board[3][0] = ".";
  board[4][0] = ".";
  board[5][0] = ".";
  board[6][0] = ".";
  board[7][0] = ".";
  board[8][0] = ".";
  board[9][0] = ".";
  board[1][0] = ".";
  board[1][14] = ".";
  board[2][0] = ".";
  board[2][14] = ".";
  board[3][0] = ".";
  board[3][14] = ".";
  board[4][0] = ".";
  board[4][14] = ".";
  board[5][0] = ".";
  board[5][14] = ".";
  board[6][0] = ".";
  board[6][14] = ".";
  board[7][0] = ".";
  board[7][14] = ".";
  board[8][0] = ".";
  board[8][14] = ".";
  board[9] = Array(15).fill(".");

  board[1][1] = ".";
  board[1][2] = ".";
  board[1][12] = ".";
  board[1][13] = ".";
  board[2][1] = ".";
  board[2][13] = ".";

  board[5][4] = "B";
  board[5][5] = "U";
  board[5][6] = "Ř";
  board[5][7] = "I";
  board[5][8] = "N";
  board[5][9] = "K";
  board[5][10] = "A";
}

interface ICell {
  i: number;
  j: number;
}

export function Board() {
  const [cell, setCell] = useState<ICell>({ i: 1, j: 3 });
  const history = useRef<IHistory>({ index: 0, array: [] });

  const [mode, setMode] = useState<"init" | "localstorage" | "board">("init");

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const lastEnteredField = useRef<any>();
  const [board, setBoard] = useState(applyHistory());
  const [words, setWords] = useState(WORDS);
  const [hoverWord, setHoverWord] = useState<IWORD | undefined>();

  useLayoutEffect(() => {
    const h: IHistory = getLocalStorage();
    if (h && h.index > 0) {
      setMode("localstorage");
    } else {
      setMode("board");
      const b = applyHistory();
      setBoard(b);
      setWords(findWords(words, b));
    }
  }, []);

  function checkAvailability(i: number, j: number) {
    if (board[i][j] === ".") return false;
    return true;
  }

  function checkReadonly(i: number, j: number) {
    if (i == 5 && j == 4) return true;
    if (i == 5 && j == 5) return true;
    if (i == 5 && j == 6) return true;
    if (i == 5 && j == 7) return true;
    if (i == 5 && j == 8) return true;
    if (i == 5 && j == 9) return true;
    if (i == 5 && j == 10) return true;

    return false;
  }

  function handleOnClick(i: number, j: number) {
    if (!checkAvailability(i, j)) return;
    setCell({
      i,
      j,
    });
  }

  function applyHistory() {
    let b = getNewBoard();

    history.current.array.forEach((h, i) => {
      if (i >= history.current.index) return;
      if (h.x > 0 && h.x < b.length && h.y > 0 && h.y < b[h.x].length) {
        b[h.x][h.y] = h.letter;
      }
    });
    applyBorders(b);

    return [...b];
  }

  useEffect(() => {
    function handleKeyDown(event: any) {
      if (event.code === "ArrowUp") {
        let i = cell.i - 1;
        let j = cell.j;
        if (board[i][j] == ".") return;
        setCell({ i, j });
      }
      if (event.code === "ArrowDown") {
        let i = cell.i + 1;
        let j = cell.j;
        if (board[i][j] == ".") return;
        setCell({ i, j });
      }
      if (event.code === "ArrowLeft") {
        let i = cell.i;
        let j = cell.j - 1;
        if (board[i][j] == ".") return;
        setCell({ i, j });
      }
      if (event.code === "ArrowRight") {
        let i = cell.i;
        let j = cell.j + 1;
        if (board[i][j] == ".") return;
        setCell({ i, j });
      }

      if (lastEnteredField.current) {
        handleAddItemToHistory({
          x: cell.i,
          y: cell.j,
          letter: lastEnteredField.current,
        });
        lastEnteredField.current = undefined;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  function handleAddItemToHistory(i: IHistoryItem) {
    let item = i;
    //check if item has not been set at the beginning
    if (checkReadonly(i.x, i.y)) {
      i.letter = board[i.x][i.y];
    }
    history.current.array = history.current.array.slice(
      0,
      history.current.index
    );
    history.current.array.push(item);
    history.current.index++;
    setLocalStorage(history.current);

    const b = applyHistory();
    setBoard(b);
    setWords(findWords(words, b));
  }

  function moveStart(direction: "left" | "right" | "up" | "down") {
    switch (direction) {
      case "left": {
        history.current.array = history.current.array.map((h) => {
          return { ...h, y: h.y - 1 };
        });
        break;
      }
      case "right": {
        history.current.array = history.current.array.map((h) => {
          return { ...h, y: h.y + 1 };
        });
        break;
      }
      case "up": {
        history.current.array = history.current.array.map((h) => {
          return { ...h, x: h.x - 1 };
        });
        break;
      }
      case "down": {
        history.current.array = history.current.array.map((h) => {
          return { ...h, x: h.x + 1 };
        });
        break;
      }
    }

    setLocalStorage(history.current);

    const b = applyHistory();
    setBoard(b);
    setWords(findWords(words, b));
  }

  function handleUndoHistory() {
    if (history.current.array.length > 0 && history.current.index > 0) {
      history.current.index--;
    }
    const b = applyHistory();
    setBoard(b);
    setWords(findWords(words, b));
  }

  function handleRedoHistory() {
    if (history.current.index < history.current.array.length) {
      history.current.index++;
    }
    const b = applyHistory();
    setBoard(b);
    setWords(findWords(words, b));
  }

  function handleNew() {
    history.current.index = 0;
    history.current.array = [];
    setLocalStorage(history.current);
    const b = applyHistory();
    setBoard(b);
    setWords(findWords(words, b));
  }

  function countHeat(x: number, y: number, words: IWORD[]) {
    let count = 0;
    words.forEach((w) => {
      w.used?.forEach((p) => {
        if (p.x == x && p.y == y) {
          count++;
        }
      });
    });
    return count;
  }

  if (mode == "localstorage") {
    return (
      <div className="flex flex-col space-y-2 m-4">
        <div>Byl nalezena uložená data. Chcete je načíst?</div>
        <div className="flex flex-row space-x-2">
          <Button
            className="w-full"
            onClick={() => {
              history.current = JSON.parse(textAreaRef.current?.value!) || {
                index: 0,
                array: [],
              };
              const b = applyHistory();
              setBoard(b);
              setWords(findWords(words, b));
              setMode("board");
            }}
          >
            Načíst
          </Button>
          <Button
            className="w-full"
            onClick={() => {
              setLocalStorage(history.current);
              setMode("board");
            }}
          >
            Zahodit
          </Button>
        </div>
        <textarea
          className="flex flex-col min-h-[20em] border border-gray-600"
          defaultValue={JSON.stringify(getLocalStorage())}
          ref={textAreaRef}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-row space-x-4 m-1">
      <div className="overflow-auto flex flex-col space-y-2">
        <div className="flex flex-row w-auto">
          <Button
            disabled={history.current.index == 0}
            onClick={handleUndoHistory}
          >
            {"Krok <"}
          </Button>
          <Button
            disabled={history.current.index == history.current.array.length}
            onClick={handleRedoHistory}
          >
            {"Krok >"}
          </Button>
          <Button onClick={handleNew}>{"Nový"}</Button>
        </div>
        <table className="w-auto">
          <tbody>
            {board.map((row, i) => {
              return (
                <tr key={i} className="flex">
                  {row.map((col, j) => {
                    let heat = countHeat(i, j, words);
                    return (
                      <td
                        key={i + "_" + j}
                        style={{
                          backgroundColor:
                            countHeat(i, j, hoverWord ? [hoverWord] : []) > 0
                              ? "gray"
                              : heat > 0
                              ? heatMapColorforValue(heat)
                              : col === "."
                              ? "lightgray"
                              : "white",
                        }}
                        className={cx(
                          "flex w-[2em] h-[2em] border justify-center",
                          {
                            "border-black": cell.i == i && cell.j == j,
                            "hover:border-blue-800": col !== ".",
                          }
                        )}
                        onClick={() => handleOnClick(i, j)}
                      >
                        {cell.i == i && cell.j == j ? (
                          <Input
                            value={lastEnteredField.current || col}
                            onChange={(value) => {
                              lastEnteredField.current = value;
                            }}
                            onBlur={() => {
                              if (lastEnteredField.current) {
                                handleAddItemToHistory({
                                  x: cell.i,
                                  y: cell.j,
                                  letter: lastEnteredField.current,
                                });
                                lastEnteredField.current = undefined;
                              }
                            }}
                          />
                        ) : col !== "." ? (
                          col
                        ) : (
                          ""
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {/*<div className="grid grid-cols-3 w-[24em] md:w-[32em]">
          <Button
            className="col-start-2 col-span-1"
            onClick={() => moveStart("up")}
          >
            {"^"}
          </Button>
          <Button
            className="col-start-1 col-span-1"
            onClick={() => moveStart("left")}
          >
            {"<"}
          </Button>
          <div className="col-start-2 col-span-1 bg-gray-300 justify-center border align-center h-[2em]"></div>
          <Button
            className="col-start-3 col-span-1"
            onClick={() => moveStart("right")}
          >
            {">"}
          </Button>
          <Button
            className="col-start-2 col-span-1"
            onClick={() => moveStart("down")}
          >
            {"v"}
          </Button>
                  </div>
          */}
      </div>
      <div className="">
        {words.map((w) => (
          <div key={w.text}>
            <Word setHoverWord={setHoverWord} cell={cell} word={w} />
          </div>
        ))}
      </div>
      {/*      <div className="">
        {letters.map((n) => (
          <div className="text-sm" key={n.key}>
            {n.key} - {n.value}
          </div>
        ))}
      </div>
        */}
    </div>
  );
}

interface IButton {
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}
function Button({ className, disabled = false, onClick, children }: IButton) {
  return (
    <button
      className={cx(
        "flex w-full justify-center border h-[2em] align-center ",
        {
          "bg-red-100 active:bg-red-200": !disabled,
          "bg-gray-100": disabled,
        },
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

interface IInput {
  className?: string;
  value?: string;
  onChange: (value: string) => void;
  onBlur: (value: string) => void;
}

function Input({ value, onChange, onBlur, className }: IInput) {
  function handleOnChange(e: any) {
    const val = e.target.value?.toUpperCase().slice(-1);
    onChange(val);
  }

  function handleOnBlur(e: any) {
    onBlur(e.target.value?.toUpperCase().slice(-1));
  }

  return (
    <input
      key={value}
      autoFocus
      autoComplete="off"
      autoSave="true"
      placeholder={value}
      className={cx(
        "placeholder-black bg-transparent caret-transparent text-center p-0.5 max-w-[2em] max-h-[2em] uppercase",
        className
      )}
      onChange={handleOnChange}
      onBlur={handleOnBlur}
    />
  );
}

function Word({
  word,
  cell,
  setHoverWord,
}: {
  word: IWORD;
  cell: ICell;
  setHoverWord: any;
}) {
  let inWord = isInWord(word, cell);
  return (
    <div className="flex flex-row">
      <div
        onMouseEnter={() => setHoverWord(word)}
        onMouseLeave={() => setHoverWord(undefined)}
        className={cx("text-xs", {
          "font-bold line-through": word.foundCount,
          "text-blue-500": inWord,
        })}
      >
        {word.text}
      </div>
      <div className="flex flex-row">
        <div
          className={cx("text-xs text-center", {
            "font-bold": word.foundCount,
            "text-orange-500": word.foundCount && word.foundCount > 1,
          })}
        >
          ({word.foundCount})
        </div>
      </div>
    </div>
  );
}

function findWords(words: IWORD[], board: string[][]) {
  return words.map((w) => {
    findWord(w, board);
    return w;
  });
}

function findWord(word: IWORD, board: string[][]) {
  let foundCount = 0;
  let positions: IPosition[] = [];
  let solutions: IPosition[][] = [];
  for (let i = 1; i < board.length; i++) {
    for (let j = 1; j < board[0].length; j++) {
      if (!board[i][j] || board[i][j].trim().length == 0) continue;
      foundCount += findSolution(
        word.text.split(""),
        { x: i, y: j },
        board,
        positions,
        solutions
      );
    }
  }

  word.foundCount = foundCount;
  let used = new Map();
  solutions.forEach((s) => {
    s.forEach((v) => used.set(v.x * 100 + v.y, v));
  });
  word.used = [...used.values()];
}

function findSolution(
  letters: string[],
  position: IPosition,
  board: string[][],
  positions: IPosition[],
  solutions: IPosition[][]
): number {
  let found = 0;
  const firstLetter = letters.shift();
  if (board[position.x][position.y] === ".") return 0;
  if (firstLetter == board[position.x][position.y]) {
    positions.push(position);
    if (letters.length == 0) {
      solutions.push([...positions]);
      return 1;
    }
    for (let d = 0; d < DIRECTIONS.length; d++) {
      const newC = move(position, d);
      found += findSolution([...letters], newC, board, positions, solutions);
    }
    positions.pop();
  }
  return found;
}

function move(position: IPosition, direction: number) {
  return {
    x: position.x + DIRECTIONS[direction].x,
    y: position.y + DIRECTIONS[direction].y,
  };
}

interface IPosition {
  x: number;
  y: number;
}

const DIRECTIONS: IPosition[] = [
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: -1 },
  { x: -1, y: 0 },
  { x: -1, y: 1 },
];

function heatMapColorforValue(count: number) {
  if (count == 0) return "white";
  var h = (1 - Math.min(6, count) / 6) * 256;
  return "hsl(" + h + ", 80%, 80%)";
}

function setLocalStorage(history: IHistory) {
  localStorage.setItem("history", JSON.stringify(history));
}

function getLocalStorage() {
  let item = localStorage.getItem("history");
  return item && JSON.parse(item);
}

function isInWord(word: IWORD, cell: ICell) {
  let found = false;
  word.used?.forEach((p) => {
    if (p.x == cell.i && p.y == cell.j) {
      found = true;
    }
  });
  return found;
}
