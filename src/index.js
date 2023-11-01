import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// Styles
// -----------------------------
const bgColor = "bg-violet-600";
const infoTextColor = "text-yellow-400";

const colorStyleMap = {
  "text-red-400": { color: "rgb(248 113 113)" },
  "text-green-400": { color: "rgb(74 222 128)" },
  "text-blue-400": { color: "rgb(96 165 250)" },
  "text-yellow-400": { color: "rgb(250 204 21)" },
};

const infoTextStyle =
  "text-xl my-4 text-slate-100 font-semibold text-left leading-8";

// avatarColor
// -----------------------------
const AVATAR_COLORS = [
  "bg-red-400",
  "bg-green-400",
  "bg-blue-400",
  "bg-yellow-400",
  "bg-orange-400",
  "bg-lime-400",
  "bg-teal-400",
  "bg-purple-400",
];

function stringModulus(str, modValue) {
  const hash = Array.from(str).reduce(
    (hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0,
    0
  );
  return Math.abs(hash) % modValue;
}

function avatarColor(handle) {
  const idx = stringModulus(handle, AVATAR_COLORS.length);
  return AVATAR_COLORS[idx];
}

// Game logic
// -----------------------------
const SCREEN_WIDTH = 350;
const MULTIPLAYER_SCORE_TO_WIN = 13;

function chooseRandomColor() {
  const colors = ["red", "green", "blue", "yellow"];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

// MulitplayerHeader
// -----------------------------
const stroops = [
  ["red", "text-red-400"],
  ["yellow", "text-blue-400"],
  ["blue", "text-green-400"],
  ["green", "text-blue-400"],
  ["yellow", "text-red-400"],
  ["red", "text-yellow-400"],
  ["green", "text-green-400"],
  ["blue", "text-blue-400"],
  ["red", "text-red-400"],
  ["red", "text-yellow-400"],
  ["yellow", "text-yellow-400"],
  ["red", "text-yellow-400"],
  ["red", "text-red-400"],
  ["blue", "text-green-400"],
];

function MultiplayerHeader() {
  const characters = "Multiplayer".split("").map((c, i) => {
    const textColor = stroops[i][1];
    return (
      <span
        key={i}
        style={colorStyleMap[textColor]}
        className="font-bold text-4xl uppercase my-2"
      >
        {c}
      </span>
    );
  });
  return <div className="flex my-2">{characters}</div>;
}

function Stroop({ label, color }) {
  return (
    <span className={`text-center text-3xl uppercase font-bold m-1 ${color}`}>
      {label}
    </span>
  );
}

// Race
// -----------------------------
function PlayerPosition({ handle, pos, goal, width }) {
  const avatarStyle = avatarColor(handle);
  const shift = Math.round((pos / goal) * width * 0.86);
  const [currentShift, setCurrentShift] = useState(shift);

  useEffect(() => {
    setCurrentShift(shift);
  }, [pos, width]);

  const style = {
    transform: `translateX(${currentShift}px)`,
    transition: "transform 250ms",
  };

  return (
    <div
      className={`absolute w-12 h-12 rounded-full ${avatarStyle}`}
      style={style}
    />
  );
}

function extractPlayerPoints(points, playerId) {
  return points.find((point) => point.userId === playerId).val;
}

function Race({ players, points, goal = MULTIPLAYER_SCORE_TO_WIN }) {
  const width = SCREEN_WIDTH;

  return (
    <div className="my-4">
      <div className="flex justify-start h-12">
        {players.map((p) => (
          <PlayerPosition
            key={p.id}
            handle={p.handle}
            width={width}
            pos={extractPlayerPoints(points, p.id)}
            goal={goal}
          />
        ))}
      </div>
      <span className="flex justify-end text-5xl pt-4">🏆</span>
    </div>
  );
}

// Main
// -----------------------------
function App() {
  const [score, setScore] = useState(0);
  const [label, setLabel] = useState(chooseRandomColor());
  const [color, setColor] = useState(chooseRandomColor());

  const onClick = (sqColor) => {
    if (sqColor == label) {
      setScore((prevScore) => prevScore + 1);
      setLabel(chooseRandomColor());
      setColor(chooseRandomColor());
    } else {
      setScore((prevScore) => Math.max(prevScore - 2, 0));
    }
  };

  const Grid = ({ onClick }) => (
    <div className="flex flex-wrap justify-center my-4 mx-8">
      <div>
        <div
          onClick={() => onClick("red")}
          className="w-28 h-28 bg-red-400 m-1 hover:cursor-pointer"
        ></div>
        <div
          onClick={() => onClick("green")}
          className="w-28 h-28 bg-green-400 m-1 hover:cursor-pointer"
        ></div>
      </div>
      <div>
        <div
          onClick={() => onClick("blue")}
          className="w-28 h-28 bg-blue-400 m-1 hover:cursor-pointer"
        ></div>
        <div
          onClick={() => onClick("yellow")}
          className="w-28 h-28 bg-yellow-400 m-1 hover:cursor-pointer"
        ></div>
      </div>
    </div>
  );

  const colorKey = `text-${color}-400`;
  const labelColor = `text-${label}-400`;
  return (
    <div className={`${bgColor} py-8`}>
      <div className={`flex-col text-center w-[${SCREEN_WIDTH}px] mx-auto`}>
        <div className="flex flex-wrap space-x-2 items-center justify-center my-4">
          {stroops.map(([label, color], i) => (
            <Stroop key={i} label={label} color={color} />
          ))}
        </div>
        <span className={infoTextStyle}>
          Do you find it a little difficult to read some of the words above? It
          can be a little confusing to{" "}
          <span className="text-red-400 font-bold">read</span> one color, but
          <span className="text-green-400 font-bold"> see</span> another -- this
          is known as the{" "}
          <span className="text-center font-bold">Stroop Effect!</span>
        </span>

        <div className="flex-col justify-center items-center my-4">
          <span
            style={colorStyleMap[colorKey]}
            className="font-bold text-5xl uppercase"
          >
            {label}
          </span>
          <Grid onClick={onClick} />
          <div className="font-bold text-5xl uppercase text-slate-100 my-4">
            {score}
          </div>
          <span className={infoTextStyle}>
            Your goal is to press the{" "}
            <span style={colorStyleMap[labelColor]}>square</span> that matches
            the <span style={colorStyleMap[labelColor]}>written label</span>.
            When you click the right color, you score points. When you click the
            wrong color, you lose points!
          </span>
          <div className="flex justify-center">
            <MultiplayerHeader />
          </div>
          <span className={infoTextStyle}>
            You can play Stroopwafel against other people! Either host a game by
            creating a room or join a friend's game via code.
          </span>
          <div className="w-full my-4">
            <Race
              goal={MULTIPLAYER_SCORE_TO_WIN}
              players={[
                { id: 1, handle: "moop" },
                { id: 2, handle: "boop" },
              ]}
              points={[
                { userId: 1, val: Math.min(score, MULTIPLAYER_SCORE_TO_WIN) },
                { userId: 2, val: 6 },
              ]}
            />
            <span
              style={colorStyleMap[colorKey]}
              className="font-bold text-5xl uppercase my-4 text-center"
            >
              {label}
            </span>
            <Grid onClick={onClick} />
            {score >= MULTIPLAYER_SCORE_TO_WIN && (
              <div>
                <div className="text-yellow-400 text-center text-4xl font-bold my-4">
                  You win!
                </div>
                <div
                  className="py-2 px-4 text-xl text-center text-red-200 hover:cursor-pointer"
                  onClick={() => setScore(0)}
                >
                  Reset
                </div>
              </div>
            )}
          </div>
          <span className={infoTextStyle}>
            When you play against others your in a race to see who can get
            through all the words the fastest. First to reach the trophy wins!
          </span>
        </div>
        <div className="my-4">Let's play!</div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
