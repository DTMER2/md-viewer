"use client";

import { useMemo, useState } from "react";
import type { StudySection } from "@/components/study-schema";

type StudyPageProps = {
  title: string;
  sections: StudySection[];
  formatExample: string;
};

type Token = { type: "text"; value: string } | { type: "cloze"; value: string };
type StudyItemParts = { prompt: string; explanation: string | null };

function parseCloze(text: string): Token[] {
  return text
    .split(/(\{\{.*?\}\})/g)
    .filter(Boolean)
    .map((part) => {
      const match = part.match(/^\{\{(.*)\}\}$/);
      if (match) {
        return { type: "cloze" as const, value: match[1] };
      }

      return { type: "text" as const, value: part };
    });
}

function splitStudyItem(text: string): StudyItemParts {
  const marker = "\n解説:";
  const markerIndex = text.indexOf(marker);

  if (markerIndex === -1) {
    return { prompt: text, explanation: null };
  }

  return {
    prompt: text.slice(0, markerIndex),
    explanation: text.slice(markerIndex + 1),
  };
}

function unwrapCloze(text: string): string {
  return text.replace(/\{\{(.*?)\}\}/g, "$1");
}

export function StudyPage({ title, sections, formatExample }: StudyPageProps) {
  const allIds = useMemo(
    () =>
      sections.flatMap((section, sectionIndex) =>
        section.items.flatMap((item, itemIndex) =>
          parseCloze(splitStudyItem(item).prompt)
            .map((token, tokenIndex) =>
              token.type === "cloze"
                ? `${sectionIndex}-${itemIndex}-${tokenIndex}`
                : null,
            )
            .filter((value): value is string => value !== null),
        ),
      ),
    [sections],
  );
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const toggleReveal = (id: string) => {
    setRevealedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const revealAll = () => {
    setRevealedIds(new Set(allIds));
  };

  const hideAll = () => {
    setRevealedIds(new Set());
  };

  return (
    <main className="mx-auto flex min-h-screen flex-col justify-center gap-8 px-4 py-8 md:px-8 lg:flex-row lg:items-center">
      <section className="w-full rounded-[2rem] border border-stone-200/80 bg-white/90 p-6 shadow-card backdrop-blur md:p-8 lg:w-[min(64rem,62vw)]">
        <div className="mb-8 flex flex-col gap-4 border-b border-stone-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
              Study View
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              {title}
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={revealAll}
              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-amber-500 hover:text-amber-700"
            >
              すべて表示
            </button>
            <button
              type="button"
              onClick={hideAll}
              className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              すべて隠す
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {sections.map((section, sectionIndex) => (
            <section key={section.title} className="space-y-4">
              <div className="inline-flex rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold text-amber-800">
                {section.title}
              </div>
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => {
                  const { prompt, explanation } = splitStudyItem(item);
                  const tokens = parseCloze(prompt);
                  const itemClozeIds = tokens
                    .map((token, tokenIndex) =>
                      token.type === "cloze"
                        ? `${sectionIndex}-${itemIndex}-${tokenIndex}`
                        : null,
                    )
                    .filter((value): value is string => value !== null);
                  const shouldShowExplanation =
                    explanation !== null &&
                    (itemClozeIds.length === 0 ||
                      itemClozeIds.some((id) => revealedIds.has(id)));

                  return (
                    <article
                      key={`${section.title}-${itemIndex}`}
                      className="whitespace-pre-wrap rounded-3xl border border-stone-200 bg-stone-50 px-5 py-4 text-lg leading-10 text-stone-800"
                    >
                      {tokens.map((token, tokenIndex) => {
                        if (token.type === "text") {
                          return (
                            <span
                              key={`${sectionIndex}-${itemIndex}-${tokenIndex}`}
                            >
                              {token.value}
                            </span>
                          );
                        }

                        const id = `${sectionIndex}-${itemIndex}-${tokenIndex}`;
                        const isRevealed = revealedIds.has(id);
                        const buttonWidth = `calc(${Math.max(token.value.trim().length, 3)}em + 2rem)`;

                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => toggleReveal(id)}
                            className={[
                              "mx-2 inline-flex h-10 items-center justify-center rounded-2xl border px-3 py-0 align-middle text-center text-base font-semibold leading-none transition",
                              isRevealed
                                ? "border-amber-300 bg-amber-50 text-amber-900"
                                : "border-dashed border-stone-400 bg-stone-200 text-stone-700 hover:border-amber-500 hover:text-amber-700",
                            ].join(" ")}
                            aria-label={
                              isRevealed ? "解答を隠す" : "解答を表示する"
                            }
                            style={{ width: buttonWidth }}
                          >
                            {isRevealed ? token.value : "???"}
                          </button>
                        );
                      })}
                      {shouldShowExplanation ? (
                        <div className="mt-3 border-t border-stone-200 pt-3 text-base leading-8 text-stone-700">
                          {unwrapCloze(explanation)}
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
