import { notFound } from "next/navigation";
import PresenterGame from "@/components/game/PresenterGame";
import { getModeByKey } from "@/lib/modeConfig";
import type { ModeKey } from "@/types/quiz";

export default async function PlayModePage({
  params,
}: {
  params: Promise<{ mode: string }>;
}) {
  const { mode } = await params;
  if (!getModeByKey(mode)) notFound();
  return <PresenterGame mode={mode as ModeKey} />;
}
