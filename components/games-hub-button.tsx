"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BrainCircuit,
  Crown,
  Gamepad2,
  Grid3X3,
  Layers3,
  MoveLeft,
  Sparkles,
  Sword,
  Trophy,
  Waves,
  X,
} from "lucide-react";
import { Fragment, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

type GameId =
  | "tictactoe"
  | "rps"
  | "snake"
  | "memory"
  | "game2048"
  | "chess"
  | "flappy"
  | "pacman"
  | "dino"
  | "typing";
type RpsChoice = "Rock" | "Paper" | "Scissors";
type TicCell = "X" | "O" | null;
type Direction = "up" | "down" | "left" | "right";
type ChessColor = "white" | "black";
type ChessPieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
type ChessPiece = `${ChessColor}-${ChessPieceType}` | null;

interface GameStats {
  wins: number;
  losses: number;
  draws: number;
  streak: number;
  bestStreak: number;
  bestScore: number;
  bestMoves: number | null;
}

type ArcadeStats = Record<GameId, GameStats>;

interface MemoryCard {
  id: number;
  symbol: string;
  hue: string;
}

interface ChessMove {
  row: number;
  col: number;
}

interface ChessSelection {
  row: number;
  col: number;
}

const STORAGE_KEY = "suzzy-arcade-stats-v1";
const rpsChoices: RpsChoice[] = ["Rock", "Paper", "Scissors"];
const memorySymbols = [
  { symbol: "✦", hue: "from-blue-500 to-cyan-400" },
  { symbol: "☾", hue: "from-violet-500 to-fuchsia-500" },
  { symbol: "☼", hue: "from-amber-400 to-orange-400" },
  { symbol: "⚡", hue: "from-cyan-400 to-blue-400" },
  { symbol: "♞", hue: "from-pink-400 to-rose-400" },
  { symbol: "♫", hue: "from-emerald-400 to-teal-400" },
] as const;

const initialStats: ArcadeStats = {
  tictactoe: { wins: 0, losses: 0, draws: 0, streak: 0, bestStreak: 0, bestScore: 0, bestMoves: null },
  rps: { wins: 0, losses: 0, draws: 0, streak: 0, bestStreak: 0, bestScore: 0, bestMoves: null },
  snake: { wins: 0, losses: 0, draws: 0, streak: 0, bestStreak: 0, bestScore: 0, bestMoves: null },
  memory: { wins: 0, losses: 0, draws: 0, streak: 0, bestStreak: 0, bestScore: 0, bestMoves: null },
  game2048: { wins: 0, losses: 0, draws: 0, streak: 0, bestStreak: 0, bestScore: 0, bestMoves: null },
  chess: { wins: 0, losses: 0, draws: 0, streak: 0, bestStreak: 0, bestScore: 0, bestMoves: null },
  flappy: { wins: 0, losses: 0, draws: 0, streak: 0, bestStreak: 0, bestScore: 0, bestMoves: null },
  pacman: { wins: 0, losses: 0, draws: 0, streak: 0, bestStreak: 0, bestScore: 0, bestMoves: null },
  dino: { wins: 0, losses: 0, draws: 0, streak: 0, bestStreak: 0, bestScore: 0, bestMoves: null },
  typing: { wins: 0, losses: 0, draws: 0, streak: 0, bestStreak: 0, bestScore: 0, bestMoves: null },
};

const gameMeta = [
  {
    id: "tictactoe" as const,
    title: "Tic-Tac-Toe",
    subtitle: "Neon Grid Duel",
    icon: Grid3X3,
    accent: "from-blue-500 via-cyan-400 to-violet-500",
    description: "A polished classic with a sharp CPU rival.",
  },
  {
    id: "rps" as const,
    title: "Rock Paper Scissors",
    subtitle: "Quick Reflex Round",
    icon: Sword,
    accent: "from-fuchsia-500 via-pink-500 to-rose-500",
    description: "Fast rounds, instant feedback, and streak pressure.",
  },
  {
    id: "snake" as const,
    title: "Snake",
    subtitle: "Glow Trail Arcade",
    icon: Waves,
    accent: "from-emerald-400 via-cyan-400 to-blue-500",
    description: "Smooth retro motion with a modern glass finish.",
  },
  {
    id: "memory" as const,
    title: "Memory Match",
    subtitle: "Card Flip Vault",
    icon: Layers3,
    accent: "from-violet-500 via-fuchsia-500 to-pink-500",
    description: "A clean visual memory challenge with satisfying reveals.",
  },
  {
    id: "game2048" as const,
    title: "2048",
    subtitle: "Tile Merge Flow",
    icon: BrainCircuit,
    accent: "from-amber-400 via-orange-400 to-pink-500",
    description: "Addictive modern puzzle energy in a compact board.",
  },
  {
    id: "chess" as const,
    title: "Chess",
    subtitle: "Mini Battleboard",
    icon: Crown,
    accent: "from-slate-300 via-blue-400 to-violet-500",
    description: "A lightweight chess duel against a quick CPU mover.",
  },
  {
    id: "flappy" as const,
    title: "Flappy Bird",
    subtitle: "Sky Drift Run",
    icon: Sparkles,
    accent: "from-cyan-400 via-sky-400 to-violet-500",
    description: "Tap the bird through glowing pipe gates and chase a cleaner streak.",
  },
  {
    id: "pacman" as const,
    title: "Pac-Man",
    subtitle: "Neon Maze Rush",
    icon: BrainCircuit,
    accent: "from-yellow-300 via-amber-400 to-pink-500",
    description: "Sweep pellets, dodge the ghost, and clear the maze before it catches you.",
  },
  {
    id: "dino" as const,
    title: "Dino Runner",
    subtitle: "Offline Sprint",
    icon: Waves,
    accent: "from-slate-300 via-fuchsia-500 to-blue-500",
    description: "Jump obstacles, build speed, and keep the chrome-style run alive.",
  },
  {
    id: "typing" as const,
    title: "Typing Test",
    subtitle: "Speed Flow Lab",
    icon: Trophy,
    accent: "from-emerald-400 via-teal-400 to-cyan-500",
    description: "Race the timer, keep accuracy high, and lock in a stronger WPM record.",
  },
];

function clampStats(parsed: unknown): ArcadeStats {
  if (!parsed || typeof parsed !== "object") return initialStats;

  const source = parsed as Partial<Record<GameId, Partial<GameStats>>>;
  const next = { ...initialStats };

  for (const key of Object.keys(next) as GameId[]) {
    const entry = source[key];
    if (!entry) continue;

    next[key] = {
      wins: Number(entry.wins) || 0,
      losses: Number(entry.losses) || 0,
      draws: Number(entry.draws) || 0,
      streak: Number(entry.streak) || 0,
      bestStreak: Number(entry.bestStreak) || 0,
      bestScore: Number(entry.bestScore) || 0,
      bestMoves: typeof entry.bestMoves === "number" ? entry.bestMoves : null,
    };
  }

  return next;
}

function createShuffledMemoryDeck() {
  return [...memorySymbols, ...memorySymbols]
    .map((entry, index) => ({
      id: index,
      symbol: entry.symbol,
      hue: entry.hue,
      sort: Math.random(),
    }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ id, symbol, hue }) => ({ id, symbol, hue }));
}

function getRpsResult(player: RpsChoice, cpu: RpsChoice) {
  if (player === cpu) return "draw" as const;
  if (
    (player === "Rock" && cpu === "Scissors") ||
    (player === "Paper" && cpu === "Rock") ||
    (player === "Scissors" && cpu === "Paper")
  ) {
    return "win" as const;
  }

  return "loss" as const;
}

function create2048Board() {
  const board = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0));
  addRandomTile(board);
  addRandomTile(board);
  return board;
}

function addRandomTile(board: number[][]) {
  const empty: Array<[number, number]> = [];
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === 0) {
        empty.push([rowIndex, colIndex]);
      }
    });
  });

  if (empty.length === 0) return;
  const [row, col] = empty[Math.floor(Math.random() * empty.length)];
  board[row][col] = Math.random() < 0.9 ? 2 : 4;
}

function compressLine(values: number[]) {
  const compact = values.filter(Boolean);
  const output: number[] = [];
  let score = 0;

  for (let index = 0; index < compact.length; index += 1) {
    if (compact[index] === compact[index + 1]) {
      const merged = compact[index] * 2;
      output.push(merged);
      score += merged;
      index += 1;
    } else {
      output.push(compact[index]);
    }
  }

  while (output.length < values.length) {
    output.push(0);
  }

  return { line: output, score };
}

function move2048(board: number[][], direction: Direction) {
  const next = board.map((row) => [...row]);
  let score = 0;
  let moved = false;

  const size = next.length;

  const readLine = (index: number) => {
    if (direction === "left" || direction === "right") {
      const row = [...next[index]];
      return direction === "right" ? row.reverse() : row;
    }

    const column = next.map((row) => row[index]);
    return direction === "down" ? column.reverse() : column;
  };

  const writeLine = (index: number, values: number[]) => {
    const normalized = direction === "right" || direction === "down" ? [...values].reverse() : values;

    if (direction === "left" || direction === "right") {
      for (let col = 0; col < size; col += 1) {
        if (next[index][col] !== normalized[col]) moved = true;
        next[index][col] = normalized[col];
      }
      return;
    }

    for (let row = 0; row < size; row += 1) {
      if (next[row][index] !== normalized[row]) moved = true;
      next[row][index] = normalized[row];
    }
  };

  for (let index = 0; index < size; index += 1) {
    const line = readLine(index);
    const compressed = compressLine(line);
    score += compressed.score;
    writeLine(index, compressed.line);
  }

  return { board: next, score, moved };
}

function has2048Moves(board: number[][]) {
  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      const value = board[row][col];
      if (value === 0) return true;
      if (row < board.length - 1 && board[row + 1][col] === value) return true;
      if (col < board[row].length - 1 && board[row][col + 1] === value) return true;
    }
  }

  return false;
}

function checkTicWinner(board: TicCell[]) {
  const combos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of combos) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

function minimax(board: TicCell[], depth: number, maximizing: boolean): number {
  const winner = checkTicWinner(board);
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (board.every(Boolean)) return 0;

  if (maximizing) {
    let best = -Infinity;
    board.forEach((cell, index) => {
      if (cell) return;
      const copy = [...board];
      copy[index] = "O";
      best = Math.max(best, minimax(copy, depth + 1, false));
    });
    return best;
  }

  let best = Infinity;
  board.forEach((cell, index) => {
    if (cell) return;
    const copy = [...board];
    copy[index] = "X";
    best = Math.min(best, minimax(copy, depth + 1, true));
  });
  return best;
}

function getBestTicMove(board: TicCell[]) {
  let bestScore = -Infinity;
  let bestMove = -1;

  board.forEach((cell, index) => {
    if (cell) return;
    const copy = [...board];
    copy[index] = "O";
    const score = minimax(copy, 0, false);

    if (score > bestScore) {
      bestScore = score;
      bestMove = index;
    }
  });

  return bestMove;
}

function createInitialChessBoard(): ChessPiece[][] {
  return [
    ["black-rook", "black-knight", "black-bishop", "black-queen", "black-king", "black-bishop", "black-knight", "black-rook"],
    Array.from({ length: 8 }, () => "black-pawn"),
    Array.from({ length: 8 }, () => null),
    Array.from({ length: 8 }, () => null),
    Array.from({ length: 8 }, () => null),
    Array.from({ length: 8 }, () => null),
    Array.from({ length: 8 }, () => "white-pawn"),
    ["white-rook", "white-knight", "white-bishop", "white-queen", "white-king", "white-bishop", "white-knight", "white-rook"],
  ];
}

function getPieceColor(piece: ChessPiece): ChessColor | null {
  if (!piece) return null;
  return piece.startsWith("white") ? "white" : "black";
}

function getPieceType(piece: ChessPiece): ChessPieceType | null {
  if (!piece) return null;
  return piece.split("-")[1] as ChessPieceType;
}

function isInsideBoard(row: number, col: number) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function getChessMoves(board: ChessPiece[][], row: number, col: number): ChessMove[] {
  const piece = board[row][col];
  const color = getPieceColor(piece);
  const type = getPieceType(piece);
  if (!piece || !color || !type) return [];

  const moves: ChessMove[] = [];
  const pushMove = (nextRow: number, nextCol: number) => {
    if (!isInsideBoard(nextRow, nextCol)) return false;
    const target = board[nextRow][nextCol];
    if (!target) {
      moves.push({ row: nextRow, col: nextCol });
      return true;
    }
    if (getPieceColor(target) !== color) {
      moves.push({ row: nextRow, col: nextCol });
    }
    return false;
  };

  if (type === "pawn") {
    const direction = color === "white" ? -1 : 1;
    const startRow = color === "white" ? 6 : 1;
    if (isInsideBoard(row + direction, col) && !board[row + direction][col]) {
      moves.push({ row: row + direction, col });
      if (row === startRow && !board[row + direction * 2][col]) {
        moves.push({ row: row + direction * 2, col });
      }
    }
    [-1, 1].forEach((offset) => {
      const nextRow = row + direction;
      const nextCol = col + offset;
      if (!isInsideBoard(nextRow, nextCol)) return;
      const target = board[nextRow][nextCol];
      if (target && getPieceColor(target) !== color) {
        moves.push({ row: nextRow, col: nextCol });
      }
    });
    return moves;
  }

  if (type === "knight") {
    [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ].forEach(([dr, dc]) => {
      pushMove(row + dr, col + dc);
    });
    return moves;
  }

  if (type === "king") {
    for (let dr = -1; dr <= 1; dr += 1) {
      for (let dc = -1; dc <= 1; dc += 1) {
        if (dr === 0 && dc === 0) continue;
        pushMove(row + dr, col + dc);
      }
    }
    return moves;
  }

  const directions: Array<[number, number]> = [];
  if (type === "rook" || type === "queen") {
    directions.push([-1, 0], [1, 0], [0, -1], [0, 1]);
  }
  if (type === "bishop" || type === "queen") {
    directions.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
  }

  directions.forEach(([dr, dc]) => {
    let nextRow = row + dr;
    let nextCol = col + dc;
    while (pushMove(nextRow, nextCol)) {
      nextRow += dr;
      nextCol += dc;
    }
  });

  return moves;
}

function moveChessPiece(board: ChessPiece[][], from: ChessSelection, to: ChessMove) {
  const next = board.map((row) => [...row]);
  const piece = next[from.row][from.col];
  const captured = next[to.row][to.col];
  next[from.row][from.col] = null;

  if (piece?.endsWith("pawn") && (to.row === 0 || to.row === 7)) {
    next[to.row][to.col] = `${getPieceColor(piece)}-queen` as ChessPiece;
  } else {
    next[to.row][to.col] = piece;
  }

  return { board: next, captured };
}

function getAllMovesForColor(board: ChessPiece[][], color: ChessColor) {
  const moves: Array<{ from: ChessSelection; to: ChessMove }> = [];
  board.forEach((row, rowIndex) => {
    row.forEach((piece, colIndex) => {
      if (getPieceColor(piece) !== color) return;
      getChessMoves(board, rowIndex, colIndex).forEach((to) => {
        moves.push({ from: { row: rowIndex, col: colIndex }, to });
      });
    });
  });
  return moves;
}

function renderChessPiece(piece: ChessPiece) {
  if (!piece) return "";
  const map: Record<Exclude<ChessPiece, null>, string> = {
    "white-pawn": "♙",
    "white-rook": "♖",
    "white-knight": "♘",
    "white-bishop": "♗",
    "white-queen": "♕",
    "white-king": "♔",
    "black-pawn": "♟",
    "black-rook": "♜",
    "black-knight": "♞",
    "black-bishop": "♝",
    "black-queen": "♛",
    "black-king": "♚",
  };

  return map[piece];
}

function SelectionPreview({ id }: { id: GameId }) {
  if (id === "tictactoe") {
    return (
      <div className="relative h-full overflow-hidden rounded-[1.45rem] bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.22),transparent_32%),linear-gradient(180deg,rgba(10,16,36,0.98),rgba(12,18,42,0.95))] p-3">
        <div className="mb-2 flex items-center justify-between rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[9px] font-mono uppercase tracking-[0.28em] text-cyan-100/80">
          <span>Player X</span>
          <span>2 - 1</span>
          <span>CPU O</span>
        </div>
        <div className="relative grid h-[calc(100%-2rem)] w-full grid-cols-3 gap-2 rounded-[1.25rem] border border-cyan-200/25 bg-[linear-gradient(180deg,rgba(20,28,58,0.94),rgba(18,25,48,0.92))] p-2 shadow-[inset_0_0_20px_rgba(56,189,248,0.12)]">
          {["X", "O", "X", "", "O", "", "O", "", "X"].map((cell, index) => (
            <div
              key={index}
              className="flex items-center justify-center rounded-xl border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] text-sm font-bold text-white/85"
            >
              <span className={cell === "X" ? "text-cyan-300" : cell === "O" ? "text-fuchsia-300" : "text-transparent"}>{cell || "?"}</span>
            </div>
          ))}
          <div className="pointer-events-none absolute left-[18%] top-[52%] h-[2px] w-[64%] rotate-[-35deg] rounded-full bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 shadow-[0_0_16px_rgba(103,232,249,0.7)]" />
        </div>
      </div>
    );
  }

  if (id === "rps") {
    return (
      <div className="relative flex h-full flex-col overflow-hidden rounded-[1.45rem] bg-[linear-gradient(180deg,rgba(62,25,76,0.96),rgba(48,19,68,0.94))] p-3">
        <div className="mb-2 flex items-center justify-between rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[9px] font-mono uppercase tracking-[0.28em] text-pink-100/80">
          <span>Round 8</span>
          <span>2 - 0</span>
          <span>Streak 4</span>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-2">
          <div className="rounded-[1.25rem] border border-emerald-300/20 bg-white/[0.04] p-2.5">
            <p className="text-[9px] font-mono uppercase tracking-[0.26em] text-white/55">You</p>
            <div className="mt-2 flex h-[calc(100%-1.3rem)] items-center justify-center rounded-[1rem] bg-[#2b1638] text-4xl shadow-[inset_0_0_20px_rgba(244,114,182,0.16)]">
              ?
            </div>
          </div>
          <div className="rounded-[1.25rem] border border-cyan-300/20 bg-white/[0.04] p-2.5">
            <p className="text-[9px] font-mono uppercase tracking-[0.26em] text-white/55">CPU</p>
            <div className="mt-2 flex h-[calc(100%-1.3rem)] items-center justify-center rounded-[1rem] bg-[#241a3a] text-4xl shadow-[inset_0_0_20px_rgba(103,232,249,0.14)]">
              ??
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (id === "snake") {
    return (
      <div className="relative h-full overflow-hidden rounded-[1.45rem] bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.16),transparent_34%),linear-gradient(180deg,rgba(7,18,31,0.98),rgba(6,12,24,0.95))] p-3">
        <div className="mb-2 flex items-center justify-between rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[9px] font-mono uppercase tracking-[0.28em] text-emerald-100/80">
          <span>Score 128</span>
          <span>Combo x5</span>
        </div>
        <div className="grid h-[calc(100%-2rem)] w-full grid-cols-8 gap-1 rounded-[1.25rem] border border-emerald-300/20 bg-[#061221]/95 p-2 shadow-[inset_0_0_26px_rgba(16,185,129,0.08)]">
          {Array.from({ length: 48 }, (_, index) => {
            const snakeCells = [10, 11, 12, 13, 21, 29, 37];
            const headCell = 37;
            const foodCells = [17];
            return (
              <div
                key={index}
                className={`rounded-md ${
                  index === headCell
                    ? "bg-gradient-to-br from-cyan-200 to-emerald-300 shadow-[0_0_14px_rgba(94,234,212,0.62)]"
                    : snakeCells.includes(index)
                      ? "bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-[0_0_10px_rgba(45,212,191,0.42)]"
                      : foodCells.includes(index)
                        ? "bg-gradient-to-br from-pink-400 to-fuchsia-500 shadow-[0_0_14px_rgba(236,72,153,0.5)]"
                        : "bg-white/[0.05]"
                }`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  if (id === "memory") {
    return (
      <div className="relative h-full overflow-hidden rounded-[1.45rem] bg-[linear-gradient(180deg,rgba(48,17,67,0.96),rgba(35,14,50,0.94))] p-3">
        <div className="mb-2 flex items-center justify-between rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[9px] font-mono uppercase tracking-[0.28em] text-violet-100/80">
          <span>Moves 12</span>
          <span>Pairs 4/6</span>
        </div>
        <div className="grid h-[calc(100%-2rem)] w-full grid-cols-4 gap-2 rounded-[1.25rem] border border-fuchsia-200/18 bg-[#1a1030]/95 p-2">
          {["?", "?", "?", "?", "?", "?", "?", "?"].map((symbol, index) => (
            <div
              key={index}
              className={`flex items-center justify-center rounded-xl border text-lg ${
                index === 2 || index === 5
                  ? "border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] text-white/28"
                  : "border-fuchsia-200/16 bg-gradient-to-br from-violet-500/30 via-fuchsia-500/24 to-cyan-500/18 text-white/90"
              }`}
            >
              {symbol}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (id === "game2048") {
    return (
      <div className="relative h-full overflow-hidden rounded-[1.45rem] bg-[linear-gradient(180deg,#b78b58,#8f6443)] p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="rounded-xl bg-[#836042] px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.22em] text-[#f3e9db]">Score 3240</div>
          <div className="rounded-xl bg-[#836042] px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.22em] text-[#f3e9db]">Best 8192</div>
        </div>
        <div className="grid h-[calc(100%-2rem)] w-full grid-cols-4 gap-2 rounded-[1.2rem] bg-[#9f7a58]/95 p-2 shadow-[inset_0_0_16px_rgba(255,255,255,0.08)]">
          {[2, 4, 8, 16, 32, 64, 128, 256, 0, 8, 16, 0, 0, 2, 0, 0].map((value, index) => (
            <div
              key={index}
              className={`flex items-center justify-center rounded-xl text-xs font-bold ${
                value === 0
                  ? "bg-[#b69779]/65 text-transparent"
                  : value < 16
                    ? "bg-[#eee4da] text-[#776e65]"
                    : value < 64
                      ? "bg-[#f2b179] text-white"
                      : "bg-[#ed8f62] text-white"
              }`}
            >
              {value || 0}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (id === "flappy") {
    return (
      <div className="relative h-full overflow-hidden rounded-[1.45rem] bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.22),transparent_28%),linear-gradient(180deg,#4cc9ff,#67d8ff_44%,#18324f_45%,#11203a)]">
        <div className="absolute left-0 right-0 top-2 flex items-center justify-between px-3 text-[9px] font-mono uppercase tracking-[0.24em] text-white/75">
          <span>Best 34</span>
          <span>Tap To Fly</span>
        </div>
        <div className="absolute inset-y-2 left-[18%] w-7 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500 shadow-[0_0_14px_rgba(45,212,191,0.45)]" />
        <div className="absolute bottom-2 left-[18%] h-[43%] w-7 rounded-full bg-gradient-to-t from-emerald-400 to-teal-500 shadow-[0_0_14px_rgba(45,212,191,0.45)]" />
        <div className="absolute inset-y-4 left-[68%] w-7 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500 shadow-[0_0_14px_rgba(45,212,191,0.45)]" />
        <div className="absolute bottom-2 left-[68%] h-[32%] w-7 rounded-full bg-gradient-to-t from-emerald-400 to-teal-500 shadow-[0_0_14px_rgba(45,212,191,0.45)]" />
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-[linear-gradient(180deg,rgba(55,130,58,0.2),rgba(63,138,67,0.88))]" />
        <div className="absolute left-[44%] top-[44%] flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-200 via-amber-300 to-orange-400 text-[18px] shadow-[0_0_24px_rgba(251,191,36,0.5)]">
          ?
        </div>
      </div>
    );
  }

  if (id === "pacman") {
    return (
      <div className="relative h-full overflow-hidden rounded-[1.45rem] bg-[linear-gradient(180deg,#040814,#070d1d)] p-3">
        <div className="mb-2 flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.28em] text-cyan-100/70">
          <span>1UP 08420</span>
          <span>Level 3</span>
        </div>
        <div className="grid h-[calc(100%-2rem)] w-full grid-cols-8 gap-1 rounded-[1.2rem] border border-blue-300/20 bg-[#030814] p-2">
          {Array.from({ length: 48 }, (_, index) => {
            const walls = [0, 1, 2, 5, 6, 7, 8, 15, 16, 18, 21, 23, 24, 31, 32, 34, 37, 39, 40, 47];
            if (walls.includes(index)) {
              return <div key={index} className="rounded-md border border-cyan-300/15 bg-blue-500/70 shadow-[0_0_10px_rgba(59,130,246,0.35)]" />;
            }
            if (index === 26) {
              return <div key={index} className="rounded-full bg-yellow-300 shadow-[0_0_12px_rgba(253,224,71,0.5)]" />;
            }
            if (index === 29 || index === 30) {
              return <div key={index} className={`rounded-full ${index === 29 ? "bg-pink-400" : "bg-cyan-300"} shadow-[0_0_12px_rgba(244,114,182,0.45)]`} />;
            }
            return <div key={index} className="flex items-center justify-center text-[10px] text-white/50">?</div>;
          })}
        </div>
      </div>
    );
  }

  if (id === "dino") {
    return (
      <div className="relative h-full overflow-hidden rounded-[1.45rem] bg-[linear-gradient(180deg,#dce7f0,#eff4f8_58%,#d7dfe8_58%,#cfd8e2)]">
        <div className="absolute left-0 right-0 top-2 flex items-center justify-between px-3 text-[9px] font-mono uppercase tracking-[0.22em] text-slate-500">
          <span>Hi 00843</span>
          <span>Run 00214</span>
        </div>
        <div className="absolute bottom-4 left-0 right-0 h-px bg-slate-400/45" />
        <div className="absolute bottom-5 left-6 text-3xl text-slate-700">?</div>
        <div className="absolute bottom-5 left-[58%] h-10 w-3 rounded-sm bg-slate-600" />
        <div className="absolute bottom-5 left-[63%] h-7 w-3 rounded-sm bg-slate-600" />
        <div className="absolute bottom-5 left-[76%] h-5 w-10 rounded-sm border-2 border-slate-500" />
      </div>
    );
  }

  if (id === "typing") {
    return (
      <div className="flex h-full flex-col justify-between rounded-[1.45rem] bg-[linear-gradient(180deg,rgba(7,24,34,0.96),rgba(5,18,29,0.94))] p-3">
        <div className="flex items-center justify-between">
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-[10px] font-mono uppercase tracking-[0.22em] text-emerald-200">
            72 WPM
          </div>
          <div className="rounded-xl border border-cyan-400/25 bg-cyan-400/10 px-3 py-2 text-[10px] font-mono uppercase tracking-[0.22em] text-cyan-100">
            98% ACC
          </div>
        </div>
        <div className="rounded-[1.1rem] border border-white/8 bg-white/[0.035] px-3 py-2 text-[10px] leading-5 text-white/58">
          build smooth digital experiences with focused speed and precision
        </div>
        <div className="space-y-2.5">
          <div className="h-2 rounded-full bg-white/10">
            <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500" />
          </div>
          <div className="grid grid-cols-6 gap-1">
            {Array.from({ length: 24 }, (_, index) => (
              <div
                key={index}
                className={`h-3 rounded-sm ${
                  index % 7 === 0
                    ? "bg-emerald-400/75"
                    : index % 5 === 0
                      ? "bg-pink-400/70"
                      : index % 3 === 0
                        ? "bg-cyan-400/70"
                        : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden rounded-[1.45rem] bg-[linear-gradient(180deg,#08101e,#0b1324)] p-3">
      <div className="mb-2 flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.22em] text-slate-300/70">
        <span>White to move</span>
        <span>12:34</span>
      </div>
      <div className="grid h-[calc(100%-2rem)] w-full grid-cols-4 gap-1.5 rounded-[1.2rem] bg-[#11192b] p-2">
        {Array.from({ length: 16 }, (_, index) => {
          const isDark = (Math.floor(index / 4) + index) % 2 === 0;
          const piece = index === 1 ? "?" : index === 5 ? "?" : index === 10 ? "?" : index === 12 ? "?" : "";
          return (
            <div
              key={index}
              className={`flex items-center justify-center rounded-md text-sm ${
                isDark ? "bg-slate-800/95 text-cyan-100" : "bg-slate-100/90 text-slate-900"
              }`}
            >
              {piece}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2.5">
      <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-white/45">{label}</p>
      <p className="mt-1.5 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function GameMetric({
  label,
  value,
  accent = "from-cyan-400/18 to-violet-500/14",
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className={`rounded-[1.3rem] border border-white/10 bg-gradient-to-br ${accent} px-4 py-3 backdrop-blur-sm`}>
      <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-white/44">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function GameSection({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="games-neon-panel rounded-[1.8rem] p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.26em] text-white/42">Arcade Module</p>
          <h4 className="mt-2 text-lg font-semibold text-white">{title}</h4>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function TicTacToeGame({
  onWin,
  onLoss,
  onDraw,
}: {
  onWin: () => void;
  onLoss: () => void;
  onDraw: () => void;
}) {
  const [board, setBoard] = useState<TicCell[]>(Array(9).fill(null));
  const [status, setStatus] = useState("Your turn. You are X.");
  const [ended, setEnded] = useState<"win" | "loss" | "draw" | null>(null);
  const [thinking, setThinking] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const restart = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    setBoard(Array(9).fill(null));
    setStatus("Your turn. You are X.");
    setEnded(null);
    setThinking(false);
  };

  const handleMove = (index: number) => {
    if (board[index] || ended || thinking) return;

    const playerBoard = [...board];
    playerBoard[index] = "X";
    setBoard(playerBoard);

    const playerWinner = checkTicWinner(playerBoard);
    if (playerWinner === "X") {
      setStatus("You won the board.");
      setEnded("win");
      onWin();
      return;
    }

    if (playerBoard.every(Boolean)) {
      setStatus("It ended in a draw.");
      setEnded("draw");
      onDraw();
      return;
    }

    setThinking(true);
    setStatus("CPU is thinking...");
    timeoutRef.current = window.setTimeout(() => {
      const bestMove = getBestTicMove(playerBoard);
      const cpuBoard = [...playerBoard];
      cpuBoard[bestMove] = "O";
      setBoard(cpuBoard);
      setThinking(false);

      const cpuWinner = checkTicWinner(cpuBoard);
      if (cpuWinner === "O") {
        setStatus("CPU took the round.");
        setEnded("loss");
        onLoss();
        return;
      }

      if (cpuBoard.every(Boolean)) {
        setStatus("Dead even. Draw.");
        setEnded("draw");
        onDraw();
        return;
      }

      setStatus("Your move.");
    }, 420);
  };

  return (
    <div className="grid h-full gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <GameSection
        title="Neon Grid"
        action={
          <button
            type="button"
            onClick={restart}
            className="games-action-button rounded-full px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] text-white/80"
          >
            Reset
          </button>
        }
      >
        <div className="grid grid-cols-3 gap-3">
          {board.map((cell, index) => (
            <motion.button
              key={index}
              type="button"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMove(index)}
              className="aspect-square rounded-[1.3rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,26,44,0.98),rgba(16,20,34,0.96))] text-[2rem] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_16px_34px_rgba(2,6,23,0.22)] transition-colors hover:bg-[#181e31] md:text-[2.4rem]"
            >
              <span className={cell === "X" ? "text-cyan-300 drop-shadow-[0_0_14px_rgba(103,232,249,0.3)]" : "text-fuchsia-300 drop-shadow-[0_0_14px_rgba(244,114,182,0.25)]"}>
                {cell}
              </span>
            </motion.button>
          ))}
        </div>
      </GameSection>

      <div className="space-y-3">
        <GameMetric label="Player" value="X" />
        <GameMetric label="CPU" value="O" accent="from-fuchsia-500/18 to-pink-500/14" />
        <GameMetric label="Status" value={thinking ? "Thinking" : ended ? ended.toUpperCase() : "Live"} accent="from-amber-400/16 to-orange-500/14" />
        <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-7 text-white/72">
          {status}
        </div>
      </div>
    </div>
  );
}

function RockPaperScissorsGame({
  onWin,
  onLoss,
  onDraw,
}: {
  onWin: () => void;
  onLoss: () => void;
  onDraw: () => void;
}) {
  const [player, setPlayer] = useState<RpsChoice | null>(null);
  const [cpu, setCpu] = useState<RpsChoice | null>(null);
  const [status, setStatus] = useState("Choose a move to start the round.");
  const [pulse, setPulse] = useState(false);

  const play = (choice: RpsChoice) => {
    const cpuChoice = rpsChoices[Math.floor(Math.random() * rpsChoices.length)];
    const result = getRpsResult(choice, cpuChoice);

    setPlayer(choice);
    setCpu(cpuChoice);
    setPulse(true);
    window.setTimeout(() => setPulse(false), 320);

    if (result === "win") {
      setStatus("You won the round.");
      onWin();
    } else if (result === "loss") {
      setStatus("CPU won the round.");
      onLoss();
    } else {
      setStatus("Draw round.");
      onDraw();
    }
  };

  return (
    <div className="grid h-full gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
      <div className="space-y-4">
        <GameSection title="Face Off">
          <div className="grid gap-4 md:grid-cols-2">
            <div className={`rounded-[1.5rem] border border-cyan-400/12 bg-gradient-to-br from-cyan-500/10 to-blue-500/8 p-5 text-center transition-transform duration-300 ${pulse ? "scale-[1.01]" : ""}`}>
              <p className="text-xs font-mono uppercase tracking-[0.24em] text-white/45">You</p>
              <div className="mt-4 text-6xl">{player ? { Rock: "✊", Paper: "✋", Scissors: "✌️" }[player] : "?"}</div>
              <p className="mt-3 text-lg font-semibold text-white">{player ?? "Waiting"}</p>
            </div>
            <div className={`rounded-[1.5rem] border border-fuchsia-400/12 bg-gradient-to-br from-fuchsia-500/10 to-pink-500/8 p-5 text-center transition-transform duration-300 ${pulse ? "scale-[1.01]" : ""}`}>
              <p className="text-xs font-mono uppercase tracking-[0.24em] text-white/45">CPU</p>
              <div className="mt-4 text-6xl">{cpu ? { Rock: "✊", Paper: "✋", Scissors: "✌️" }[cpu] : "?"}</div>
              <p className="mt-3 text-lg font-semibold text-white">{cpu ?? "Waiting"}</p>
            </div>
          </div>
        </GameSection>

        <div className="grid grid-cols-3 gap-3">
          {rpsChoices.map((choice) => (
            <motion.button
              key={choice}
              type="button"
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => play(choice)}
              className="games-action-button rounded-[1.45rem] px-4 py-4 text-center"
            >
              <div className="text-4xl">{choice === "Rock" ? "✊" : choice === "Paper" ? "✋" : "✌️"}</div>
              <p className="mt-3 text-xs font-mono uppercase tracking-[0.2em] text-white/78">{choice}</p>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <GameMetric label="Round State" value={status.includes("won") ? "Resolved" : status.includes("Draw") ? "Draw" : "Ready"} />
        <GameMetric label="Your Pick" value={player ?? "—"} accent="from-cyan-400/18 to-blue-500/14" />
        <GameMetric label="CPU Pick" value={cpu ?? "—"} accent="from-fuchsia-400/18 to-rose-500/14" />
        <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-7 text-white/72">
          {status}
        </div>
      </div>
    </div>
  );
}

function SnakeGame({
  stats,
  onWin,
  onLoss,
  onBestScore,
}: {
  stats: GameStats;
  onWin: () => void;
  onLoss: () => void;
  onBestScore: (score: number) => void;
}) {
  const gridSize = 12;
  const winLength = 16;
  const [snake, setSnake] = useState<Array<{ x: number; y: number }>>([
    { x: 5, y: 6 },
    { x: 4, y: 6 },
    { x: 3, y: 6 },
  ]);
  const [food, setFood] = useState({ x: 8, y: 4 });
  const [direction, setDirection] = useState<Direction>("right");
  const [queuedDirection, setQueuedDirection] = useState<Direction>("right");
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("Press start and use arrow keys.");
  const [finished, setFinished] = useState<"win" | "loss" | null>(null);
  const recordedRef = useRef(false);

  const randomFood = useCallback(
    (currentSnake: Array<{ x: number; y: number }>) => {
      const freeCells: Array<{ x: number; y: number }> = [];
      for (let y = 0; y < gridSize; y += 1) {
        for (let x = 0; x < gridSize; x += 1) {
          if (!currentSnake.some((segment) => segment.x === x && segment.y === y)) {
            freeCells.push({ x, y });
          }
        }
      }
      return freeCells[Math.floor(Math.random() * freeCells.length)] ?? { x: 0, y: 0 };
    },
    [],
  );

  const reset = useCallback(() => {
    recordedRef.current = false;
    setSnake([
      { x: 5, y: 6 },
      { x: 4, y: 6 },
      { x: 3, y: 6 },
    ]);
    setFood({ x: 8, y: 4 });
    setDirection("right");
    setQueuedDirection("right");
    setRunning(false);
    setFinished(null);
    setStatus("Press start and use arrow keys.");
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const map: Partial<Record<string, Direction>> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };
      const next = map[event.key];
      if (!next) return;

      setQueuedDirection((current) => {
        const invalid =
          (current === "up" && next === "down") ||
          (current === "down" && next === "up") ||
          (current === "left" && next === "right") ||
          (current === "right" && next === "left");
        return invalid ? current : next;
      });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!running || finished) return;

    const intervalId = window.setInterval(() => {
      setSnake((currentSnake) => {
        const activeDirection = queuedDirection;
        setDirection(activeDirection);
        const head = currentSnake[0];
        const nextHead =
          activeDirection === "up"
            ? { x: head.x, y: head.y - 1 }
            : activeDirection === "down"
              ? { x: head.x, y: head.y + 1 }
              : activeDirection === "left"
                ? { x: head.x - 1, y: head.y }
                : { x: head.x + 1, y: head.y };

        const hitWall =
          nextHead.x < 0 || nextHead.x >= gridSize || nextHead.y < 0 || nextHead.y >= gridSize;
        const hitBody = currentSnake.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y);

        if (hitWall || hitBody) {
          setRunning(false);
          setFinished("loss");
          setStatus("Snake crashed. Reset and try again.");
          if (!recordedRef.current) {
            recordedRef.current = true;
            onLoss();
          }
          return currentSnake;
        }

        const nextSnake = [nextHead, ...currentSnake];
        const ateFood = nextHead.x === food.x && nextHead.y === food.y;

        if (!ateFood) {
          nextSnake.pop();
        } else {
          setFood(randomFood(nextSnake));
          const newScore = nextSnake.length - 3;
          onBestScore(newScore);
          if (nextSnake.length >= winLength) {
            setRunning(false);
            setFinished("win");
            setStatus("You cleared the snake run.");
            if (!recordedRef.current) {
              recordedRef.current = true;
              onWin();
            }
          } else {
            setStatus("Food collected. Keep moving.");
          }
        }

        return nextSnake;
      });
    }, 150);

    return () => window.clearInterval(intervalId);
  }, [finished, food.x, food.y, onBestScore, onLoss, onWin, queuedDirection, randomFood, running]);

  return (
    <div className="grid h-full gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm text-white/72">{status}</p>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] text-white/76 transition-colors hover:bg-white/[0.08]"
          >
            Reset
          </button>
        </div>
        <div className="mx-auto grid aspect-square w-full max-w-[500px] grid-cols-12 gap-1 rounded-[1.6rem] bg-[#0d1222] p-3">
          {Array.from({ length: gridSize * gridSize }, (_, index) => {
            const x = index % gridSize;
            const y = Math.floor(index / gridSize);
            const isHead = snake[0]?.x === x && snake[0]?.y === y;
            const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <motion.div
                key={index}
                layout
                className={`aspect-square rounded-[0.45rem] ${
                  isHead
                    ? "bg-gradient-to-br from-cyan-300 to-blue-500 shadow-[0_0_14px_rgba(59,130,246,0.45)]"
                    : isSnake
                      ? "bg-gradient-to-br from-emerald-400 to-cyan-400"
                      : isFood
                        ? "bg-gradient-to-br from-pink-400 to-fuchsia-500 shadow-[0_0_14px_rgba(236,72,153,0.45)]"
                        : "bg-white/[0.04]"
                }`}
              />
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <StatPill label="Score" value={snake.length - 3} />
          <StatPill label="Best" value={stats.bestScore} />
          <StatPill label="Target" value={winLength - 3} />
          <StatPill label="State" value={finished ? finished.toUpperCase() : running ? "LIVE" : "READY"} />
        </div>
        <motion.button
          type="button"
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            recordedRef.current = false;
            setRunning(true);
            setFinished(null);
            setStatus("Snake is moving.");
          }}
          className="w-full rounded-[1.6rem] bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 px-5 py-3.5 font-semibold text-slate-950 shadow-[0_0_22px_rgba(45,212,191,0.3)]"
        >
          Start Snake
        </motion.button>
      </div>
    </div>
  );
}

function MemoryMatchGame({
  stats,
  onWin,
  onBestMoves,
}: {
  stats: GameStats;
  onWin: () => void;
  onBestMoves: (moves: number) => void;
}) {
  const [deck, setDeck] = useState<MemoryCard[]>(() => createShuffledMemoryDeck());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [status, setStatus] = useState("Match every pair.");
  const [seconds, setSeconds] = useState(0);
  const winRecordedRef = useRef(false);
  const reset = () => {
    setDeck(createShuffledMemoryDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setLocked(false);
    setStatus("Match every pair.");
    setSeconds(0);
    winRecordedRef.current = false;
  };
  useEffect(() => {
    if (matched.length === deck.length) return;
    const intervalId = window.setInterval(() => setSeconds((current) => current + 1), 1000);
    return () => window.clearInterval(intervalId);
  }, [deck.length, matched.length]);
  const handleFlip = (id: number) => {
    if (locked || flipped.includes(id) || matched.includes(id)) return;
    const nextFlipped = [...flipped, id];
    setFlipped(nextFlipped);
    if (nextFlipped.length !== 2) return;
    setLocked(true);
    setMoves((current) => current + 1);
    const [first, second] = nextFlipped.map((value) => deck.find((card) => card.id === value)!);
    if (first.symbol === second.symbol) {
      window.setTimeout(() => {
        setMatched((current) => {
          const nextMatched = [...current, first.id, second.id];
          if (nextMatched.length === deck.length && !winRecordedRef.current) {
            winRecordedRef.current = true;
            setStatus("Perfect clear.");
            onWin();
            onBestMoves(moves + 1);
          } else {
            setStatus("Pair locked in.");
          }
          return nextMatched;
        });
        setFlipped([]);
        setLocked(false);
      }, 360);
      return;
    }
    window.setTimeout(() => {
      setFlipped([]);
      setLocked(false);
      setStatus("Not a match. Try again.");
    }, 600);
  };
  return (
    <div className="grid h-full gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <GameSection
        title="Pattern Vault"
        action={
          <button type="button" onClick={reset} className="games-action-button rounded-full px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] text-white/80">
            Shuffle
          </button>
        }
      >
        <div className="grid grid-cols-4 gap-3">
          {deck.map((card) => {
            const isOpen = flipped.includes(card.id) || matched.includes(card.id);
            const isMatched = matched.includes(card.id);
            return (
              <motion.button
                key={card.id}
                type="button"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleFlip(card.id)}
                className="aspect-square rounded-[1.3rem] [transform-style:preserve-3d] transition-transform duration-500"
              >
                <motion.div
                  animate={{ rotateY: isOpen ? 180 : 0, scale: isMatched ? 0.96 : 1 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-full w-full [transform-style:preserve-3d]"
                >
                  <div className="absolute inset-0 rounded-[1.3rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,26,44,0.98),rgba(16,20,34,0.96))] [backface-visibility:hidden]" />
                  <div className="absolute inset-0 flex items-center justify-center rounded-[1.3rem] text-sm text-white/18 [backface-visibility:hidden]">*</div>
                  <div
                    className={`absolute inset-0 flex items-center justify-center rounded-[1.3rem] bg-gradient-to-br ${card.hue} text-3xl text-white [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-[0_0_20px_rgba(99,102,241,0.25)]`}
                  >
                    {card.symbol}
                  </div>
                </motion.div>
              </motion.button>
            );
          })}
        </div>
      </GameSection>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <GameMetric label="Moves" value={moves} />
          <GameMetric label="Best" value={stats.bestMoves ?? "-"} accent="from-emerald-400/18 to-cyan-400/14" />
          <GameMetric label="Matched" value={`${matched.length / 2}/${deck.length / 2}`} accent="from-fuchsia-400/18 to-violet-500/14" />
          <GameMetric label="Timer" value={`${seconds}s`} accent="from-amber-400/18 to-orange-500/14" />
        </div>
        <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-7 text-white/72">
          {status}
        </div>
      </div>
    </div>
  );
}
function Game2048({
  stats,
  onWin,
  onLoss,
  onBestScore,
}: {
  stats: GameStats;
  onWin: () => void;
  onLoss: () => void;
  onBestScore: (score: number) => void;
}) {
  const [board, setBoard] = useState<number[][]>(() => create2048Board());
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("Use arrow keys or on-screen controls.");
  const [won, setWon] = useState(false);
  const [ended, setEnded] = useState(false);
  const resultRecordedRef = useRef(false);
  const reset = () => {
    setBoard(create2048Board());
    setScore(0);
    setStatus("Use arrow keys or on-screen controls.");
    setWon(false);
    setEnded(false);
    resultRecordedRef.current = false;
  };
  const applyMove = useCallback(
    (direction: Direction) => {
      if (ended) return;
      const moved = move2048(board, direction);
      if (!moved.moved) return;
      addRandomTile(moved.board);
      setBoard(moved.board);
      setScore((current) => {
        const nextScore = current + moved.score;
        onBestScore(nextScore);
        return nextScore;
      });
      const has2048Tile = moved.board.some((row) => row.some((cell) => cell >= 2048));
      if (has2048Tile && !won) {
        setWon(true);
        setStatus("2048 reached. Keep pushing or reset.");
        if (!resultRecordedRef.current) {
          resultRecordedRef.current = true;
          onWin();
        }
        return;
      }
      if (!has2048Moves(moved.board)) {
        setEnded(true);
        setStatus("No more moves.");
        if (!resultRecordedRef.current) {
          resultRecordedRef.current = true;
          onLoss();
        }
      }
    },
    [board, ended, onBestScore, onLoss, onWin, won],
  );
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const map: Partial<Record<string, Direction>> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };
      const direction = map[event.key];
      if (!direction) return;
      event.preventDefault();
      applyMove(direction);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [applyMove]);
  return (
    <div className="grid h-full gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <GameSection
        title="Merge Matrix"
        action={
          <button type="button" onClick={reset} className="games-action-button rounded-full px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] text-white/80">
            New Board
          </button>
        }
      >
        <div className="mx-auto grid aspect-square w-full max-w-[460px] grid-cols-4 gap-3 rounded-[1.7rem] bg-[#1a1630]/86 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          {board.flat().map((value, index) => (
            <motion.div
              key={`${index}-${value}`}
              layout
              className={`flex aspect-square items-center justify-center rounded-[1.2rem] text-lg font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ${
                value === 0
                  ? "bg-white/[0.05] text-transparent"
                  : value < 8
                    ? "bg-gradient-to-br from-blue-200 to-cyan-200 text-slate-950"
                    : value < 32
                      ? "bg-gradient-to-br from-violet-400 to-fuchsia-500 text-white"
                      : value < 128
                        ? "bg-gradient-to-br from-amber-300 to-orange-400 text-slate-950"
                        : value < 512
                          ? "bg-gradient-to-br from-pink-400 to-rose-500 text-white"
                          : "bg-gradient-to-br from-cyan-300 via-violet-400 to-fuchsia-500 text-white"
              }`}
            >
              {value || 0}
            </motion.div>
          ))}
        </div>
      </GameSection>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <GameMetric label="Score" value={score} />
          <GameMetric label="Best" value={stats.bestScore} accent="from-emerald-400/18 to-cyan-400/14" />
          <GameMetric label="Mode" value={won ? "Win" : ended ? "Over" : "Live"} accent="from-fuchsia-400/18 to-violet-500/14" />
          <GameMetric label="Goal" value="2048" accent="from-amber-400/18 to-orange-500/14" />
        </div>
        <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-7 text-white/72">
          {status}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button type="button" onClick={() => applyMove("left")} className="games-action-button rounded-[1.3rem] px-4 py-3 text-white">Left</button>
          <button type="button" onClick={() => applyMove("up")} className="games-action-button rounded-[1.3rem] px-4 py-3 text-white">Up</button>
          <button type="button" onClick={() => applyMove("right")} className="games-action-button rounded-[1.3rem] px-4 py-3 text-white">Right</button>
          <div />
          <button type="button" onClick={() => applyMove("down")} className="games-action-button rounded-[1.3rem] px-4 py-3 text-white">Down</button>
          <div />
        </div>
      </div>
    </div>
  );
}
function ChessGame({
  onWin,
  onLoss,
}: {
  onWin: () => void;
  onLoss: () => void;
}) {
  const [board, setBoard] = useState<ChessPiece[][]>(() => createInitialChessBoard());
  const [selected, setSelected] = useState<ChessSelection | null>(null);
  const [legalMoves, setLegalMoves] = useState<ChessMove[]>([]);
  const [status, setStatus] = useState("Your turn. You play white.");
  const [result, setResult] = useState<"win" | "loss" | null>(null);
  const cpuTimerRef = useRef<number | null>(null);
  const resultRecordedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (cpuTimerRef.current) {
        window.clearTimeout(cpuTimerRef.current);
      }
    };
  }, []);

  const reset = () => {
    if (cpuTimerRef.current) {
      window.clearTimeout(cpuTimerRef.current);
    }
    setBoard(createInitialChessBoard());
    setSelected(null);
    setLegalMoves([]);
    setStatus("Your turn. You play white.");
    setResult(null);
    resultRecordedRef.current = false;
  };

  const finish = (outcome: "win" | "loss", message: string) => {
    setStatus(message);
    setResult(outcome);
    if (resultRecordedRef.current) return;
    resultRecordedRef.current = true;
    if (outcome === "win") onWin();
    else onLoss();
  };

  const handleCellClick = (row: number, col: number) => {
    if (result) return;
    const piece = board[row][col];
    const pieceColor = getPieceColor(piece);

    if (selected) {
      const chosenMove = legalMoves.find((move) => move.row === row && move.col === col);
      if (chosenMove) {
        const moved = moveChessPiece(board, selected, chosenMove);
        setBoard(moved.board);
        setSelected(null);
        setLegalMoves([]);

        if (moved.captured === "black-king") {
          finish("win", "You captured the king.");
          return;
        }

        const blackMoves = getAllMovesForColor(moved.board, "black");
        if (blackMoves.length === 0) {
          finish("win", "CPU has no legal moves.");
          return;
        }

        setStatus("CPU is moving...");
        cpuTimerRef.current = window.setTimeout(() => {
          const randomMove = blackMoves[Math.floor(Math.random() * blackMoves.length)];
          const cpuMoved = moveChessPiece(moved.board, randomMove.from, randomMove.to);
          setBoard(cpuMoved.board);

          if (cpuMoved.captured === "white-king") {
            finish("loss", "CPU captured your king.");
            return;
          }

          const playerMoves = getAllMovesForColor(cpuMoved.board, "white");
          if (playerMoves.length === 0) {
            finish("loss", "No legal moves left.");
            return;
          }

          setStatus("Your turn. White to move.");
        }, 520);
        return;
      }
    }

    if (pieceColor !== "white") {
      setSelected(null);
      setLegalMoves([]);
      return;
    }

    setSelected({ row, col });
    setLegalMoves(getChessMoves(board, row, col));
  };

  return (
    <div className="grid h-full gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
      <div className="rounded-[1.8rem] border border-white/10 bg-[#0e1323]/92 p-4">
        <div className="mx-auto grid aspect-square w-full max-w-[520px] grid-cols-8 gap-1.5">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const highlighted = legalMoves.some((move) => move.row === rowIndex && move.col === colIndex);
              const isSelected = selected?.row === rowIndex && selected?.col === colIndex;
              const dark = (rowIndex + colIndex) % 2 === 1;

              return (
                <motion.button
                  key={`${rowIndex}-${colIndex}`}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={`aspect-square rounded-[0.8rem] text-lg transition-colors md:text-xl ${
                    isSelected
                      ? "bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950"
                      : highlighted
                        ? "bg-gradient-to-br from-fuchsia-500/70 to-violet-500/70 text-white"
                        : dark
                          ? "bg-slate-800/95 text-cyan-50"
                          : "bg-slate-100/95 text-slate-950"
                  }`}
                >
                  {renderChessPiece(piece)}
                </motion.button>
              );
            }),
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <StatPill label="Side" value="White" />
          <StatPill label="CPU" value="Black" />
          <StatPill label="State" value={result ? result.toUpperCase() : "LIVE"} />
          <StatPill label="Mode" value="CPU Duel" />
        </div>

        <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white/72">
          {status}
        </div>

        <button
          type="button"
          onClick={reset}
          className="w-full rounded-[1.6rem] border border-white/10 bg-white/[0.05] px-5 py-3.5 font-semibold text-white transition-colors hover:bg-white/[0.08]"
        >
          New Match
        </button>
      </div>
    </div>
  );
}

function FlappyGame({
  stats,
  onWin,
  onLoss,
  onBestScore,
}: {
  stats: GameStats;
  onWin: () => void;
  onLoss: () => void;
  onBestScore: (score: number) => void;
}) {
  const [birdY, setBirdY] = useState(50);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState([
    { id: 1, x: 76, gapY: 38, passed: false },
    { id: 2, x: 116, gapY: 58, passed: false },
  ]);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("Tap flap or press space.");
  const [finished, setFinished] = useState<"win" | "loss" | null>(null);
  const resultRecordedRef = useRef(false);

  const reset = useCallback(() => {
    setBirdY(50);
    setVelocity(0);
    setPipes([
      { id: 1, x: 76, gapY: 38, passed: false },
      { id: 2, x: 116, gapY: 58, passed: false },
    ]);
    setRunning(false);
    setScore(0);
    setStatus("Tap flap or press space.");
    setFinished(null);
    resultRecordedRef.current = false;
  }, []);

  const flap = useCallback(() => {
    if (finished) return;
    setRunning(true);
    setVelocity(-4.4);
    setStatus("Flying...");
  }, [finished]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      event.preventDefault();
      flap();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [flap]);

  useEffect(() => {
    if (!running || finished) return;

    const intervalId = window.setInterval(() => {
      setVelocity((current) => current + 0.34);
      setBirdY((current) => {
        const next = current + velocity;
        if (next < 0 || next > 92) {
          setRunning(false);
          setFinished("loss");
          setStatus("The bird dropped.");
          if (!resultRecordedRef.current) {
            resultRecordedRef.current = true;
            onLoss();
          }
          return Math.max(0, Math.min(92, next));
        }
        return next;
      });

      setPipes((current) => {
        let next = current
          .map((pipe) => ({ ...pipe, x: pipe.x - 2.1 }))
          .filter((pipe) => pipe.x > -12);

        const lastX = next[next.length - 1]?.x ?? 74;
        if (lastX < 68) {
          next = [
            ...next,
            {
              id: Date.now() + Math.random(),
              x: 112,
              gapY: 26 + Math.random() * 42,
              passed: false,
            },
          ];
        }

        next.forEach((pipe) => {
          const touchingPipe = pipe.x < 31 && pipe.x > 13;
          const outsideGap = birdY < pipe.gapY - 13 || birdY > pipe.gapY + 13;
          if (touchingPipe && outsideGap && !finished) {
            setRunning(false);
            setFinished("loss");
            setStatus("Hit the pipe.");
            if (!resultRecordedRef.current) {
              resultRecordedRef.current = true;
              onLoss();
            }
          }

          if (!pipe.passed && pipe.x < 18) {
            pipe.passed = true;
            setScore((currentScore) => {
              const nextScore = currentScore + 1;
              onBestScore(nextScore);
              if (nextScore >= 12 && !resultRecordedRef.current) {
                resultRecordedRef.current = true;
                setRunning(false);
                setFinished("win");
                setStatus("Sky clear.");
                onWin();
              }
              return nextScore;
            });
          }
        });

        return next;
      });
    }, 60);

    return () => window.clearInterval(intervalId);
  }, [birdY, finished, onBestScore, onLoss, onWin, running, velocity]);

  return (
    <div className="grid h-full gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="games-neon-panel relative overflow-hidden rounded-[1.8rem] p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.18),transparent_34%),linear-gradient(180deg,rgba(7,18,42,0.92),rgba(12,10,28,0.96))]" />
        <div className="absolute inset-x-0 bottom-6 h-px bg-white/12" />
        {pipes.map((pipe) => (
          <Fragment key={pipe.id}>
            <motion.div
              className="absolute w-10 rounded-full bg-gradient-to-b from-emerald-400 to-cyan-500 shadow-[0_0_24px_rgba(45,212,191,0.34)]"
              style={{ left: `${pipe.x}%`, top: 0, height: `${Math.max(8, pipe.gapY - 14)}%` }}
            />
            <motion.div
              className="absolute w-10 rounded-full bg-gradient-to-t from-emerald-400 to-cyan-500 shadow-[0_0_24px_rgba(45,212,191,0.34)]"
              style={{ left: `${pipe.x}%`, bottom: 0, height: `${Math.max(8, 100 - (pipe.gapY + 14))}%` }}
            />
          </Fragment>
        ))}
        <motion.button
          type="button"
          onClick={flap}
          whileTap={{ scale: 0.95 }}
          className="absolute left-[22%] z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-orange-400 to-pink-500 text-xl text-slate-950 shadow-[0_0_28px_rgba(251,191,36,0.4)]"
          style={{ top: `${birdY}%` }}
        >
          ●
        </motion.button>
        <div className="relative flex h-full items-end justify-between">
          <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-white/70">
            {status}
          </div>
          <button type="button" onClick={reset} className="games-action-button rounded-full px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] text-white/80">
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <StatPill label="Score" value={score} />
          <StatPill label="Best" value={stats.bestScore} />
          <StatPill label="Target" value="12" />
          <StatPill label="State" value={finished ? finished.toUpperCase() : running ? "LIVE" : "READY"} />
        </div>
        <motion.button
          type="button"
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={flap}
          className="games-action-button w-full rounded-[1.5rem] px-5 py-3.5 font-semibold text-white"
        >
          Flap
        </motion.button>
      </div>
    </div>
  );
}

function PacmanGame({
  stats,
  onWin,
  onLoss,
  onBestScore,
}: {
  stats: GameStats;
  onWin: () => void;
  onLoss: () => void;
  onBestScore: (score: number) => void;
}) {
  const createMaze = useCallback(
    () => [
      ["W", "W", "W", "W", "W", "W", "W", "W"],
      ["W", ".", ".", ".", ".", ".", ".", "W"],
      ["W", ".", "W", ".", "W", ".", ".", "W"],
      ["W", ".", ".", ".", ".", ".", ".", "W"],
      ["W", ".", "W", ".", "W", ".", ".", "W"],
      ["W", ".", ".", ".", ".", ".", ".", "W"],
      ["W", ".", ".", "W", ".", "W", ".", "W"],
      ["W", "W", "W", "W", "W", "W", "W", "W"],
    ],
    [],
  );

  const [maze, setMaze] = useState<string[][]>(() => createMaze());
  const [player, setPlayer] = useState({ row: 1, col: 1 });
  const [ghost, setGhost] = useState({ row: 6, col: 6 });
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("Collect every pellet.");
  const [finished, setFinished] = useState<"win" | "loss" | null>(null);
  const recordedRef = useRef(false);

  const reset = useCallback(() => {
    setMaze(createMaze());
    setPlayer({ row: 1, col: 1 });
    setGhost({ row: 6, col: 6 });
    setScore(0);
    setStatus("Collect every pellet.");
    setFinished(null);
    recordedRef.current = false;
  }, [createMaze]);

  const move = useCallback((dir: Direction) => {
    if (finished) return;

    const delta =
      dir === "up"
        ? { row: -1, col: 0 }
        : dir === "down"
          ? { row: 1, col: 0 }
          : dir === "left"
            ? { row: 0, col: -1 }
            : { row: 0, col: 1 };

    const nextPlayer = { row: player.row + delta.row, col: player.col + delta.col };
    if (maze[nextPlayer.row]?.[nextPlayer.col] === "W") return;

    let nextMaze = maze.map((row) => [...row]);
    if (nextMaze[nextPlayer.row][nextPlayer.col] === ".") {
      nextMaze[nextPlayer.row][nextPlayer.col] = " ";
      setScore((current) => {
        const next = current + 1;
        onBestScore(next);
        return next;
      });
    }
    setPlayer(nextPlayer);

    const ghostOptions = [
      { row: ghost.row - 1, col: ghost.col },
      { row: ghost.row + 1, col: ghost.col },
      { row: ghost.row, col: ghost.col - 1 },
      { row: ghost.row, col: ghost.col + 1 },
    ].filter((cell) => nextMaze[cell.row]?.[cell.col] !== "W");
    const nextGhost = ghostOptions[Math.floor(Math.random() * ghostOptions.length)] ?? ghost;
    setGhost(nextGhost);

    if (
      nextGhost.row === nextPlayer.row &&
      nextGhost.col === nextPlayer.col
    ) {
      setFinished("loss");
      setStatus("Ghost caught you.");
      if (!recordedRef.current) {
        recordedRef.current = true;
        onLoss();
      }
      return;
    }

    const pelletsLeft = nextMaze.flat().filter((cell) => cell === ".").length;
    setMaze(nextMaze);
    if (pelletsLeft === 0) {
      setFinished("win");
      setStatus("Maze cleared.");
      if (!recordedRef.current) {
        recordedRef.current = true;
        onWin();
      }
    }
  }, [finished, ghost, maze, onBestScore, onLoss, onWin, player]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const map: Partial<Record<string, Direction>> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };
      const next = map[event.key];
      if (!next) return;
      event.preventDefault();
      move(next);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [move]);

  return (
    <div className="grid h-full gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="games-neon-panel rounded-[1.8rem] p-4">
        <div className="grid aspect-square max-w-[520px] grid-cols-8 gap-2">
          {maze.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isPlayer = player.row === rowIndex && player.col === colIndex;
              const isGhost = ghost.row === rowIndex && ghost.col === colIndex;
              return (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  layout
                  className={`relative flex aspect-square items-center justify-center rounded-[0.9rem] ${
                    cell === "W" ? "bg-blue-500/70 shadow-[0_0_14px_rgba(59,130,246,0.32)]" : "bg-white/[0.04]"
                  }`}
                >
                  {cell === "." ? <span className="text-[10px] text-yellow-200">•</span> : null}
                  {isPlayer ? <span className="absolute text-lg text-yellow-300">◉</span> : null}
                  {isGhost ? <span className="absolute text-lg text-pink-400">◆</span> : null}
                </motion.div>
              );
            }),
          )}
        </div>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <StatPill label="Score" value={score} />
          <StatPill label="Best" value={stats.bestScore} />
          <StatPill label="Pellets" value={maze.flat().filter((cell) => cell === ".").length} />
          <StatPill label="State" value={finished ? finished.toUpperCase() : "LIVE"} />
        </div>
        <div className="rounded-[1.3rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/72">{status}</div>
        <div className="grid grid-cols-3 gap-3">
          <div />
          <button type="button" onClick={() => move("up")} className="games-action-button rounded-[1.2rem] px-4 py-3 text-white">↑</button>
          <div />
          <button type="button" onClick={() => move("left")} className="games-action-button rounded-[1.2rem] px-4 py-3 text-white">←</button>
          <button type="button" onClick={reset} className="games-action-button rounded-[1.2rem] px-4 py-3 text-white">Reset</button>
          <button type="button" onClick={() => move("right")} className="games-action-button rounded-[1.2rem] px-4 py-3 text-white">→</button>
          <div />
          <button type="button" onClick={() => move("down")} className="games-action-button rounded-[1.2rem] px-4 py-3 text-white">↓</button>
          <div />
        </div>
      </div>
    </div>
  );
}

function DinoRunnerGame({
  stats,
  onWin,
  onLoss,
  onBestScore,
}: {
  stats: GameStats;
  onWin: () => void;
  onLoss: () => void;
  onBestScore: (score: number) => void;
}) {
  const [running, setRunning] = useState(false);
  const [dinoY, setDinoY] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [obstacles, setObstacles] = useState([{ id: 1, x: 100, h: 16 }]);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("Jump over obstacles.");
  const [finished, setFinished] = useState<"win" | "loss" | null>(null);
  const recordedRef = useRef(false);

  const jump = useCallback(() => {
    if (finished) return;
    setRunning(true);
    if (dinoY <= 0.5) {
      setVelocity(5.8);
      setStatus("Sprint live.");
    }
  }, [dinoY, finished]);

  const reset = useCallback(() => {
    setRunning(false);
    setDinoY(0);
    setVelocity(0);
    setObstacles([{ id: 1, x: 100, h: 16 }]);
    setScore(0);
    setStatus("Jump over obstacles.");
    setFinished(null);
    recordedRef.current = false;
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" || event.key === "ArrowUp") {
        event.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [jump]);

  useEffect(() => {
    if (!running || finished) return;
    const intervalId = window.setInterval(() => {
      setVelocity((current) => current - 0.42);
      setDinoY((current) => Math.max(0, current + velocity));
      setObstacles((current) => {
        const next = current
          .map((item) => ({ ...item, x: item.x - 3.2 }))
          .filter((item) => item.x > -12);
        const last = next[next.length - 1]?.x ?? 70;
        if (last < 64) {
          next.push({ id: Date.now(), x: 108, h: 12 + Math.random() * 18 });
        }
        next.forEach((item) => {
          if (item.x < 20 && item.x > 10 && dinoY < item.h / 1.7) {
            setRunning(false);
            setFinished("loss");
            setStatus("Obstacle hit.");
            if (!recordedRef.current) {
              recordedRef.current = true;
              onLoss();
            }
          }
          if (item.x < 12 && item.x > 8) {
            setScore((currentScore) => {
              const nextScore = currentScore + 1;
              onBestScore(nextScore);
              if (nextScore >= 20 && !recordedRef.current) {
                recordedRef.current = true;
                setRunning(false);
                setFinished("win");
                setStatus("Run cleared.");
                onWin();
              }
              return nextScore;
            });
          }
        });
        return next;
      });
    }, 60);

    return () => window.clearInterval(intervalId);
  }, [dinoY, finished, onBestScore, onLoss, onWin, running, velocity]);

  return (
    <div className="grid h-full gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="games-neon-panel relative overflow-hidden rounded-[1.8rem] p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(196,181,253,0.18),transparent_34%),linear-gradient(180deg,rgba(9,14,32,0.92),rgba(12,10,28,0.96))]" />
        <div className="absolute inset-x-0 bottom-8 h-px bg-white/15" />
        <motion.div
          className="absolute left-[12%] z-10 flex h-12 w-12 items-end justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-violet-500 text-slate-950 shadow-[0_0_24px_rgba(96,165,250,0.35)]"
          style={{ bottom: `${10 + dinoY}%` }}
        >
          <span className="pb-1 text-xs font-black">D</span>
        </motion.div>
        {obstacles.map((item) => (
          <div
            key={item.id}
            className="absolute bottom-8 w-5 rounded-t-xl bg-gradient-to-t from-pink-500 to-violet-500 shadow-[0_0_18px_rgba(217,70,239,0.35)]"
            style={{ left: `${item.x}%`, height: `${item.h}%` }}
          />
        ))}
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <StatPill label="Score" value={score} />
          <StatPill label="Best" value={stats.bestScore} />
          <StatPill label="Target" value="20" />
          <StatPill label="State" value={finished ? finished.toUpperCase() : running ? "LIVE" : "READY"} />
        </div>
        <div className="rounded-[1.3rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/72">{status}</div>
        <motion.button
          type="button"
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={jump}
          className="games-action-button w-full rounded-[1.5rem] px-5 py-3.5 font-semibold text-white"
        >
          Jump
        </motion.button>
        <button type="button" onClick={reset} className="games-action-button w-full rounded-[1.5rem] px-5 py-3 text-white">
          Reset Run
        </button>
      </div>
    </div>
  );
}

function TypingSpeedGame({
  stats,
  onWin,
  onLoss,
  onBestScore,
}: {
  stats: GameStats;
  onWin: () => void;
  onLoss: () => void;
  onBestScore: (score: number) => void;
}) {
  const prompts = [
    "Design motion with intention and keep every interaction feeling alive.",
    "Creative interfaces shine when animation supports focus instead of stealing it.",
    "A smooth portfolio should feel playful, sharp, and confidently interactive.",
  ];
  const [prompt, setPrompt] = useState(prompts[0]);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const recordedRef = useRef(false);

  const accuracy = input.length === 0
    ? 100
    : Math.round(
        (prompt
          .slice(0, input.length)
          .split("")
          .filter((char, index) => char === input[index]).length /
          input.length) *
          100,
      );
  const wordsTyped = input.trim().length === 0 ? 0 : input.trim().split(/\s+/).length;
  const wpm = Math.max(0, Math.round(wordsTyped * 2));

  const reset = useCallback(() => {
    const nextPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setPrompt(nextPrompt);
    setInput("");
    setTimeLeft(30);
    setRunning(false);
    setFinished(false);
    recordedRef.current = false;
  }, []);

  useEffect(() => {
    if (!running || finished) return;
    const intervalId = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(intervalId);
          setRunning(false);
          setFinished(true);
          onBestScore(wpm);
          if (!recordedRef.current) {
            recordedRef.current = true;
            if (wpm >= 18 && accuracy >= 85) onWin();
            else onLoss();
          }
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [accuracy, finished, onBestScore, onLoss, onWin, running, wpm]);

  return (
    <div className="grid h-full gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="games-neon-panel space-y-4 rounded-[1.8rem] p-4">
        <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-7 text-white/78">
          {prompt.split("").map((char, index) => {
            const typed = input[index];
            const state = typed == null ? "text-white/42" : typed === char ? "text-emerald-300" : "text-pink-300";
            return (
              <span key={`${char}-${index}`} className={state}>
                {char}
              </span>
            );
          })}
        </div>
        <textarea
          value={input}
          onChange={(event) => {
            if (!running) setRunning(true);
            if (finished) return;
            setInput(event.target.value);
          }}
          placeholder="Start typing here..."
          className="h-40 w-full resize-none rounded-[1.4rem] border border-white/10 bg-[#101526]/92 px-4 py-4 text-white outline-none transition-colors focus:border-cyan-400/40"
        />
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <StatPill label="WPM" value={wpm} />
          <StatPill label="Best" value={stats.bestScore} />
          <StatPill label="Accuracy" value={`${accuracy}%`} />
          <StatPill label="Timer" value={`${timeLeft}s`} />
        </div>
        <div className="rounded-[1.3rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/72">
          {finished ? (wpm >= 18 && accuracy >= 85 ? "Strong run locked in." : "Reset and push your score higher.") : "Hit 18+ WPM with solid accuracy."}
        </div>
        <button type="button" onClick={reset} className="games-action-button w-full rounded-[1.5rem] px-5 py-3.5 font-semibold text-white">
          New Test
        </button>
      </div>
    </div>
  );
}

export function GamesHubButton() {
  const [open, setOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [stats, setStats] = useState<ArcadeStats>(initialStats);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("games-open", open);

    if (typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setStats(clampStats(JSON.parse(stored)));
        }
      } catch {}
    }

    if (!open) {
      setActiveGame(null);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.classList.remove("games-open");
    };
  }, [open]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const patchStats = useCallback((game: GameId, updater: (current: GameStats) => GameStats) => {
    setStats((current) => ({
      ...current,
      [game]: updater(current[game]),
    }));
  }, []);

  const recordWin = useCallback(
    (game: GameId) => {
      patchStats(game, (current) => ({
        ...current,
        wins: current.wins + 1,
        streak: current.streak + 1,
        bestStreak: Math.max(current.bestStreak, current.streak + 1),
      }));
    },
    [patchStats],
  );

  const recordLoss = useCallback(
    (game: GameId) => {
      patchStats(game, (current) => ({
        ...current,
        losses: current.losses + 1,
        streak: 0,
      }));
    },
    [patchStats],
  );

  const recordDraw = useCallback(
    (game: GameId) => {
      patchStats(game, (current) => ({
        ...current,
        draws: current.draws + 1,
        streak: 0,
      }));
    },
    [patchStats],
  );

  const updateBestScore = useCallback(
    (game: GameId, score: number) => {
      patchStats(game, (current) => ({
        ...current,
        bestScore: Math.max(current.bestScore, score),
      }));
    },
    [patchStats],
  );

  const updateBestMoves = useCallback(
    (game: GameId, moves: number) => {
      patchStats(game, (current) => ({
        ...current,
        wins: current.wins + 1,
        streak: current.streak + 1,
        bestStreak: Math.max(current.bestStreak, current.streak + 1),
        bestMoves: current.bestMoves === null ? moves : Math.min(current.bestMoves, moves),
      }));
    },
    [patchStats],
  );

  const activeMeta = useMemo(
    () => gameMeta.find((game) => game.id === activeGame) ?? null,
    [activeGame],
  );

  const renderActiveGame = () => {
    if (!activeGame) return null;

    if (activeGame === "tictactoe") {
      return <TicTacToeGame onWin={() => recordWin("tictactoe")} onLoss={() => recordLoss("tictactoe")} onDraw={() => recordDraw("tictactoe")} />;
    }
    if (activeGame === "rps") {
      return <RockPaperScissorsGame onWin={() => recordWin("rps")} onLoss={() => recordLoss("rps")} onDraw={() => recordDraw("rps")} />;
    }
    if (activeGame === "snake") {
      return <SnakeGame stats={stats.snake} onWin={() => recordWin("snake")} onLoss={() => recordLoss("snake")} onBestScore={(score) => updateBestScore("snake", score)} />;
    }
    if (activeGame === "memory") {
      return <MemoryMatchGame stats={stats.memory} onWin={() => {}} onBestMoves={(moves) => updateBestMoves("memory", moves)} />;
    }
    if (activeGame === "game2048") {
      return <Game2048 stats={stats.game2048} onWin={() => recordWin("game2048")} onLoss={() => recordLoss("game2048")} onBestScore={(score) => updateBestScore("game2048", score)} />;
    }
    if (activeGame === "chess") {
      return <ChessGame onWin={() => recordWin("chess")} onLoss={() => recordLoss("chess")} />;
    }
    if (activeGame === "flappy") {
      return <FlappyGame stats={stats.flappy} onWin={() => recordWin("flappy")} onLoss={() => recordLoss("flappy")} onBestScore={(score) => updateBestScore("flappy", score)} />;
    }
    if (activeGame === "pacman") {
      return <PacmanGame stats={stats.pacman} onWin={() => recordWin("pacman")} onLoss={() => recordLoss("pacman")} onBestScore={(score) => updateBestScore("pacman", score)} />;
    }
    if (activeGame === "dino") {
      return <DinoRunnerGame stats={stats.dino} onWin={() => recordWin("dino")} onLoss={() => recordLoss("dino")} onBestScore={(score) => updateBestScore("dino", score)} />;
    }
    return <TypingSpeedGame stats={stats.typing} onWin={() => recordWin("typing")} onLoss={() => recordLoss("typing")} onBestScore={(score) => updateBestScore("typing", score)} />;
  };

  return (
    <>
      <motion.button
        type="button"
        data-cursor-ignore="true"
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        className="games-top-button relative flex h-[42px] items-center gap-2 overflow-hidden rounded-full px-4 text-white"
        aria-label="Open games hub"
      >
        <span className="games-top-button-icon flex h-7 w-7 items-center justify-center rounded-full">
          <Gamepad2 className="h-3.5 w-3.5" />
        </span>
        <span className="text-[11px] font-mono uppercase tracking-[0.28em]">Games</span>
        <Sparkles className="h-3.5 w-3.5 text-cyan-200/90" />
      </motion.button>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {open && (
                <>
            <motion.button
              type="button"
              data-cursor-ignore="true"
              aria-label="Close games popup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[110] bg-[#02030d]/72 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, x: "-50%", y: "calc(-50% + 18px)" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.97, x: "-50%", y: "calc(-50% + 12px)" }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              data-cursor-ignore="true"
              className="games-popup fixed left-1/2 top-1/2 z-[111] flex h-[88vh] w-[90vw] max-h-[88vh] max-w-[90vw] min-w-0 flex-col overflow-hidden rounded-[2rem]"
              role="dialog"
              aria-modal="true"
              aria-labelledby="games-popup-title"
            >
              <div className="games-popup-grid pointer-events-none absolute inset-0 opacity-60" />

              <div className={`relative flex items-start justify-between gap-4 border-b border-white/10 ${activeGame ? "px-5 py-3" : "px-7 py-6"}`}>
                <div className="min-w-0">
                  <div className={`inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 ${activeGame ? "mb-1.5" : "mb-3"}`}>
                    <span className="games-popup-badge flex h-9 w-9 items-center justify-center rounded-2xl">
                      <Gamepad2 className="h-4 w-4 text-white" />
                    </span>
                    <span className="games-popup-kicker text-[11px] font-mono uppercase tracking-[0.3em] text-white/88">
                      {activeMeta ? activeMeta.subtitle : "Games"}
                    </span>
                  </div>
                  <div className={`min-w-0 ${activeGame ? "flex items-end gap-4" : ""}`}>
                    <h2 id="games-popup-title" className={`games-popup-title font-display font-bold text-white ${activeGame ? "text-[1.9rem] leading-none md:text-[2.15rem]" : "text-3xl md:text-4xl"}`}>
                      {activeMeta ? activeMeta.title : "Game Room"}
                    </h2>
                    <p className={`games-popup-description max-w-2xl leading-relaxed text-white/60 ${activeGame ? "hidden truncate pb-0.5 text-xs md:block" : "mt-3 text-sm md:text-base"}`}>
                      {activeMeta
                        ? activeMeta.description
                        : "Choose a game card below. Records, streaks, and best scores stay saved on this device even after refresh."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  data-cursor-ignore="true"
                  onClick={() => setOpen(false)}
                  className="games-popup-close flex h-11 w-11 items-center justify-center rounded-full"
                  aria-label="Close games popup"
                >
                  <X className="h-4.5 w-4.5 text-white/88" />
                </button>
              </div>

              <div className={`relative flex min-h-0 flex-1 overflow-hidden ${activeGame ? "px-6 py-5" : "px-7 py-8"}`}>
                {!activeGame ? (
                  <div className="flex h-full w-full flex-col gap-6 overflow-hidden">
                    <div className="flex min-h-0 flex-1 snap-y snap-mandatory flex-col gap-6 overflow-y-auto pr-2 pb-4">
                      {gameMeta.map((game, index) => {
                        const Icon = game.icon;
                        const gameStats = stats[game.id];

                        return (
                          <motion.button
                            key={game.id}
                            type="button"
                            data-cursor-ignore="true"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.42, delay: index * 0.04 }}
                            whileHover={{ y: -4, scale: 1.006 }}
                            whileTap={{ scale: 0.985 }}
                            onClick={() => setActiveGame(game.id)}
                            className="games-arcade-card group relative grid min-h-[300px] snap-start overflow-hidden rounded-[1.95rem] border border-white/10 bg-white/[0.045] text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl lg:min-h-[320px] xl:grid-cols-[minmax(430px,0.92fr)_minmax(0,1.08fr)]"
                          >
                            <div className={`relative h-64 bg-gradient-to-br ${game.accent} p-5 sm:h-72 xl:h-full xl:min-h-[320px]`}>
                              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.14),transparent_24%)] opacity-80" />
                              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm">
                                <Icon className="h-3.5 w-3.5" />
                                {game.subtitle}
                              </div>
                              <div className="h-[188px] overflow-hidden rounded-[1.6rem] border border-white/15 bg-[#090d1d]/55 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm sm:h-[210px] xl:h-[220px]">
                                <SelectionPreview id={game.id} />
                              </div>
                            </div>

                            <div className="flex flex-col justify-between gap-6 p-6 md:p-7 xl:p-8">
                              <div className="space-y-5">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="max-w-2xl">
                                    <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-cyan-200/72">
                                      Interactive Arcade Entry
                                    </p>
                                    <h3 className="mt-3 font-display text-[2rem] font-bold leading-tight text-white md:text-[2.2rem]">
                                      {game.title}
                                    </h3>
                                    <p className="mt-3 max-w-2xl text-sm leading-7 text-white/66 md:text-[15px]">
                                      {game.description} Enter the scene to play a fully interactive version inside the popup, with saved local stats, animated UI, and a more immersive arcade presentation.
                                    </p>
                                  </div>
                                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition-transform duration-300 group-hover:scale-110">
                                    <Icon className="h-5 w-5 text-cyan-200" />
                                  </div>
                                </div>

                                <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] px-4 py-4">
                                  <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-white/42">Experience</p>
                                  <p className="mt-2 text-sm leading-7 text-white/68">
                                    {game.subtitle} with animated visuals, responsive controls, and locally saved performance records.
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                                <div className="grid grid-cols-3 gap-2 xl:min-w-[320px]">
                                  <StatPill label="Wins" value={gameStats.wins} />
                                  <StatPill label="Streak" value={gameStats.streak} />
                                  <StatPill label="Best" value={gameStats.bestStreak} />
                                </div>

                                <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5 text-[10px] font-mono uppercase tracking-[0.24em] text-white/72 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-cyan-200 xl:self-auto">
                                  Open Full Game
                                  <Sparkles className="h-3.5 w-3.5" />
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full w-full flex-col gap-3 overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.45rem] border border-white/10 bg-white/[0.04] px-3 py-2.5">
                      <div className="flex flex-wrap gap-2.5">
                        <StatPill label="Wins" value={stats[activeGame].wins} />
                        <StatPill label="Losses" value={stats[activeGame].losses} />
                        <StatPill label="Streak" value={stats[activeGame].streak} />
                        <StatPill label="Best Streak" value={stats[activeGame].bestStreak} />
                        {stats[activeGame].bestScore > 0 ? <StatPill label="Best Score" value={stats[activeGame].bestScore} /> : null}
                        {stats[activeGame].bestMoves !== null ? <StatPill label="Best Moves" value={stats[activeGame].bestMoves ?? "—"} /> : null}
                      </div>

                      <button
                        type="button"
                        data-cursor-ignore="true"
                        onClick={() => setActiveGame(null)}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-2 text-[11px] font-mono uppercase tracking-[0.2em] text-white/78 transition-colors hover:bg-white/[0.08]"
                      >
                        <MoveLeft className="h-3.5 w-3.5" />
                        Close Game
                      </button>
                    </div>

                    <div className="games-popup-inner min-h-0 flex-1 overflow-hidden rounded-[1.7rem] border border-white/10 px-4 py-4">
                      {renderActiveGame()}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
                </>
              )}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}

