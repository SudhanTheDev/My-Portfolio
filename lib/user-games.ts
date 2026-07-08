export type UserGame = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
};

export const userGames: UserGame[] = [
  {
    slug: "rock-paper-scissors",
    title: "Rock Paper Scissors",
    subtitle: "Quick duel",
    description: "Your own image-based version of the classic hand game.",
    href: "/user-games/rock-paper-scissors",
  },
  {
    slug: "tic-tac-toe",
    title: "Tic Tac Toe",
    subtitle: "Classic board",
    description: "Your playable three-by-three tic tac toe project.",
    href: "/user-games/tic-tac-toe",
  },
  {
    slug: "snake",
    title: "Snake",
    subtitle: "Neon arcade",
    description: "Your 3D neon snake game with canvas controls and score tracking.",
    href: "/user-games/snake",
  },
  {
    slug: "game-2048",
    title: "2048",
    subtitle: "Merge puzzle",
    description: "Your full 2048 build with the original tile merging gameplay.",
    href: "/user-games/game-2048",
  },
  {
    slug: "pacman",
    title: "Pac-Man",
    subtitle: "Maze run",
    description: "Your classic Pac-Man web project with sounds, ghosts, and collectibles.",
    href: "/user-games/pacman",
  },
  {
    slug: "dino-runner",
    title: "Dino Runner",
    subtitle: "Offline sprint",
    description: "Your browser-based T-Rex runner clone with jump controls and obstacles.",
    href: "/user-games/dino-runner",
  },
  {
    slug: "typing-speed",
    title: "Typing Speed Test",
    subtitle: "Accuracy challenge",
    description: "Your typing test app with timer, WPM, CPM, and error counting.",
    href: "/user-games/typing-speed",
  },
];

export const unavailableUserGames = [
  {
    title: "Flappy Bird",
    reason: "The folder is an Xcode iPhone project, not a web game build.",
  },
  {
    title: "Chess",
    reason: "The folder currently only contains a chess library package, not a playable web game.",
  },
];
