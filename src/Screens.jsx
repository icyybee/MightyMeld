import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";
import WrongCardTrack from "../src/tracks/wrongcard.mp3";
import RightCardTrack from "../src/tracks/rightcard.mp3";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function StartScreen({ start }) {
  return (
    <div className="animate__animated animate__fadeInDown h-screen w-full flex items-center justify-center">
      <div className="start__card relative overflow-hidden size-[315px] rounded-lg">
        <div className="bg-pink-50 rounded-md absolute z-10 size-[300px] inset-2 py-[43px] flex flex-col items-center">
          <h1 className="text-center text-pink-500 font-bold text-[32px]">
            Memory
          </h1>
          <p className="text-xs text-pink-500 font-medium mt-4">
            Flip over tiles looking for pairs
          </p>
          <button
            onClick={start}
            className="animate__animated animate-pulse animate__slow mt-10 text-white px-10 h-[37px] rounded-[20px] shadow-md bg-gradient-to-b from-pink-400 to-pink-600 hover:from-pink-600 hover:to-pink-600 transition-all ease-in-out active:translate-y-[2px] hover:scale-[1.05]"
          >
            Play
          </button>
        </div>
      </div>
    </div>
  );
}

export function PlayScreen({ end }) {
  const RightCardRef = useRef(new Audio(RightCardTrack));
  const WrongCardRef = useRef(new Audio(WrongCardTrack));

  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);
  const [wronglyMatched, setWronglyMatched] = useState(false);

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 100,
        });
        newState = "matched";
        RightCardRef.current.play();
      } else {
        WrongCardRef.current.play();
        setWronglyMatched(true);
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(end, 0);
          }
          setWronglyMatched(false);
          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  return (
    <div className="h-screen w-full flex justify-center items-center text-sm font-medium text-indigo-">
      <div className="flex flex-col gap-8">
        <div className="flex gap-2 items-center justify-center">
          <h1 className="text-indigo-500">Tries</h1>
          <div
            className={`w-6 h-[21px] rounded-md flex items-center justify-center bg-indigo-200 text-sm font-medium ${
              tryCount > 10
                ? "animate__animated animate__flash animate__infinite animate__slow text-red-600"
                : "text-indigo-600"
            }`}
          >
            {tryCount}
          </div>
        </div>
        <div className="p-4 bg-indigo-50 rounded-lg grid grid-cols-4 gap-4">
          {getTiles(16).map((tile, i) => (
            <Tile
              key={i}
              flip={() => flip(i)}
              {...tile}
              wronglyMatched={wronglyMatched}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
