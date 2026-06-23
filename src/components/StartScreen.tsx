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
        "rounded-2xl border font-bold transition-all focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring",
        compact ? "min-h-11 px-3 py-2 text-sm" : "px-4 py-2 text-sm",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-slate-200 bg-white text-slate-700 hover:border-primary/50 hover:bg-slate-50"
      )}
    >
      {children}
    </button>
  );
}

function FlowCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <article className="soft-panel rounded-[1.75rem] p-5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">{number}</div>
      <h3 className="text-lg font-black tracking-[-0.03em]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </article>
  );
}

function PlayChoiceCard({ title, description, bestFor, action, href, onClick }: { title: string; description: string; bestFor: string; action: string; href?: string; onClick?: () => void }) {
  const inner = (
    <Card className="mode-intent-card h-full rounded-[1.75rem] transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="flex h-full flex-col gap-4 p-5 sm:p-6">
        <div>
          <h3 className="text-2xl font-black tracking-[-0.04em]">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <div className="mt-auto rounded-2xl bg-secondary p-3 text-sm">
          <span className="font-bold text-slate-950">Best for: </span>
          <span className="text-muted-foreground">{bestFor}</span>
        </div>
        <span className="inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-4 text-sm font-black text-primary-foreground">{action}</span>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href} className="block h-full rounded-[1.75rem] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ring">{inner}</Link>;
  }

  return <button type="button" onClick={onClick} className="block h-full w-full rounded-[1.75rem] text-left focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ring">{inner}</button>;
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
  const easyDifficulty = DIFFICULTIES.find((item) => item.id === "easy") ?? normalDifficulty;

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
      difficulty: easyDifficulty.id,
      boardSize: easyDifficulty.boardSize,
      totalRounds: 3,
      flashDurationMs: easyDifficulty.flashDurationMs,
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

  function openSameDeviceSetup() {
    onModeChange("multiplayer");
    updatePlayerCount(Math.max(2, playerNames.length));
    setSettingsOpen(true);
  }

  if (settingsOpen) {
    return (
      <section className="min-h-full overflow-y-auto px-3 py-4 sm:px-6 sm:py-8">
        <div className="design-shell grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
          <Card className="glass-panel overflow-hidden rounded-[2rem]">
            <CardHeader className="border-b p-6 sm:p-8">
              <Badge variant="secondary" className="mb-4 w-fit rounded-full px-3 py-1">Game setup</Badge>
              <CardTitle className="hero-title text-4xl sm:text-6xl">Tune the run before you start.</CardTitle>
              <CardDescription className="hero-copy mt-4 text-base">
                Keep it simple for a first round, or adjust players, board difficulty, rounds, and penalty timing.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 p-6 sm:p-8">
              <Button className="h-14 rounded-2xl text-base font-black" onClick={handleGentleStart}>Start guided 3-round game</Button>
              <Button variant="outline" className="h-14 rounded-2xl text-base font-bold" onClick={() => setSettingsOpen(false)}>Back to home</Button>
            </CardContent>
          </Card>

          <Card className="glass-panel overflow-hidden rounded-[2rem]">
            <CardHeader className="border-b p-6 sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Badge variant="outline" className="mb-2 w-fit rounded-full">Advanced</Badge>
                  <CardTitle className="text-2xl font-black tracking-[-0.04em]">Custom game options</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSettingsOpen(false)}>Close</Button>
              </div>
            </CardHeader>

            <CardContent className="grid gap-4 p-6 sm:p-8">
              <div className="grid gap-2 rounded-[1.5rem] border bg-white/70 p-4">
                <Label>Local mode</Label>
                <div className="grid grid-cols-2 gap-2">
                  <ChoicePill compact active={mode === "single"} onClick={() => onModeChange("single")}>Solo</ChoicePill>
                  <ChoicePill compact active={mode === "multiplayer"} onClick={() => onModeChange("multiplayer")}>Same device</ChoicePill>
                </div>
              </div>

              <div className="grid gap-2 rounded-[1.5rem] border bg-white/70 p-4">
                <Label>Difficulty</Label>
                <div className="grid grid-cols-3 gap-2">
                  {DIFFICULTIES.map((item) => (
                    <ChoicePill key={item.id} compact active={difficulty === item.id} onClick={() => onDifficultyChange(item.id)}>{item.label}</ChoicePill>
                  ))}
                </div>
              </div>

              <div className="grid gap-2 rounded-[1.5rem] border bg-white/70 p-4">
                <Label>Players</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((count) => (
                    <ChoicePill key={count} compact active={(mode === "single" ? 1 : playerNames.length) === count} onClick={() => { onModeChange(count === 1 ? "single" : "multiplayer"); updatePlayerCount(count); }}>{count}</ChoicePill>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2 rounded-[1.5rem] border bg-white/70 p-4">
                  <Label htmlFor="rounds">Rounds</Label>
                  <Input id="rounds" className="h-12 rounded-2xl text-center text-base" min={1} max={20} type="number" value={totalRounds} onChange={(event) => onTotalRoundsChange(Number(event.target.value))} />
                </div>
                <div className="grid gap-2 rounded-[1.5rem] border bg-white/70 p-4">
                  <Label htmlFor="penalty">Penalty</Label>
                  <Input id="penalty" className="h-12 rounded-2xl text-center text-base" min={0} max={10} type="number" value={penaltySeconds} onChange={(event) => onPenaltySecondsChange(Number(event.target.value))} />
                </div>
              </div>

              {mode === "multiplayer" && (
                <div className="grid gap-2 rounded-[1.5rem] border bg-white/70 p-4">
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

            <CardFooter className="border-t p-6 sm:p-8">
              <Button className="h-14 w-full rounded-2xl text-base font-black" onClick={handleCustomStart}>Start custom game</Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-full overflow-y-auto px-3 py-4 sm:px-6 sm:py-8">
      <div className="design-shell grid gap-7">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="glass-panel overflow-hidden rounded-[2.25rem]">
            <CardHeader className="relative overflow-hidden p-6 sm:p-10">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" aria-hidden="true" />
              <div className="relative max-w-3xl">
                <Badge variant="secondary" className="mb-5 w-fit rounded-full px-3 py-1">New concept game</Badge>
                <CardTitle className="hero-title text-5xl sm:text-7xl">Memorize the number. Find it faster.</CardTitle>
                <CardDescription className="hero-copy mt-5 max-w-2xl text-base sm:text-lg">
                  Blink & Find shows you a number, hides it, then challenges you to find the match on the board. Play solo, on one device, or online with someone far away.
                </CardDescription>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" className="h-14 rounded-2xl px-8 text-base font-black" onClick={handleQuickStart}>Play first round</Button>
                  <Button asChild size="lg" variant="outline" className="h-14 rounded-2xl px-8 text-base font-bold">
                    <Link href="/tutorial">Learn how it works</Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="glass-panel overflow-hidden rounded-[2.25rem]">
            <CardHeader className="p-6 sm:p-8">
              <Badge variant="outline" className="mb-4 w-fit rounded-full">For new players</Badge>
              <CardTitle className="text-3xl font-black tracking-[-0.045em]">Start simple, then compete.</CardTitle>
              <CardDescription className="hero-copy mt-3">Best first route for ages 10-60: try a small board, understand the loop, then invite others.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 p-6 pt-0 sm:p-8 sm:pt-0">
              <Button className="h-14 rounded-2xl text-base font-black" onClick={handleGentleStart}>Start guided game</Button>
              <Link href="/comfort" className="flow-pill rounded-[1.35rem] p-4 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ring">
                <span className="block text-sm font-black text-slate-950">Comfort mode</span>
                <span className="mt-1 block text-sm leading-5 text-muted-foreground">Bigger tiles, easier pace, lower pressure.</span>
              </Link>
              <Link href="/rules" className="flow-pill rounded-[1.35rem] p-4 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ring">
                <span className="block text-sm font-black text-slate-950">Rules in one minute</span>
                <span className="mt-1 block text-sm leading-5 text-muted-foreground">Quick explanation before you play.</span>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <FlowCard number="01" title="Watch" description="Remember the target number before it hides." />
          <FlowCard number="02" title="Find" description="Scan the board and tap the matching number." />
          <FlowCard number="03" title="Compare" description="Beat your time or challenge another player." />
        </div>

        <div className="grid gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-[-0.045em]">How do you want to play?</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Three clear choices first. All other modes come after.</p>
          </div>
          <div className="grid gap-3 lg:grid-cols-3">
            <PlayChoiceCard title="Play solo" description="Learn the game and beat your own best time." bestFor="first-time players and quick practice" action="Start solo" onClick={handleQuickStart} />
            <PlayChoiceCard title="Play together" description="Use one device with people sitting near you." bestFor="family, classroom, friends nearby" action="Set up players" onClick={openSameDeviceSetup} />
            <PlayChoiceCard title="Play online" description="Create a room and match with someone on another device." bestFor="friends away from you" action="Create room" href="/online" />
          </div>
        </div>

        <div className="grid gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-[-0.045em]">Explore modes</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Once the loop clicks, choose a mode by mood: learn, relax, race, or compete.</p>
            </div>
            <Button variant="outline" className="h-11 rounded-2xl font-bold" onClick={() => setSettingsOpen(true)}>Customize setup</Button>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <GameModeCard title="Practice" eyebrow="learn" description="Replay the core loop and build confidence before competing." href="/practice" actionLabel="Practice" tone="focus" />
            <GameModeCard title="Daily" eyebrow="habit" description="One shared board per day for a simple focus routine." href="/daily" actionLabel="Play daily" tone="calm" />
            <GameModeCard title="Time Attack" eyebrow="speed" description="A 60-second sprint for sharper recognition and faster scanning." href="/time-attack" actionLabel="Start sprint" tone="speed" />
            <GameModeCard title="Streak" eyebrow="precision" description="Keep a clean chain going. One wrong tap ends the run." href="/streak" actionLabel="Build streak" tone="progress" />
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <GameModeCard title="Challenge Link" eyebrow="share" description="Send a fixed board so friends can compare the same exact run." href="/challenge" actionLabel="Make link" tone="focus" />
            <GameModeCard title="Zen" eyebrow="relax" description="Practice without a timer when you want calm repetition." href="/zen" actionLabel="Play zen" tone="calm" />
            <GameModeCard title="Leaderboard" eyebrow="progress" description="Compare saved times after you finish a strong run." href="/leaderboard" actionLabel="View scores" tone="progress" />
            <GameModeCard title="Profile" eyebrow="identity" description="Set your display name before rooms, scores, and shared results." href="/profile" actionLabel="Edit profile" tone="social" />
          </div>
        </div>

        <Card className="soft-panel rounded-[1.75rem]">
          <CardFooter className="flex flex-col gap-3 p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>Clear first, fast second. The game should make sense before it gets competitive.</span>
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
