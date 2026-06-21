"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import GameModeCard from "@/components/GameModeCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DIFFICULTIES } from "@/lib/gameDefaults";
import { cn } from "@/lib/utils";
import type { Difficulty, GameConfig, GameMode } from "@/types/game";

interface StartScreenProps {
  mode: GameMode;
  playerNames: string[];
  totalRounds: number;
  difficulty: Difficulty;
  penaltySeconds: number;
  onModeChange: (mode: GameMode) => void;
  onPlayerNamesChange: (names: string[]) => void;
  onTotalRoundsChange: (rounds: number) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onPenaltySecondsChange: (seconds: number) => void;
  onStart: (config: GameConfig) => void;
}

function ChoicePill({ active, children, compact = false, onClick }: { active: boolean; children: ReactNode; compact?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border font-semibold transition-all focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring",
        compact ? "min-h-11 px-3 py-2 text-sm" : "px-4 py-2 text-sm",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-xs"
          : "border-border bg-white/65 text-foreground hover:border-primary/40 hover:bg-white"
      )}
    >
      {children}
    </button>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="rounded-3xl border bg-white/70 p-4 shadow-sm">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">{number}</div>
      <div className="font-black tracking-tight">{title}</div>
      <div className="mt-1 text-sm leading-6 text-muted-foreground">{description}</div>
    </div>
  );
}

export default function StartScreen({
  mode,
  playerNames,
  totalRounds,
  difficulty,
  penaltySeconds,
  onModeChange,
  onPlayerNamesChange,
  onTotalRoundsChange,
  onDifficultyChange,
  onPenaltySecondsChange,
  onStart,
}: StartScreenProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const selectedDifficulty = DIFFICULTIES.find((item) => item.id === difficulty) ?? DIFFICULTIES[1];
  const normalDifficulty = DIFFICULTIES.find((item) => item.id === "normal") ?? selectedDifficulty;

  function updatePlayerCount(count: number) {
    const nextNames = Array.from({ length: count }, (_, index) => playerNames[index] ?? `Player ${index + 1}`);
    onPlayerNamesChange(nextNames);
  }

  function updatePlayerName(index: number, name: string) {
    const nextNames = [...playerNames];
    nextNames[index] = name;
    onPlayerNamesChange(nextNames);
  }

  function handleQuickStart() {
    onStart({
      mode: "single",
      difficulty: "normal",
      boardSize: normalDifficulty.boardSize,
      totalRounds: 5,
      flashDurationMs: normalDifficulty.flashDurationMs,
      penaltySeconds: 3,
    });
  }

  function handleGentleStart() {
    onStart({
      mode: "single",
      difficulty: "easy",
      boardSize: DIFFICULTIES.find((item) => item.id === "easy")?.boardSize ?? 25,
      totalRounds: 3,
      flashDurationMs: DIFFICULTIES.find((item) => item.id === "easy")?.flashDurationMs ?? 3000,
      penaltySeconds: 1,
    });
  }

  function handleCustomStart() {
    onStart({
      mode,
      difficulty,
      boardSize: selectedDifficulty.boardSize,
      totalRounds,
      flashDurationMs: selectedDifficulty.flashDurationMs,
      penaltySeconds,
    });
  }

  if (settingsOpen) {
    return (
      <section className="min-h-full overflow-y-auto px-2 py-3 sm:px-4 sm:py-6">
        <div className="mx-auto grid w-full max-w-5xl gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="overflow-hidden border-white/70 bg-white/80 shadow-xl shadow-amber-950/5 backdrop-blur">
            <CardHeader className="border-b border-amber-100 p-5 sm:p-6">
              <Badge variant="secondary" className="mb-3 w-fit rounded-full">Customize</Badge>
              <CardTitle className="text-3xl font-black tracking-tight sm:text-5xl">Make your first round feel right.</CardTitle>
              <CardDescription className="mt-3 text-base leading-7">
                Keep it gentle, add friends on one device, or make the board harder. Defaults stay friendly because apparently starting with chaos is bad hospitality.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 p-5 sm:p-6">
              <Button className="h-13 rounded-full text-base" onClick={handleGentleStart}>Start gentle 3-round game</Button>
              <Button variant="outline" className="h-13 rounded-full text-base" onClick={() => setSettingsOpen(false)}>Back to welcome</Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-white/70 bg-white/85 shadow-xl shadow-amber-950/5 backdrop-blur">
            <CardHeader className="border-b border-amber-100 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Badge variant="secondary" className="mb-2 w-fit rounded-full">Game setup</Badge>
                  <CardTitle className="text-2xl font-black tracking-tight">Advanced options</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSettingsOpen(false)}>Close</Button>
              </div>
            </CardHeader>

            <CardContent className="grid gap-4 p-5 sm:p-6">
              <div className="grid gap-2 rounded-3xl border bg-background/60 p-4">
                <Label>Local mode</Label>
                <div className="grid grid-cols-2 gap-2">
                  <ChoicePill compact active={mode === "single"} onClick={() => onModeChange("single")}>Solo</ChoicePill>
                  <ChoicePill compact active={mode === "multiplayer"} onClick={() => onModeChange("multiplayer")}>Same Device</ChoicePill>
                </div>
              </div>

              <div className="grid gap-2 rounded-3xl border bg-background/60 p-4">
                <Label>Difficulty</Label>
                <div className="grid grid-cols-3 gap-2">
                  {DIFFICULTIES.map((item) => (
                    <ChoicePill key={item.id} compact active={difficulty === item.id} onClick={() => onDifficultyChange(item.id)}>{item.label}</ChoicePill>
                  ))}
                </div>
              </div>

              <div className="grid gap-2 rounded-3xl border bg-background/60 p-4">
                <Label>Players</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((count) => (
                    <ChoicePill key={count} compact active={(mode === "single" ? 1 : playerNames.length) === count} onClick={() => { onModeChange(count === 1 ? "single" : "multiplayer"); updatePlayerCount(count); }}>{count}</ChoicePill>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2 rounded-3xl border bg-background/60 p-4">
                  <Label htmlFor="rounds">Rounds</Label>
                  <Input id="rounds" className="h-12 rounded-2xl text-center text-base" min={1} max={20} type="number" value={totalRounds} onChange={(event) => onTotalRoundsChange(Number(event.target.value))} />
                </div>
                <div className="grid gap-2 rounded-3xl border bg-background/60 p-4">
                  <Label htmlFor="penalty">Wrong tap penalty</Label>
                  <Input id="penalty" className="h-12 rounded-2xl text-center text-base" min={0} max={10} type="number" value={penaltySeconds} onChange={(event) => onPenaltySecondsChange(Number(event.target.value))} />
                </div>
              </div>

              {mode === "multiplayer" && (
                <div className="grid gap-2 rounded-3xl border bg-background/60 p-4">
                  <div className="flex items-center justify-between">
                    <Label>Player names</Label>
                    <Badge variant="outline">{playerNames.length}</Badge>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {playerNames.map((name, index) => (
                      <Input key={index} className="h-12 rounded-2xl" value={name} aria-label={`Player ${index + 1} name`} onChange={(event) => updatePlayerName(index, event.target.value)} />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="border-t border-amber-100 p-5 sm:p-6">
              <Button className="h-13 w-full rounded-full text-base" onClick={handleCustomStart}>Start custom game</Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-full overflow-y-auto px-2 py-3 sm:px-4 sm:py-6">
      <div className="mx-auto grid w-full max-w-6xl gap-5">
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="overflow-hidden border-white/70 bg-white/85 shadow-xl shadow-amber-950/5 backdrop-blur">
            <CardHeader className="relative overflow-hidden p-5 sm:p-8">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-amber-200/60 blur-3xl" aria-hidden="true" />
              <div className="absolute -bottom-16 left-12 h-48 w-48 rounded-full bg-sky-200/60 blur-3xl" aria-hidden="true" />
              <div className="relative">
                <Badge variant="secondary" className="mb-4 w-fit rounded-full px-3 py-1">New concept game</Badge>
                <CardTitle className="max-w-3xl text-4xl font-black tracking-[-0.06em] text-balance sm:text-6xl">
                  A tiny focus game for fast eyes.
                </CardTitle>
                <CardDescription className="mt-4 max-w-2xl text-base leading-7 sm:text-lg">
                  Remember one number. Find it on the board. Beat your time. That is the whole loop, because even games deserve mercy.
                </CardDescription>
                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                  <Button size="lg" className="h-14 rounded-full px-8 text-base font-black" onClick={handleQuickStart}>Play now</Button>
                  <Button asChild size="lg" variant="outline" className="h-14 rounded-full px-8 text-base">
                    <Link href="/tutorial">Learn in 20 seconds</Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="overflow-hidden border-white/70 bg-white/80 shadow-xl shadow-amber-950/5 backdrop-blur">
            <CardHeader className="p-5 sm:p-6">
              <Badge variant="outline" className="mb-3 w-fit rounded-full">Start here</Badge>
              <CardTitle className="text-2xl font-black tracking-tight">New to Blink & Find?</CardTitle>
              <CardDescription className="mt-2 leading-7">Try the calm route first. It teaches the game without turning your thumbs into unpaid interns.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 p-5 pt-0 sm:p-6 sm:pt-0">
              <Button className="h-13 rounded-full" onClick={handleGentleStart}>Start gentle game</Button>
              <Button asChild variant="outline" className="h-13 rounded-full"><Link href="/comfort">Comfort mode</Link></Button>
              <Button asChild variant="ghost" className="h-13 rounded-full"><Link href="/zen">Zen practice</Link></Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <StepCard number="1" title="Remember" description="The game flashes one target number. Give it one calm second." />
          <StepCard number="2" title="Find" description="The target hides in a grid. Tap it as fast as your eyes allow." />
          <StepCard number="3" title="Improve" description="Replay, challenge friends, and slowly bully your old score." />
        </div>

        <div className="grid gap-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Choose your kind of play</h2>
              <p className="text-sm text-muted-foreground">Beginner-safe paths first, spicy modes after. Civilization survives another day.</p>
            </div>
            <Button variant="outline" className="rounded-full" onClick={() => setSettingsOpen(true)}>Customize first game</Button>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <GameModeCard title="Daily" eyebrow="habit" description="One shared board each day. Perfect for a quick focus ritual." href="/daily" actionLabel="Play daily" tone="warm" />
            <GameModeCard title="Practice" eyebrow="classic" description="Replay the core game and learn the number-hunting rhythm." href="/practice" actionLabel="Practice" tone="calm" />
            <GameModeCard title="Time Attack" eyebrow="speed" description="A 60-second sprint for players who enjoy pressure, somehow." href="/time-attack" actionLabel="Start sprint" tone="bright" />
            <GameModeCard title="Streak" eyebrow="precision" description="One wrong tap ends the run. Tiny stakes, huge betrayal." href="/streak" actionLabel="Build streak" tone="soft" />
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <GameModeCard title="Play with Friend" eyebrow="social" description="Create a room, share a code, and race or take turns online." href="/online" actionLabel="Create room" tone="calm" />
            <GameModeCard title="Challenge Link" eyebrow="share" description="Send the same board to someone and compare results fairly." href="/challenge" actionLabel="Make link" tone="warm" />
            <GameModeCard title="Leaderboard" eyebrow="progress" description="See fastest local and global scores after you save a result." href="/leaderboard" actionLabel="View scores" tone="bright" />
            <GameModeCard title="Profile" eyebrow="identity" description="Set your display name before sharing rooms and scores." href="/profile" actionLabel="Edit profile" tone="soft" />
          </div>
        </div>

        <Card className="border-white/70 bg-white/75 shadow-sm">
          <CardFooter className="flex flex-col gap-3 p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>Tip: slow eyes first, fast fingers second.</span>
            <div className="flex flex-wrap justify-center gap-1">
              <Button asChild variant="ghost" size="sm"><Link href="/modes">Modes</Link></Button>
              <Button asChild variant="ghost" size="sm"><Link href="/tips">Tips</Link></Button>
              <Button asChild variant="ghost" size="sm"><Link href="/faq">FAQ</Link></Button>
              <Button asChild variant="ghost" size="sm"><Link href="/stats">Stats</Link></Button>
              <Button asChild variant="ghost" size="sm"><Link href="/history">History</Link></Button>
              <Button asChild variant="ghost" size="sm"><Link href="/telemetry">QA</Link></Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
