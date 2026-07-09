/* Michael's Corner v2, the prompt library data.
   Source: planning/CONTENT-LIBRARY.md. Every prompt string is verbatim, the exact copy target.
   Consumed by build.mjs (generates library.html, packs/, prompts/, prompts-index.js).
   Keep the [bracket] fill slots and the honest-limit lines intact. They are the brand. */

export const UPDATED = "07/2026";

export const PACKS = [
  {
    id: "beginners",
    chip: "Beginners",
    name: "Best prompts for beginners",
    blurb: [
      "Start here. Simple prompts that work on your first day with ChatGPT or Claude.",
      "Copy one, fill in the brackets, paste it in, and see for yourself what these tools can do."
    ],
    updated: UPDATED,
    prompts: [
      {
        id: "sort-my-day",
        title: "Sort my day in five minutes",
        when: "Use this when your inbox and task list feel like one big pile and you do not know where to start.",
        prompt: `You are my calm, practical chief of staff. Your job is to turn a messy pile of tasks into a plan I can act on in the next hour.

Here is everything on my plate right now:
[paste your inbox subjects, messages, and to-do items here]

Do this:
1. Sort every item into three groups: Do today, Do this week, and Drop or delegate.
2. Put the Do today group in the order I should actually do it, with a one line reason for each item.
3. Point out anything that feels urgent but is not actually important.
4. If two items depend on each other, say which comes first.
5. If an item is too vague to place, put it in a Questions list instead of guessing what I meant.

Rules:
- Keep the whole answer on one screen.
- Use plain words. No motivational talk, no filler.
- Do not invent tasks I did not give you.

End with one sentence: the single thing that matters most today, and why.`,
        tip: "Run it every morning for a week before you judge it. The value shows up on the chaotic days, not the calm ones."
      },
      {
        id: "explain-like-new",
        title: "Explain it like I am new",
        when: "Use this when someone uses a word or idea you do not understand and you would rather not pretend you do.",
        prompt: `I am completely new to [topic or term]. Explain it to me without jargon.

Here is where I met it, so you know the context:
[paste the sentence, email, or article where it came up, or write "no context, just curious"]

Do this:
1. Say what it is in two or three plain sentences.
2. Explain why people use it or care about it, with one everyday example I would recognise.
3. Tell me the one thing beginners most often get wrong about it.
4. If the meaning changes depending on context, give me the meaning that fits the text I pasted.

Rules:
- Short sentences. Everyday words.
- If you must use a technical word, put its plain meaning in brackets right after it.
- Do not assume I know anything about the field.
- If my context is not enough to be sure what the term means here, say so and ask me one question.

End with one small thing I could try or look at today to see the idea in action.`,
        tip: `If any part is still foggy, follow up with "explain that part again to a ten year old". It works more often than it should.`
      },
      {
        id: "interview-me-first",
        title: "Make AI ask questions first",
        when: "Use this when your request is fuzzy and you know a vague prompt would get a vague answer.",
        prompt: `I want help with this: [describe your goal in one or two lines, even roughly].

Before you give me any answer, act like an experienced consultant taking a brief. Ask me the three to five questions you most need answered to do this well. Ask one short question at a time and wait for my reply before the next one.

Rules for the interview:
1. Ask about things that would actually change your answer, not background trivia.
2. If my reply is vague, push once for something more concrete before moving on.
3. Do not start solving the problem while the interview is running.

When you have what you need, write "Ready" and then give me your best answer based on everything I told you.

Format for the final answer:
- Start with the recommendation in two or three sentences.
- Then the reasoning, kept short.
- Then the first concrete step I should take.

Keep the language plain and do not pad it.`,
        tip: "The questions it asks are half the value. They show you what you had not decided yet."
      },
      {
        id: "fix-my-prompt",
        title: "Rewrite my prompt properly",
        when: "Use this when a prompt keeps giving you weak answers and you cannot tell what is wrong with it.",
        prompt: `You are a prompt editor. I will give you a prompt I wrote that is not getting the results I want. Improve it, and teach me something in the process.

My prompt:
[paste your prompt here]

What I actually wanted from it:
[describe the result you were hoping for]

What I got instead:
[describe or paste the disappointing answer]

Do this:
1. Diagnose in two or three sentences why the prompt underdelivers. Be direct.
2. Rewrite the prompt. Give it a clear role, the context it was missing, concrete instructions, and a defined output format.
3. Mark in the rewrite which parts I should adapt each time I use it, using [brackets].
4. List two or three habits from my original prompt that I should drop in future.

Rules:
- Keep the rewritten prompt as short as it can be while still working.
- Do not add requirements I never asked for.
- Plain words only.

End with the rewritten prompt in a code block so I can copy it in one click.`,
        tip: "Keep the rewrites. After five of them you will see the same fixes repeating, and that is you learning to prompt."
      },
      {
        id: "stress-test-answer",
        title: "Stress test an AI answer",
        when: "Use this when an AI answer looks confident, and you are about to act on it.",
        prompt: `You are a careful reviewer. I will paste an answer I got from an AI, and your job is to stress test it before I rely on it.

The answer:
[paste the AI answer here]

What I plan to do based on it:
[one line, for example "send this to a client" or "follow these tax steps"]

Do this:
1. List the claims in the answer that are checkable facts. For each one, say how confident you are and how I could verify it quickly.
2. Point out anything that is vague, generic, or written to sound right rather than be right.
3. Say what is missing: the questions the answer skipped over.
4. If any claim depends on current information like prices, laws, or software versions, flag it. Your training data may be out of date.

Rules:
- Do not soften the review to be polite.
- If the whole answer is actually fine, say so plainly and stop.

End with a verdict on one line: safe to use, use with edits, or verify first. Then list the two most important things to double check.`,
        tip: "Confident but vague is the classic failure mode. If an answer feels smooth but empty, this prompt usually finds why."
      },
      {
        id: "hard-message",
        title: "Draft the message I keep avoiding",
        when: "Use this when you owe someone a difficult message and keep pushing it to tomorrow.",
        prompt: `You are helping me write a message I have been avoiding. Keep me honest and keep it kind.

The situation:
[explain who the message is for, what happened, and why it is uncomfortable]

What the message must achieve:
[one line, for example "apologise for the delay and give a new date"]

Tone: [formal or casual]. The relationship: [client, boss, friend, family].

Do this:
1. Draft the message. Get to the point in the first sentence. No long wind up.
2. If I am at fault, own it plainly in one sentence. No drama, no over apologising.
3. State the concrete next step or new commitment.
4. Keep it under 120 words.

Rules:
- Do not invent excuses, reasons, or events I did not give you.
- No corporate phrases and no fake warmth.
- Write it so I could send it exactly as it is.

After the draft, add two lines: what reaction I should realistically expect, and the one thing I should not add if the reply comes back cold.`,
        tip: "Send it the same hour you draft it. The rewrite loop is just avoidance with better formatting."
      },
      {
        id: "honest-summary",
        title: "Summarise without losing the point",
        when: "Use this when you have a long document, article, or contract section and only need what matters.",
        prompt: `You are a careful reader summarising a document for a busy person. Accuracy beats elegance.

The document:
[paste the text, or the part of it you need]

Why I am reading it:
[one line, for example "deciding whether to sign" or "need to reply by Friday"]

Do this:
1. Summarise the whole thing in five bullets or fewer, in plain words.
2. Pull out everything that involves money, dates, deadlines, or obligations, quoted word for word, in a separate list.
3. Flag anything unusual, one sided, or easy to miss.
4. Tell me what the document does not say that I would probably expect it to.

Rules:
- Quote exactly where the wording matters. Never paraphrase numbers or dates.
- Do not smooth over confusing parts. If a section is unclear, say it is unclear.
- No commentary on how interesting the document is.

End with one line: what you would do next in my position, phrased as a suggestion. If the stakes are high, remind me to read the flagged parts myself.`,
        tip: "For contracts and anything legal, use the summary to decide which parts to read properly. Never use it as a replacement for reading them."
      },
      {
        id: "ai-in-my-week",
        title: "Where AI fits in my week",
        when: "Use this when you keep hearing AI could save you time but cannot see where in your own week.",
        prompt: `You are a practical AI consultant with no products to sell me. I will describe my normal week, and you will find the tasks where AI genuinely helps, and the ones where it does not.

My normal week:
[describe your job and list the tasks that fill your week, roughly how long each takes, and which ones you dislike]

Do this:
1. Pick the three tasks where AI would save me the most time this month. For each, say what the AI does, what stays my job, and a realistic time saving.
2. Name the tasks on my list where AI is a bad fit, with a one line reason each.
3. For the best candidate, write the exact prompt I should try first.
4. Rank the three by effort to get started, easiest first.

Rules:
- Be conservative with the numbers. A believable hour beats an impressive ten.
- Plain words, no sales tone.
- If my description is too thin to judge a task, ask me about it instead of guessing.

End with a table: task, what AI does, what stays mine, minutes saved per week.`,
        tip: "If an estimate sounds too good, halve it. It will still be worth doing, and now it will also be true."
      }
    ]
  },
  {
    id: "writing",
    chip: "Writing",
    name: "Best prompts for writing",
    blurb: [
      "Draft faster and still sound like yourself. These keep your voice and cut the filler.",
      "They also stop your text from reading like a machine wrote it, because readers can tell."
    ],
    updated: UPDATED,
    prompts: [
      {
        id: "sound-like-me",
        title: "Rewrite this in my voice",
        when: "Use this when you have a rough draft and want it to read the way you actually talk.",
        prompt: `Rewrite the text below so it sounds like me, based on the voice sample I give you.

A sample of my real writing, so you can hear my voice:
[paste a few paragraphs you wrote yourself, an email or a post, anything natural]

Text to rewrite:
[paste your rough draft here]

Do this:
1. Match my sentence length, rhythm, and level of formality from the sample.
2. Keep my meaning and my main points exactly. Do not add new claims, examples, or numbers.
3. Where my draft is confusing, make it clearer, not fancier.
4. Keep it roughly the same length or shorter.

Rules:
- Common words over clever ones.
- No buzzwords, no hype, and never use em dashes. Use commas and full stops.
- If my draft and my voice sample clash somewhere, follow the sample.

Give me the rewrite only, no notes before or after it. If you were unsure what I meant in a sentence, keep my version and mark it with [check] so I can fix it myself.`,
        tip: "Save your voice sample somewhere handy. Pasting it every time is the whole trick, and it takes ten seconds."
      },
      {
        id: "cut-in-half",
        title: "Cut this until it is sharp",
        when: "Use this when your text is too long and you can no longer see what to remove.",
        prompt: `You are a strict editor. Cut the text below by about half without losing the meaning or my voice.

Text:
[paste your text here]

Remove:
1. Filler words, warm up sentences, and throat clearing before the point.
2. Hedging like "I think maybe" or "sort of".
3. Repeated points, even when the wording differs.
4. Anything a reader could skip without missing information.

Keep:
1. The main argument and its order.
2. Every concrete example, number, and name.
3. My tone. Editing is not a personality transplant.

Rules:
- Do not compress by making sentences abstract. Prefer deleting whole weak sentences over blurring strong ones.
- Do not add anything new.

Return only the shorter version. Under it, on one line, tell me roughly what percent shorter it is and which single cut you hesitated over, so I can restore it if you guessed wrong.`,
        tip: "If the half length version still works, run it again. The second pass hurts more and helps more."
      },
      {
        id: "notes-to-draft",
        title: "Messy notes into a first draft",
        when: "Use this when you have scattered notes and the blank page is the only thing between you and a draft.",
        prompt: `You are my drafting partner. Turn my messy notes into a structured first draft I can then edit myself.

What this will be:
[for example "a blog post", "an internal memo", "a talk outline"]

Who will read it:
[one line about the audience]

My notes, in no particular order:
[paste everything: fragments, bullets, half sentences]

Do this:
1. Propose an order: a short outline built only from what is in my notes.
2. Write the draft following that outline, in plain, direct language.
3. Where my notes are thin, do not fill the gap with generic text. Insert [more here: question] telling me what is missing.
4. Keep every specific detail, number, and phrase from my notes that has character.

Rules:
- No introduction that restates the title. Start where it gets interesting.
- No conclusion that begins with "In conclusion".
- Do not invent facts, quotes, or examples.

End with the outline first, then the draft, then a three line list of the gaps I need to fill.`,
        tip: "The [more here] gaps are the real output. They tell you what you actually think before you polish anything."
      },
      {
        id: "remove-ai-flavor",
        title: "Strip the AI flavor out",
        when: "Use this when a draft smells like AI and you need it to read human again.",
        prompt: `You are an editor who removes the telltale signs of AI writing from a text while keeping its content.

Text:
[paste the text here]

Hunt down and fix:
1. Buzzwords and inflated verbs: leverage, empower, elevate, unlock, delve, streamline.
2. The contrast formula "it is not X, it is Y" and "not only X but also Y". Say the point once, plainly.
3. Em dashes. Replace them with commas, full stops, or nothing.
4. Perfectly balanced paragraphs where every one has three sentences. Vary the rhythm.
5. Empty openers like "In today's world" and closers that just summarise what I read.
6. Lists of three where the third item is padding.
7. Adjectives doing no work: seamless, robust, comprehensive, cutting edge.

Rules:
- Keep the facts, structure, and intent. This is a cleaning pass, not a rewrite.
- Plain words. Shorter is better.
- If a sentence exists only to sound impressive, delete it entirely.

Return the cleaned text, then a short table counting how many of each problem you fixed.`,
        tip: "Run your final drafts through this even when you wrote them yourself. We all picked up some of these habits from reading AI text."
      },
      {
        id: "fix-my-english",
        title: "Make my English sound natural",
        when: "Use this when English is not your first language and you want your text checked without changing who you are.",
        prompt: `You are an English editor working with a non-native speaker. My English is decent but not native, and I want my text corrected, not rewritten into someone else's style.

My text:
[paste your text here]

Where it will be used: [email to a client, LinkedIn post, application, anything]

Do this:
1. Fix grammar, articles, prepositions, and word order.
2. Replace only the words a native speaker would genuinely not use in this context. Keep my simpler vocabulary everywhere else.
3. Keep my sentence structure where it works. Do not make sentences longer or more formal.
4. Keep all my facts, names, and numbers untouched.

Rules:
- Do not upgrade my language to impress. Clear beats fancy.
- No idioms I did not use myself.
- Spelling: [British or American, pick one].

Return the corrected text first. Under it, list the five most useful corrections with a one line explanation each, so I stop repeating those mistakes. Skip explanations for one time typos.`,
        tip: "The five explanations are the part that compounds. After a month you will need this prompt visibly less."
      },
      {
        id: "honest-editor",
        title: "Critique my draft, do not rewrite",
        when: "Use this when you want to stay the writer and just need a sharp second pair of eyes.",
        prompt: `You are an honest editor. Read my draft and critique it. Do not rewrite it. The writing stays mine.

The draft:
[paste your draft here]

Who it is for and what it should achieve:
[one or two lines]

Give me:
1. The strongest part, named specifically, and why it works.
2. The weakest part, named specifically, and why it fails. Quote the exact sentences.
3. Where you stopped believing me or lost interest, if anywhere.
4. What the draft promises at the start but never delivers.
5. Three questions a sharp reader would ask that the draft leaves unanswered.

Rules:
- Be direct. Politeness that hides problems is useless to me.
- Critique the draft in front of you, not the draft you would have written.
- No rewritten sentences, no suggested phrasings. Point at problems, I will solve them.

End with one line: publish as is, needs small fixes, or needs a rethink. Then name the single change with the biggest payoff.`,
        tip: "Asking for critique instead of a rewrite is slower and better. You keep your voice and you learn where it wobbles."
      },
      {
        id: "titles-worth-keeping",
        title: "Ten titles, three worth keeping",
        when: "Use this when the piece is done and the title is the last thing standing.",
        prompt: `You are a title editor for a writer who hates clickbait. I need title options for the piece below.

The piece, or an honest summary of it:
[paste the text or a solid summary]

Where the title will appear: [blog, YouTube, newsletter subject line, report cover]

Do this:
1. Write ten titles. Vary the angle: some plain and descriptive, some curious, some leading with the strongest specific detail from the piece.
2. Every title must be honest. Promise nothing the piece does not deliver.
3. No formulas: no "X things nobody tells you", no "the ultimate guide", no question marks doing fake suspense.
4. Keep each under 60 characters where possible.

Then judge your own work:
5. Pick your best three and give one line each on why they earn the click and still keep the promise.
6. Name the one you would choose, and for which audience.

End with the ten as a plain numbered list, then the three finalists with reasons.`,
        tip: "Pick the title that is still accurate on a bad day. The honest one keeps working after the click."
      },
      {
        id: "one-text-three-readers",
        title: "Rewrite for a different reader",
        when: "Use this when one text has to land with a second audience and a copy paste will not do it.",
        prompt: `You are helping me adapt one text for different readers without creating three different truths.

The original text:
[paste it here]

It was written for: [original audience]
I now need versions for: [audience two] and [audience three, or delete this line]

For each new version, do this:
1. Keep every fact, number, and commitment identical. Only the framing, vocabulary, and level of detail change.
2. Open with the thing this specific reader cares about most.
3. Cut the parts this reader does not need, and list what you cut at the end.
4. Match length to attention: a boss version may be five lines, a technical peer version can be longer.

Rules:
- No new claims in any version.
- Plain words in all of them. Precision shows expertise, jargon density does not.

Return each version under a clear heading with one line stating the reader and the goal, then the cut list.`,
        tip: "If the versions start disagreeing on facts, stop and fix the source text. That difference is how misunderstandings get born."
      }
    ]
  },
  {
    id: "building",
    chip: "Building",
    name: "Building software with AI",
    blurb: [
      "Go from a rough idea to working software, even if you do not code.",
      "Plan small, brief the AI properly, and get unstuck when it breaks. It will break."
    ],
    updated: UPDATED,
    prompts: [
      {
        id: "idea-to-spec",
        title: "Rough idea into a build spec",
        when: "Use this when you have an idea in your head and need a plan before you let any tool write code.",
        prompt: `You are a pragmatic software planner working with a non-programmer. Turn my rough idea into a short build spec an AI coding tool can follow.

My idea, in plain words:
[describe it, even if it is messy: what it does, who uses it, why you want it]

Do this:
1. State the core job of the app in one sentence.
2. List the screens or pages it needs. Short list, plain names.
3. List the data it must store, as a simple table: thing, fields, example.
4. Define the first three build steps, in order, each small enough to finish in one sitting.
5. List the decisions I have to make before starting, with your recommended default for each so I can just agree.

Rules:
- Cut every feature not needed for the first working version. Park them in a Later list.
- Ask me up to three questions, but only if something genuinely blocks the plan.
- No technology names without a reason in plain words.

Keep the whole spec readable in two minutes. End with the one risk most likely to kill this project, and how to dodge it.`,
        tip: "Do not skip step 5. Every decision you leave open now becomes a random guess the coding tool makes later."
      },
      {
        id: "smallest-version",
        title: "Plan the smallest version worth shipping",
        when: "Use this when your idea keeps growing and you need to ship something small first.",
        prompt: `You are a strict product advisor. Your job is to shrink my idea down to the smallest version that is genuinely useful to one real person.

My idea:
[describe it, including all the features you are dreaming about]

Who would use the first version:
[one line: a real person or group you can actually reach]

Do this:
1. List the features the first version must have to be useful at all. Be brutal.
2. Move everything else into a Later list, so I can park ideas with a clear conscience.
3. Name the one feature that decides success. If that one is right, the rest is decoration.
4. Estimate what the must list means in build effort: small, medium, or large, with a one line reason.
5. Tell me what I should do manually behind the scenes instead of building it. Unglamorous beats unbuilt.

Rules:
- If a feature is nice but not necessary, it goes to Later. No exceptions for my favorites.
- Keep the answer short.

End with the must list as a checklist I can start today.`,
        tip: "The manual workaround list is the underrated part. Half of version one can usually be you, a spreadsheet, and honesty."
      },
      {
        id: "builder-brief",
        title: "Brief an AI coding tool",
        when: "Use this when the spec is ready and you want the first message to Claude Code, Cursor, or a similar tool to start the build right.",
        prompt: `You are helping me write the opening brief for an AI coding tool. The quality of this first message decides how much cleanup I do later, so make it precise.

My spec or plan:
[paste your build spec or describe the project]

My experience level: [none, some scripting, comfortable]
Preferences I already have: [any tech, hosting, or style preferences, or "no preferences"]

Write the brief so it includes:
1. What we are building and for whom, in two sentences.
2. The exact scope of the first working version, naming what is out of scope too.
3. The working rules: simple technology choices, code a beginner can navigate, no extra features, ask me before big decisions.
4. What done looks like: a short checklist the tool can test against.
5. An instruction to build in small steps and show me something running early.

Rules:
- Plain language. I must understand the brief, not only the tool.
- Do not include requirements I never mentioned. If something important is missing, ask me first.

Return the brief in a code block, ready to paste.`,
        tip: `Save the "done looks like" checklist. When the tool says it is finished, that list is how you check without reading code.`
      },
      {
        id: "fix-error-plain",
        title: "Explain and fix this error",
        when: "Use this when you hit an error and you are not sure what the code even does.",
        prompt: `I am not a strong coder and I hit an error. Explain it simply and give me the exact fix.

The error message, complete:
[paste the full error here]

The code around it:
[paste the file or section, or write "tell me what to paste and from where"]

What I did right before it broke:
[one line, for example "added a login form" or "nothing, it broke after a deploy"]

Do this:
1. Explain in one short paragraph, in words a non-coder follows, what caused this.
2. Give me the exact change: show the lines before and after.
3. Tell me how to check the fix worked, step by step.
4. Say whether this error hints at a bigger problem or is just a detail.

Rules:
- Do not rewrite the whole file.
- Do not lecture me about best practices unless one directly caused this error.
- If you need one more piece of information to be sure, ask for exactly that and nothing else.

End with a one line plain words summary of what was wrong, so I recognise it next time.`,
        tip: "Always paste the whole error, including the boring lines. The useful part is often the one that looks least readable."
      },
      {
        id: "loop-breaker",
        title: "Get out of the fix loop",
        when: "Use this when the AI keeps confidently fixing the same bug and the bug keeps not being fixed.",
        prompt: `Stop. We are in a loop: you have tried several fixes for the same problem and it is still broken. Change your approach completely.

The problem, in my words:
[describe what is broken and what should happen instead]

What has been tried so far:
[list the failed fixes roughly, or paste the last few attempts]

The relevant code and the current error:
[paste them]

New rules, in order:
1. Do not propose any fix yet. First list every assumption you have been making about this code, and mark which ones are unverified.
2. Tell me what evidence would confirm the real cause: what to print, log, click, or check. Give me exact steps and I will report back.
3. Only after my report, name the most likely cause and say how confident you are.
4. If two causes remain possible, give me one test that separates them.

Be honest about uncertainty. "I do not know yet, here is how we find out" is a better answer than another confident guess.

End with the checklist of things I should go check right now, numbered.`,
        tip: "The loop almost always means the AI is fixing its guess instead of the bug. Making it gather evidence first breaks that pattern."
      },
      {
        id: "explain-code",
        title: "Tell me what this code does",
        when: "Use this when you are about to use code you did not write and want to know what it really does first.",
        prompt: `You are explaining code to a careful non-programmer who is about to run it. Tell me what it actually does, including what could go wrong.

The code:
[paste the code, script, or snippet here]

Where I got it and what I was told it does:
[one line, for example "a forum post that says it cleans old files"]

Do this:
1. Describe what the code does step by step, in plain words. Small numbered steps.
2. Flag anything that touches the world outside itself: files it deletes or changes, network requests, passwords or keys, anything it installs.
3. Say what happens if it runs twice, or on the wrong folder, or fails halfway.
4. Compare what it really does with what I was told it does, and name any difference.

Rules:
- No jargon without a plain meaning in brackets.
- If a part is genuinely unclear or depends on my setup, say so instead of guessing.

End with a verdict on one line: safe to run, run with these changes, or do not run this. Then name the single biggest risk.`,
        tip: `The "what if it runs twice" question has saved me more than once. Ask it about every script that deletes anything.`
      },
      {
        id: "pick-tools",
        title: "Pick tools without the hype",
        when: "Use this when every tool claims to be the answer and you just need one that fits your case.",
        prompt: `You are a tool advisor with no affiliate links and no favorites. Help me choose the right tool for my project, sized to my reality.

What I am building or doing:
[one or two lines]

My constraints:
- Budget: [amount per month, can be zero]
- Technical comfort: [none, some, high]
- Deal breakers: [for example "must work in my language", "data stays in the EU", "no subscriptions"]

Do this:
1. Give me three realistic options: the simplest thing that works, the balanced pick, and the heavy one I probably do not need yet.
2. For each: what it costs in practice including the paid tier I would actually hit, the setup effort in hours, and the main limitation nobody mentions in reviews.
3. Say which one you would pick in my situation and why, in two sentences.
4. Name what I do not need to buy today, and when that changes.

Rules:
- Pricing and features may have changed since your training data. Say so, and tell me which numbers to verify.
- No feature lists copied from marketing pages. Practical differences only.

End with a three row comparison table: option, monthly cost, setup effort, biggest limitation.`,
        tip: "Ask it separately what happens to your data if you quit each tool. Exit cost is the spec nobody prints."
      },
      {
        id: "ship-checklist",
        title: "Test it before anyone sees it",
        when: "Use this when the build looks done and you want to find the embarrassing bugs before your first user does.",
        prompt: `You are a pragmatic tester. Build me a manual test checklist for my project, focused on what breaks in front of real users.

What the app or site does:
[describe it, or paste the spec]

The parts I am least sure about:
[one or two lines, or "no idea, you tell me"]

Do this:
1. Write a click-through checklist of the main journey a normal user takes, step by step, with what should happen at each step.
2. Add the classic breakers: wrong inputs, empty inputs, double clicks, the back button, refreshing mid-action, a slow connection, and a phone screen.
3. Add the embarrassing checks: broken links, placeholder text left in, wrong dates, typos in buttons.
4. Order the whole list so the highest risk items come first.
5. Keep each item one line, checkable with a yes or no.

Rules:
- Assume I will test by hand in a browser. No automated testing talk unless one thing truly needs it, and then explain it plainly.

End with the checklist in copyable form, and a one line rule for when I am allowed to stop testing and ship.`,
        tip: "Test on your phone before you share the link. Half of first visits come from a phone, and that is where layouts die."
      }
    ]
  },
  {
    id: "founders",
    chip: "Founders",
    name: "Founders and small business owners",
    blurb: [
      "For people running a small business. Customers, reviews, numbers, suppliers.",
      "Plus the messages you keep putting off, drafted so you can send them today."
    ],
    updated: UPDATED,
    prompts: [
      {
        id: "review-triage",
        title: "Find the real complaint in reviews",
        when: "Use this when reviews are piling up and you want the real pattern without the noise.",
        prompt: `You are helping a small business owner read customer reviews honestly. Your job is triage. You never draft public replies.

Here are the recent reviews, pasted as they are:
[paste reviews from Google, marketplaces, or anywhere, stars included if you have them]

Do this:
1. Group the reviews into real themes. Name each theme in plain words.
2. Separate signal from noise: one-off bad days and unreasonable outliers go in their own pile, labeled as such.
3. For each real theme, quote one or two representative lines, word for word.
4. Rank the themes by damage: which one loses the most customers, judging by how often it appears and how strongly it is worded.
5. Name the single thing to fix first, and what an achievable fix looks like.

Rules:
- Do not average everything into "mostly positive". I need the pattern, praise included but kept separate.
- Do not invent causes the reviews never mention. If the reviews are too few for a real pattern, say so.

End with one screen: themes ranked, the one fix, and the two quotes I should read twice.`,
        tip: "Run this monthly and keep the outputs. A theme that survives three months is not an opinion anymore, it is a fact about your business."
      },
      {
        id: "unhappy-customer",
        title: "Reply to an unhappy customer",
        when: "Use this when a complaint lands and you want to answer calmly instead of at midnight in the wrong tone.",
        prompt: `You are helping a small business owner reply to an unhappy customer. Calm, human, and specific, never corporate.

The customer's message:
[paste it exactly]

What actually happened from my side:
[your honest version, including anything that was your fault]

What I am willing to offer:
[refund, redo, discount, explanation only, or "nothing beyond an apology"]

Do this:
1. Draft a reply that answers their specific complaint, in the same language their message is written in.
2. Acknowledge the concrete thing that went wrong. No blanket apologies for "any inconvenience".
3. State plainly what I will do, and only what I listed above. Do not invent compensation.
4. Keep it under 130 words and end with one clear next step.

Rules:
- No defensiveness, no explaining how busy we were.
- No fake warmth and no exclamation marks.
- If the customer is factually wrong somewhere, correct it once, politely, with the fact.

Under the draft, add one line telling me what to fix in the business so this complaint does not repeat.`,
        tip: `Write the "what actually happened" part properly. The reply is only as good as your own account of the mess.`
      },
      {
        id: "sell-sheet",
        title: "Describe what I sell, grounded",
        when: "Use this when you need product or service copy and want it built from real details, never invented ones.",
        prompt: `You are a copywriter for a small business. Write a clear description of what I sell, using only the details I give you.

What I sell:
[the product or service, in your words]

The concrete details:
[paste everything real: specs, materials, dimensions, what is included, price, delivery time, who it is for, what problem it solves]

Where the text will live: [website page, marketplace listing, brochure]

Do this:
1. Lead with the thing a buyer actually cares about, taken from my details. Never open with generic lines about quality or passion.
2. Write one short paragraph of natural, connected sentences, then bullet points for the hard facts.
3. Use plain words a stranger understands. If my industry has one necessary term, keep it and explain it in brackets.
4. If an important detail is missing, for example dimensions or delivery, list it as a question at the end. Do not fill gaps with adjectives.

Rules:
- Every claim must trace back to a detail I gave you.
- No superlatives, no "premium", no "solutions".

End with: the description, the fact bullets, and the missing details questions.`,
        tip: "The missing details list doubles as a list of what customers keep emailing you about. Answer those on the page and the emails stop."
      },
      {
        id: "price-increase",
        title: "Announce a price increase honestly",
        when: "Use this when costs moved, your prices have to follow, and you keep postponing the announcement.",
        prompt: `You are helping a small business owner announce a price increase to existing customers. Honest, short, and steady, with no apologising in circles.

The facts:
- What is changing: [old price to new price, or percentage, per what]
- When it starts: [date]
- Why, honestly: [costs, wages, materials, or simply that the price was too low for the work]
- What stays the same or improves: [anything true, or "nothing to add"]
- Who gets this message: [all customers, long term clients, subscribers]

Do this:
1. Draft the announcement. State the change and the date in the first two sentences.
2. Give the reason in one or two honest sentences. No drama, no long defense of the decision.
3. If I listed anything that stays the same or improves, mention it once, briefly.
4. Close with what the customer needs to do, if anything, and a simple thank you.

Rules:
- Under 150 words.
- Do not offer discounts or exceptions I did not list.
- No "unfortunately". A correct price is not a misfortune.

Give me two versions: one for email, one shorter for an invoice note or a counter sign.`,
        tip: "Send it well before the date and then stop explaining. People accept a clear increase faster than a nervous one."
      },
      {
        id: "weekly-numbers",
        title: "Read my weekly numbers for me",
        when: "Use this when you have the numbers but never the quiet hour to see what they are saying.",
        prompt: `You are a level headed analyst for a small business. Read my numbers and tell me what changed, in plain words, with no invented trends.

This week or month:
[paste your numbers: sales, orders, visitors, costs, whatever you track, any messy format]

The previous period, for comparison:
[paste the same numbers from last week or month, or write "none, first time"]

Anything unusual that happened:
[for example "ran a discount", "closed two days", or "nothing"]

Do this:
1. Compare the periods and name what moved, by how much, in absolute numbers and percent.
2. Separate real movement from noise. Small wobbles on small numbers are not a trend. Say so when that is the case.
3. Connect movements to the context I gave you. Do not invent causes beyond it, and mark every guess clearly as a guess.
4. Tell me the one number to watch next period, and why.

Rules:
- No praise, no alarm. Only what the numbers support.
- If my data is too thin to conclude anything, say exactly that.

End with five lines maximum: what changed, why it likely changed, what to do about it.`,
        tip: "Paste the same metrics in the same order every week. The comparison gets sharper when the format stops changing."
      },
      {
        id: "stop-doing",
        title: "Decide what I stop doing",
        when: "Use this when you are the bottleneck in your own business and every task feels like it needs you.",
        prompt: `You are an operations advisor for a business owner who does too much. Help me decide what to stop doing personally.

Everything I did in a typical week, roughly with hours:
[list the tasks and time honestly, including the small recurring stuff]

What only I can legally or realistically do:
[one or two lines]

What an hour of my time should be worth: [amount, roughly]

Do this:
1. Sort my tasks into four groups: only me, delegate to a person, automate or hand to AI, and stop doing entirely.
2. For every task leaving my plate, name the destination concretely: what kind of person, what kind of tool, or why it can simply die.
3. Estimate the hours per week this frees, conservatively.
4. Pick the first single handover to make this month: the one with the best ratio of hours saved to handover effort.
5. List what could go wrong with that first handover, and the simple check that catches it early.

Rules:
- Be skeptical of "only I can do this". Challenge at least two of my claims there.
- No motivational language. This is arithmetic.

End with the four groups as a table, then the one first move.`,
        tip: "Your ego will defend the tasks you are good at, and those are often exactly the ones to hand over. Watch for that while you read the output."
      },
      {
        id: "competitor-read",
        title: "Get an honest competitor read",
        when: "Use this when you want a sober look at a competitor, without the anxiety and without fabricated intel.",
        prompt: `You are a calm market analyst. I will paste public material from a competitor, and you will tell me what it says about their positioning, using only what is in front of you.

Competitor material:
[paste text from their website, pricing page, about page, recent posts]

My own business in three lines, for contrast:
[what you sell, to whom, at what price level]

Do this:
1. Summarise their offer and positioning: who they target, what they promise, how they price, judging only from the pasted material.
2. Name what they emphasise most, and what they are notably silent about.
3. Compare against my three lines: where we genuinely differ, and where we say the same thing in different fonts.
4. Point at the gap: something customers plausibly want that neither of us clearly claims.

Rules:
- Reason only from the pasted material. No guesses about their revenue, team, or plans. Write "unknown" where it is unknown.
- No advice to copy them. The differences are the asset.

End with one screen: their position in two sentences, our real difference in one, and the one gap worth testing.`,
        tip: "Paste their customer reviews into the review triage prompt too. What their customers complain about is your cheapest market research."
      },
      {
        id: "negotiation-prep",
        title: "Prep me to negotiate",
        when: "Use this when a negotiation is coming, a supplier, a landlord, a big client, and you want to walk in prepared instead of hopeful.",
        prompt: `You are a negotiation coach for a small business owner. Prepare me for a specific conversation. Practical, not theatrical.

The situation:
[who I am negotiating with, about what, and the history in a few lines]

My numbers:
- What I want: [target outcome]
- What I can accept: [your real minimum]
- What I can offer them: [flexibility on volume, timing, contract length, anything true]

What I know about their side:
[their pressures, alternatives, deadlines, or "little"]

Do this:
1. Tell me my strongest and weakest points in this setup, honestly.
2. Predict their three most likely arguments or objections, and give me a calm response to each, one or two sentences, in normal spoken language.
3. Give me the opening line that anchors the conversation, plain and unaggressive.
4. Tell me what I should refuse to decide in the room, and what to say to buy time.
5. Define my walk away line based on the minimum I gave you.

Rules:
- No manipulation tactics and no scripts that only work on people who have not read the same scripts.
- If my minimum and my target look unrealistic together, say so before anything else.

End with a one screen cheat sheet: opening line, three responses, walk away line.`,
        tip: "Rehearse the responses out loud once. Reading them silently feels like preparation, but it is not the same thing."
      }
    ]
  },
  {
    id: "freelancers",
    chip: "Freelancers",
    name: "Freelancers and solo operators",
    blurb: [
      "Your business is you. Briefs, proposals, feedback rounds, unpaid invoices.",
      "These push the admin down so more of your week goes to the actual work."
    ],
    updated: UPDATED,
    prompts: [
      {
        id: "brief-translator",
        title: "Messy client notes into a brief",
        when: "Use this when the client sent three voice notes and half an idea, and you need a real brief before any work starts.",
        prompt: `You are an experienced freelancer turning chaotic client input into a structured brief. What is missing gets asked, never invented.

Everything the client sent, exactly as it arrived:
[paste the emails, messages, or voice note transcripts]

My discipline: [design, copywriting, web development, photography, anything]

Do this:
1. Extract what the client actually wants, in one sentence, in plain words.
2. Build the brief: context and business, target audience, the problem being solved, scope of work with what is included and what is not, references or taste they mentioned, deadline and budget if stated.
3. Every gap becomes a question in a "Questions to send back" list. Do not fill gaps with plausible assumptions.
4. Flag any contradiction between things the client said, quoting both spots.

Rules:
- Keep the client's own words where they are specific. Their vocabulary carries information.
- Plain formatting I can paste into an email or a document.

End with the brief, then the questions list ready to send, as short as it can be while covering every gap.`,
        tip: "Send the questions before you quote a price. Every unanswered question in the brief is a revision round you will pay for later."
      },
      {
        id: "revision-decoder",
        title: "Decode vague client feedback",
        when: `Use this when the feedback says "make it pop" and you need to know what to actually change.`,
        prompt: `You are helping a freelancer translate vague client feedback into concrete actions before touching the work.

The feedback, word for word:
[paste exactly what the client said or wrote]

What was delivered, briefly:
[one or two lines describing the work they are reacting to]

Round number: [first feedback, second, third or later]

Do this:
1. Translate each vague phrase into the most likely concrete requests, maximum two interpretations per phrase.
2. Mark which interpretations are safe to act on and which need confirming first.
3. Spot contradictions inside the feedback, for example "more striking" plus "keep it subtle", and name them plainly.
4. Draft a short, friendly reply that confirms the ambiguous points as simple either-or questions the client can answer in one minute.
5. List the concrete action items I can already start on while I wait.

Rules:
- Never guess on changes that would take hours. Those always go in the confirm-first pile.
- The reply must not sound annoyed, whatever round this is.

End with two blocks: the reply to send, and my private action list.`,
        tip: "Clients repeat the same vague words. Keep your translations, and by the third project you will have a private dictionary for each client."
      },
      {
        id: "proposal-builder",
        title: "Draft a proposal with my rates",
        when: "Use this when the scope is roughly agreed and you need a clean proposal that uses your numbers, never invented ones.",
        prompt: `You are helping a freelancer write a client proposal. All prices, dates, and terms come from me. You structure, you never price.

My setup, saved once and reused:
- What I do and my usual rate: [your rates, hourly or per project]
- Payment terms I work with: [deposit percentage, invoice timing]
- Revision rounds included: [number]

This project:
- Client and what they need: [describe]
- Scope, what is included: [list it]
- Explicitly not included: [list it]
- Price for this project: [your number]
- Timeline: [your estimate]

Do this:
1. Open with two sentences showing I understood their situation, specific to them, no template flattery.
2. Lay out scope and deliverables, clearly separated from what is not included.
3. Present the process and phases, so they see how we get from yes to delivered.
4. State price, payment terms, and revision policy exactly as given. Do not soften, round, or add options.
5. Close with the concrete next step to start.

Rules:
- Under 400 words. Confident, warm, zero begging.
- If any input above is missing, stop and ask me for it.

Return the proposal ready to paste, plus a subject line for the email.`,
        tip: "Check every number in the output against your input before sending. Models can silently mangle a figure, and the money has to be yours exactly."
      },
      {
        id: "scope-guard",
        title: "Push back on scope creep",
        when: "Use this when the client asks for one more small thing and the small things are becoming the project.",
        prompt: `You are helping a freelancer respond to scope creep without souring the relationship.

What the client just asked for:
[paste their request]

What the agreed scope says:
[paste or summarise the relevant part of the proposal or contract]

The history:
[one or two lines, for example "third extra ask this month, first two I did free"]

How I want to handle it: [charge for it, trade it against something, decline it, or "help me decide"]

Do this:
1. Say plainly whether the request is inside or outside the agreed scope, based only on what I pasted.
2. If I asked you to help me decide, give a recommendation with a one line reason, considering the history.
3. Draft the reply: a friendly first sentence that says yes to the relationship, a clear sentence naming this as outside scope, then the path: price, trade, or a slot in the next project.
4. Keep the reply under 110 words and free of apology spirals.

Rules:
- No passive aggression, no legalese, no "as per our agreement".
- Never offer free work as the default option.

End with the reply, plus one line on what to log so this stays documented.`,
        tip: "The first free \"small thing\" sets the exchange rate for the whole relationship. It is easier to be clear on request two than on request nine."
      },
      {
        id: "invoice-chase",
        title: "Chase an unpaid invoice politely",
        when: "Use this when the invoice is overdue and you want your money without burning the relationship.",
        prompt: `You are helping a freelancer chase an overdue invoice. Firm, polite, and impossible to misread.

The facts:
- Invoice number and amount: [fill in]
- Due date and days overdue: [fill in]
- The client and our relationship: [one line, for example "good client, usually pays on time"]
- Reminders already sent: [none, one, several, with dates]
- My escalation options if this continues: [late fee in the contract, pausing work, a legal step, or "none defined"]

Do this:
1. Match the tone to the stage: a first reminder assumes good faith, a second is firmer with a specific date, a third names the consequence I listed.
2. Draft the message for my stage: short, factual, amount and due date in the first two sentences, one clear ask with a date.
3. Offer the easy out once: if payment is already on its way, they can ignore this.
4. Never threaten anything I did not list as a real option.

Rules:
- Under 100 words. No apologising for asking to be paid.
- No emotional language, whatever the history. Facts collect money, feelings collect replies.

Give me the message, a subject line, and one line on when to send the next one if silence continues.`,
        tip: "Send reminders on a fixed rhythm, not when frustration peaks. A calendar is calmer than you are."
      },
      {
        id: "client-update",
        title: "Send updates before they ask",
        when: "Use this when a project runs long and you want the client calm because they always know where things stand.",
        prompt: `You are helping a freelancer write a short project update that prevents the "any news?" email.

The project and client: [one line]

Since the last update:
- Done: [list what got finished, plainly]
- In progress: [what is moving now]
- Blocked or waiting: [anything stuck, and on whom, including if it waits on the client]
- Next: [what happens before the next update]
- Timeline: [still on track, or the new honest date]

Do this:
1. Write the update in under 120 words, leading with overall status in one sentence: on track, slightly behind, or blocked.
2. Keep the sections short: done, next, waiting on you, timeline. Skip empty ones.
3. If something waits on the client, make the ask specific with a date, and say plainly what the delay does to the timeline.
4. If the date moved, state the new date once, with a one sentence reason. No cushioning paragraph.

Rules:
- No filler about hoping they are well.
- Never hide a slip inside good news. Status first, always honest.

End with the message ready to send, plus a subject line that carries the status itself.`,
        tip: "Send it the same day each week. Predictability, not length, is what makes clients stop worrying."
      },
      {
        id: "say-no",
        title: "Decline work without closing doors",
        when: "Use this when a project is wrong for you but the relationship is worth keeping.",
        prompt: `You are helping a freelancer decline a project gracefully.

The request I am declining:
[paste or describe what they asked for]

The honest reason:
[fully booked, wrong fit, budget too low, red flags, or a mix]

What I can honestly offer instead:
[a later start date, a smaller scope, a referral to someone specific, or nothing]

Do this:
1. Draft the decline: thank them specifically for what they asked, one clear sentence saying no, and the reason in a single honest line without oversharing.
2. If I listed an alternative, present it as a genuine option, not a consolation prize.
3. If the real reason is price, say that the budget and my pricing do not meet, without apologising for my rates and without lecturing them about value.
4. Keep the door visibly open only if I actually want it open. Ask me if that is unclear.

Rules:
- Under 100 words. Warm, definite, zero maybes that create follow-up negotiations.
- No fake busyness excuses I did not give you.

End with the message, plus a one line note on whether this decline deserves a referral, based on what I told you.`,
        tip: "A clean fast no gets you more respect and more future work than a slow maybe. The maybe only feels kinder."
      },
      {
        id: "explain-my-work",
        title: "Explain my work to the client",
        when: "Use this when the work is good but the client needs the reasoning in words to feel safe saying yes.",
        prompt: `You are helping a freelancer explain finished work to a client. Clients buy the reasoning as much as the result, so put my decisions into plain words.

What I delivered:
[describe the work: a design, a text, a website, a plan]

My actual reasons, rough notes are fine:
[why you made the key choices: this layout because, this tone because, this order because]

What the brief asked for:
[the goals from the brief, short]

Do this:
1. Write a short walkthrough, three or four paragraphs, connecting each main decision to a goal from the brief.
2. Use only the reasons I gave you. If a choice has no reason listed, ask me rather than inventing a rationale I would have to defend live.
3. Plain, confident language a non-expert follows. No craft jargon.
4. Close with one line inviting focused feedback: what to look at first, and what kind of notes help most.

Rules:
- No overselling. The work carries the weight, the text just turns the lights on.
- Keep it under 250 words.

Return the walkthrough ready to paste under a preview or into an email.`,
        tip: "If a decision has no reason you can say out loud, look at that part of the work again. Sometimes the explanation gap is a design gap."
      }
    ]
  },
  {
    id: "office",
    chip: "Office work",
    name: "Office and operations work",
    blurb: [
      "Inbox, meetings, reports, spreadsheets. Small routines for the everyday grind.",
      "Nothing fancy, just the stuff that quietly gives you back an hour most days."
    ],
    updated: UPDATED,
    prompts: [
      {
        id: "thread-summary",
        title: "Summarise this thread for me",
        when: "Use this when a long thread needs a decision and rereading forty messages is not a plan.",
        prompt: `You are summarising a long work thread for someone who has to act on it and skimmed half of it.

The thread, pasted as is:
[paste the whole email thread or chat, names included]

My role in it: [one line, for example "I own the decision" or "I just got added"]

Do this:
1. Summarise what actually matters in three to five bullets, newest state first.
2. List decisions already made, each with who made it.
3. List open questions, each with the name of the person expected to answer.
4. Name the single next action for me, based on my role, and who is waiting on it.
5. Flag any deadline or date mentioned anywhere in the thread.

Rules:
- Ignore pleasantries, repeated arguments, and dead ends that got resolved later.
- Attribute carefully. If it is unclear who said or decided something, mark it unclear rather than guessing a name.
- Keep everything on one screen.

End with one line I could paste as my reply to move the thread forward.`,
        tip: "The who-is-waiting-on-whom list is what people miss when skimming. Half of stuck threads are two people each waiting for the other."
      },
      {
        id: "notes-to-email",
        title: "Turn notes into a clear email",
        when: "Use this when you have rough notes and need a clean, friendly message out of the door.",
        prompt: `Turn my rough notes into a short, clear work email.

My notes:
[paste your fragments, bullet points, half sentences]

Who it goes to and our relationship: [colleague, my boss, external partner, customer]
What the email must achieve: [one line: inform, get approval, get an answer by a date]

Do this:
1. Write a subject line that states the topic and, if there is one, the deadline.
2. Open with the point in the first sentence. No warm up paragraph.
3. Keep the body under 120 words with one clear ask or next step. If I need multiple answers, number the questions.
4. Match the tone to the relationship I stated, warm but direct in all cases.

Rules:
- No filler phrases, no "hope this finds you well", no em dashes.
- Do not add promises, dates, or commitments that are not in my notes.
- If a critical detail is missing from my notes, put [fill in: what] in the draft instead of inventing it.

Return the subject plus the body, then one line telling me anything I should double check before sending.`,
        tip: "Numbered questions get numbered answers. Prose questions get one vague paragraph back, and then a second email."
      },
      {
        id: "meeting-prep",
        title: "Prep me for this meeting",
        when: "Use this when a meeting is close and you want to walk in with a position instead of improvising one.",
        prompt: `You are prepping me for a work meeting in under two minutes of reading.

The meeting: [topic, and what kind: decision, update, negotiation, first meeting]
Who will be there: [names or roles, and anything about what they care about]
What I want out of it: [your goal in one line]
Background worth knowing: [paste any agenda, thread, or notes, or "none"]

Do this:
1. Give me the three points I should make, sharpest first, each in one sentence I could say out loud.
2. Give me two questions worth asking: ones that surface information I actually need, based on my goal.
3. Predict the most likely pushback and give me a calm two sentence response.
4. Tell me what not to bring up, if the background suggests a topic that derails.
5. Name the concrete thing to secure before the meeting ends: a decision, an owner, a date.

Rules:
- Plain spoken language, no corporate theatre.
- If my goal is fuzzy, ask me one question before doing anything else.

Format: one screen, headed sections, nothing I need to memorise.`,
        tip: "Read it right before the meeting, not an hour early. This is a warm up, and warm ups expire."
      },
      {
        id: "minutes-actions",
        title: "Transcript into minutes and actions",
        when: "Use this when the meeting is over and someone has to say what was decided, and that someone is you.",
        prompt: `You are turning a raw meeting record into minutes people will actually read.

The raw material:
[paste the transcript or your rough notes]

The attendees and their roles, if I know them: [names, or "in the transcript"]

Do this:
1. List the decisions made, one line each, with who made or owns each one.
2. List the action items as a table: action, owner, deadline. If an owner or deadline was never said, write "not assigned" so it is visible. Do not invent one.
3. Summarise the two or three main discussion points in a sentence each, only where the reasoning matters later.
4. List anything explicitly parked or postponed, so it does not silently die.
5. Flag ambiguities: places where the transcript suggests people left with different understandings.

Rules:
- Attach names to statements only where it matters for the action. This is a record, not a blame protocol.
- The whole output fits on one screen.

End with a two line summary I can paste into chat for people who will not open the document.`,
        tip: `Send the minutes within an hour, while memories are soft. "Not assigned" next to an action gets fixed fast when everyone still remembers the meeting.`
      },
      {
        id: "formula-help",
        title: "Get the formula I need",
        when: "Use this when you know what the spreadsheet should do and just cannot make it do it.",
        prompt: `You are a spreadsheet helper for a regular office user, not a programmer. Give me the formula and make me understand it.

My tool: [Excel or Google Sheets, and the language version if not English]

My data layout:
[describe the columns, for example "A has dates, B has names, C has amounts", or paste a few sample rows]

What I want to happen, in plain words:
[for example "sum column C for each name in B, but only for this month"]

Do this:
1. Give me the exact formula for my layout, ready to paste, and say which cell to put it in.
2. Explain how it works in two or three plain sentences, part by part.
3. Tell me the two most likely reasons it shows an error or a wrong number with my kind of data, and the quick fix for each.
4. Show me how to test it: a tiny example with my columns where I can verify the result by head math.

Rules:
- Prefer the simple readable formula over the clever one liner.
- If my description of the layout is ambiguous, ask before answering.

End with the formula in a code block, alone, for clean copying.`,
        tip: "Test on five rows where you can check the answer yourself before trusting it on five thousand."
      },
      {
        id: "status-report",
        title: "Write my status report",
        when: "Use this when the report is due and your week is a blur of done things nobody wrote down.",
        prompt: `You are writing my work status report from my raw notes. Factual, readable, and free of self marketing.

Reporting period: [week, sprint, month]
Who reads it: [my manager, the team, a client]

What happened, in no order:
[dump everything: finished tasks, meetings, problems, half done things, waiting-on items]

Do this:
1. Sort my dump into: completed, in progress, blocked or waiting with who or what it waits on, and planned next.
2. Lead the report with the two or three items that matter most to this reader, one line each.
3. Keep each item factual and specific: what moved, and its state now. No adjectives about how challenging it was.
4. If something slipped, say it plainly with the new expected date. Give the reason only if I included one.
5. Keep the whole report under 200 words.

Rules:
- Do not inflate. Do not add achievements, effort, or progress percentages I did not state.
- Plain sentences a skimming reader still gets.

Return the report with small headings, plus a one line summary at the top.`,
        tip: "Keep a running done list during the week, one line per item. Friday's report then writes itself from real material instead of memory."
      },
      {
        id: "process-doc",
        title: "Document how I do it",
        when: "Use this when you are the only one who knows how something is done, and that keeps making it your job.",
        prompt: `You are helping me document a process I normally carry in my head, so a colleague can do it without me.

The process: [name it, for example "monthly invoicing" or "publishing a product update"]
Who will follow this document: [new colleague, my team, my cover when I am away]

How I do it, dumped from memory:
[write it as it comes: steps, tools, logins involved, weird exceptions, things that go wrong]

Do this:
1. Rewrite my dump as numbered steps in strict order, one action per step, each starting with a verb.
2. Note at each step which tool or place it happens in.
3. Pull the exceptions and warnings out of my text into a "watch out" note attached to the exact step where they bite.
4. List what the person needs before starting: access, files, permissions.
5. Ask me the questions that reveal what I forgot to mention. The steps I do automatically are exactly the ones missing from my dump.

Rules:
- Write for a smart person with zero context. Spell out what "the usual folder" actually is.
- No step may contain two actions.

End with the how-to, the checklist of prerequisites, then your questions for me.`,
        tip: "Have someone follow the document while you watch in silence. Where they stall, the document has a hole, not the person."
      },
      {
        id: "holiday-handover",
        title: "Write my holiday handover",
        when: "Use this when you leave in two days and everything you own lives in your head.",
        prompt: `You are writing my out of office handover so nothing burns while I am away and nobody calls me at the beach.

I am away: [dates]
Covering for me: [name or names, and what they already know about my work]

My running topics, dumped quickly:
[list everything live: projects and their state, who is involved, what happens on which date while you are gone, where the files live]

Do this:
1. Sort my topics into: needs action during my absence, needs watching, and waits for my return. Say which is which.
2. For each action item: what to do, when, with whom, and where the material lives.
3. Write an "if this happens, do that" list for the two or three most likely surprises, based on my dump.
4. Name what my cover should not decide without me, so the boundary is explicit.
5. Draft my out of office message: dates, who covers what, three lines.

Rules:
- If my dump contains a date landing during my absence with no plan attached, flag it loudly at the top.
- One screen. A handover nobody reads protects nobody.

Return: flagged risks first, then the handover, then the out of office message.`,
        tip: "Write it two days before you leave, not the last afternoon. The gaps it exposes usually need one more conversation to close."
      }
    ]
  },
  {
    id: "creators",
    chip: "Creators",
    name: "Content creators",
    blurb: [
      "Make more from what you already record. Repurpose, script, and publish faster.",
      "Without your feed starting to sound generated, because that is the fastest way to lose people."
    ],
    updated: UPDATED,
    prompts: [
      {
        id: "video-to-posts",
        title: "One video into a week",
        when: "Use this when you recorded one good video and want a week of posts out of it.",
        prompt: `You are repurposing my video into standalone posts, keeping my voice from the transcript itself.

The transcript:
[paste the full transcript here]

Where the posts go: [LinkedIn, Instagram captions, X, a newsletter]

Do this:
1. Pull out the five strongest distinct ideas from the transcript. Distinct means a person could disagree with each one separately.
2. Write one post per idea, under 80 words, in my voice: reuse my actual phrasings from the transcript where they are good.
3. Make the first line of each post work alone, since feeds cut the rest. No questions as bait, no "unpopular opinion".
4. One idea per post. If two ideas need each other, they are one post or none.
5. No hashtags, no emojis, no em dashes.

Rules:
- Do not add claims, numbers, or stories that are not in the transcript.
- If the transcript only carries three strong ideas, give me three and say so. Do not pad to five.

Number the posts. Under each, add one line naming the idea it carries, so I can schedule them across the week myself.`,
        tip: "The transcript line you almost cut for rambling is often the most human post of the five. Watch for it."
      },
      {
        id: "thirty-second-script",
        title: "Script a thirty second video",
        when: "Use this when you know the point you want to make and need it shaped for a short video.",
        prompt: `You are scripting a short vertical video, thirty seconds, one idea, in my voice.

The one point I want to make:
[state it plainly, for example "most people overpay for AI tools they use twice"]

Why I believe it, my material:
[your reasons, an example, a number you actually have]

My tone: [paste two or three lines you have said or written that sound like you]

Do this:
1. Hook, first line: state the point or the tension directly. No "wait for it", no "nobody talks about this".
2. Body, three or four short spoken sentences building the point, using only my material.
3. Payoff, last line: the practical takeaway a viewer can use today.
4. Write for the mouth, not the page: sentences I can say in one breath, natural rhythm, contractions welcome.
5. Add a timing estimate per section and one line describing what to show on screen at each step.

Rules:
- No invented statistics or examples. If my material is too thin for thirty seconds, tell me what is missing instead of filling it.
- No call to action begging for follows.

Return the script in three labeled blocks: hook, body, payoff.`,
        tip: "Read it out loud once before recording. Any sentence you stumble on twice gets rewritten by your mouth, and your mouth is always right."
      },
      {
        id: "honest-hooks",
        title: "Write hooks without clickbait",
        when: "Use this when you need a strong first line that the rest of the content can actually keep.",
        prompt: `You are writing opening hooks for a creator who refuses clickbait. The rule: the content must fully deliver whatever the hook promises.

The content, or an honest summary of it:
[paste the script, post, or a real summary]

The format: [short video, LinkedIn post, YouTube title, newsletter subject]

Do this:
1. Write eight hooks in different modes: the direct claim, the specific number or detail pulled from the content, the honest question I actually answer, the mistake I made myself, and the before and after stated plainly.
2. For each hook, add one line: what it promises, and where in the content that promise is kept.
3. Kill your own weak ones: mark any hook that overpromises even slightly, and say why.
4. Pick your top two for my format.

Rules:
- No curiosity gaps the content cannot close. No "you will not believe", no fake urgency.
- Specific beats dramatic. A real number from the content beats an adjective every time.
- Hooks must sound like speech, not ad copy.

Return: the eight hooks numbered, the kill list with reasons, then the top two with a one line case each.`,
        tip: "The test is simple: would someone who finishes the content feel the first line was fair? If not, the algorithm win costs you the trust everything else runs on."
      },
      {
        id: "transcript-to-article",
        title: "Clean my transcript into an article",
        when: "Use this when the video exists and the written version should too, without sounding like a robot transcribed it.",
        prompt: `You are turning my spoken transcript into a readable written piece, keeping my voice but respecting that writing is not speech.

The transcript:
[paste it as it comes, timestamps and filler included]

Where it will be published: [blog, newsletter, LinkedIn article]

Do this:
1. Remove the speech artifacts: filler words, false starts, repeated phrases, verbal tics.
2. Keep my phrasings, examples, and side comments that carry personality. The goal is my voice edited, never a generic article about the same topic.
3. Restructure where spoken order fails on the page: group wandering points, but keep my argument and my claims exactly.
4. Add subheadings every few paragraphs, written in my own words.
5. Where I referenced something visual, "as you can see here", flag it with [visual: describe or cut] for me to resolve.

Rules:
- Do not add an introduction or conclusion I did not speak. Trim to where the substance starts.
- Do not upgrade my vocabulary. If I said "cheap", it stays "cheap".

Return the article, then a short list of the [visual] flags and any claim that may need a source link.`,
        tip: "Publish the article a few days after the video and link both ways. Two formats from one thinking session, and each audience finds its own door."
      },
      {
        id: "caption-voice",
        title: "Captions in my voice",
        when: "Use this when the clip is ready and the caption is the only thing between you and posting.",
        prompt: `You are writing captions for my posts, in my voice, without hashtag confetti.

What the post or clip shows:
[describe it, or paste the script or the key quote from it]

My voice sample:
[paste two or three captions or messages you actually wrote]

Platform: [Instagram, LinkedIn, TikTok, X]

Do this:
1. Write three caption options: one short, a single line that lands; one medium, two to four sentences adding the context the clip cannot carry; and one that opens a genuine question I would actually want answers to.
2. Match my voice sample: my sentence length, my level of casualness, my kind of humor if any shows.
3. Make the first words carry, since the fold cuts early on every platform.
4. Hashtags: maximum three, only if they genuinely help discovery on this platform, placed at the end. None is a fine answer.

Rules:
- No emoji unless my voice sample uses them, and then match my actual frequency.
- No "double tap if", no "tag someone who", no engagement scripts of any kind.

Return the three options numbered, with a one line note on when each type works best.`,
        tip: "Keep a note file of your five best performing captions. That becomes the voice sample, and the options get noticeably closer to you."
      },
      {
        id: "idea-mining",
        title: "Mine real questions for ideas",
        when: "Use this when the content calendar is empty and you want ideas grounded in what your audience already asks.",
        prompt: `You are mining content ideas from real audience material, so I make content people asked for instead of content I assume they want.

The raw material:
[paste real comments, DMs, emails, client questions, search queries, community posts, anything your audience actually wrote]

What I make and for whom: [one line, for example "practical AI videos for non-technical business owners"]

Do this:
1. Extract every distinct question or pain hiding in the material, including the ones phrased as complaints or jokes.
2. Group them into themes and rank the themes by how often they appear in what I pasted, with the count shown.
3. For the top three themes, propose one concrete content idea each: a working title, the specific question it answers, and the one thing the viewer walks away able to do.
4. Mark which ideas I am uniquely placed to answer, and which ones would have me repeating everyone else, judging from what I told you I do.

Rules:
- Every idea must trace to a quote from the material. Include the quote.
- If the material is too thin for real patterns, say so, and tell me what to collect for two weeks.

End with a table: theme, count, idea title, source quote.`,
        tip: "The complaint phrased as a joke is often the strongest idea in the pile. People joke about what actually frustrates them."
      },
      {
        id: "content-week",
        title: "Plan a week from one idea",
        when: "Use this when one strong idea should become a week of connected content instead of one lonely post.",
        prompt: `You are planning one week of content from a single core idea, one angle per day, without repeating the same post five ways.

The core idea:
[state it, for example "AI gets you to 80 percent, the last 20 is the real work"]

My formats and platforms: [what you actually publish, for example "one video plus daily LinkedIn posts"]
My material: [experiences, examples, numbers you have that relate to the idea]

Do this:
1. Break the core idea into five distinct angles: the claim itself, a concrete story or example from my material, the common mistake, the how-to, and the honest limits of the idea.
2. For each day: the angle, the format that fits it best from my list, a first line, and a two or three sentence outline using only my material.
3. Order the week deliberately: claim first, proof early, how-to once trust is built.
4. Mark where the same asset can be reused across platforms with minor edits, to keep production sane for one person.

Rules:
- Five angles, not five rewrites. Each day must survive alone for someone who sees nothing else.
- Gaps in my material become questions to me, never invented stories.

Return a Monday to Friday table: angle, format, first line, outline.`,
        tip: "Batch the production in one sitting even though publishing is spread out. The week plan is really a two hour work session in disguise."
      },
      {
        id: "stats-truth",
        title: "Read my stats honestly",
        when: "Use this when the analytics are open and you want the truth about what worked, without vanity comfort.",
        prompt: `You are reading a creator's numbers like an honest analyst: what worked, what did not, and what the numbers cannot actually tell us.

My numbers for the period:
[paste your stats, per post or video if you have them: views, watch time, likes, comments, saves, follows, clicks, whatever your platform shows]

What I published in that period:
[list the pieces with a one line description each, matched to the stats if possible]

My actual goal: [reach, leads, email signups, sales, or "not sure"]

Do this:
1. Separate the metrics that serve my goal from the ones that just feel good, and say which is which for my case.
2. Name the best and worst performer against my goal, with the numbers, and what each had in common with other winners or losers in the data.
3. Say clearly what this sample cannot prove: small numbers, single posts, platform quirks. Mark every guess as a guess.
4. Give me one experiment for next period that tests the strongest pattern, with the number that will tell us if it worked.

Rules:
- No congratulations and no doom. Numbers, patterns, limits, one action.

End with five lines: what worked, what did not, what we cannot know yet, the experiment, and the metric to watch.`,
        tip: "Ten posts is a mood, not a dataset. Collect a month of numbers before you change strategy based on them."
      }
    ]
  },
  {
    id: "students",
    chip: "Students",
    name: "Students and learning",
    blurb: [
      "Learn faster and remember more. These make AI quiz you and question you.",
      "The thinking stays yours, which is the part that passes exams."
    ],
    updated: UPDATED,
    prompts: [
      {
        id: "twenty-minute-topic",
        title: "Learn a topic in twenty minutes",
        when: "Use this when you need to get genuinely useful on a new topic today, not expert by next year.",
        prompt: `You are teaching me a new topic in about twenty minutes of focused reading. I know nothing about it yet.

The topic: [name it]
Why I need it: [one line, for example "exam section", "job interview", "my project touches it"]

Do this:
1. Explain what it is and why anyone cares, in plain words, five sentences maximum.
2. Teach the core ideas as short sections, each with a heading, each building on the last. Everyday language, and every unavoidable technical term gets its plain meaning in brackets.
3. Give one concrete example per core idea, the kind I would recognise from normal life where possible.
4. Name the three mistakes beginners make with this topic.
5. Tell me honestly what I still will not understand after this session, and what to learn next if I need to go deeper.

Rules:
- Skip the history unless a piece of it explains the concept.
- Depth over coverage: the three most important ideas taught properly beat ten ideas mentioned.

End with a five question self test, with the answers listed separately after all the questions.`,
        tip: "Take the self test tomorrow morning, not right after reading. What survives the night is what you actually learned."
      },
      {
        id: "quiz-me",
        title: "Teach me with a quiz",
        when: "Use this when reading feels like learning but nothing sticks, and answering questions is what actually works.",
        prompt: `You are my quiz tutor. Teach me [topic] by asking, never by lecturing.

My level: [beginner, took one course, revising for an exam]
My material, if the quiz should follow it:
[paste lecture notes or a chapter summary, or write "use your general knowledge"]

Run it like this:
1. Ask one question at a time and wait for my answer.
2. After each answer: tell me right, close, or wrong, then explain in two sentences maximum, then ask the next question.
3. Start easy and raise the difficulty while I keep answering well.
4. When I get one wrong, explain it simply and circle back with a similar question a few turns later, without announcing it.
5. Mix question types: definitions, applications, spot the error, and explain why.

Rules:
- Never answer for me or drop hints before I commit to an answer.
- If I say "I do not know", teach that piece briefly, then quiz it again later.
- Base the questions on my pasted material when I provided it.

After fifteen questions, stop and give me a scorecard: what I know solidly, what is shaky, and the three things to revise first.`,
        tip: "Type your answer fully before sending, or say it out loud. The struggle to produce it is the part that makes it stick."
      },
      {
        id: "explain-back",
        title: "Check I actually understand",
        when: "Use this when you can follow the textbook but are not sure you could explain it without it.",
        prompt: `You are testing my understanding using the explain it back method. I explain, you probe.

The topic I claim to understand: [name it]
My explanation, as if to a smart friend from a different field:
[write your explanation from memory, book closed, imperfect is the point]

Do this:
1. Grade my explanation honestly: what I got right, what I got wrong, what I skipped.
2. Quote the exact sentences where I went vague or hid behind a term I did not unpack. The vague spots are usually where my understanding ends.
3. Ask me two follow up questions targeting my weakest spot, the kind an examiner would ask.
4. After my answers, give a corrected version of my explanation, keeping my wording where it was accurate and fixing only where I failed.

Rules:
- Do not be kind at the cost of being true. A soft grade now is a hard exam later.
- If my explanation is actually solid, say so, and raise the difficulty with one edge case instead.

End with a score out of ten and the one gap to close before moving on.`,
        tip: "If you cannot explain it with the book closed, you have recognition, not understanding. This prompt tells you which one you have."
      },
      {
        id: "reading-notes",
        title: "Turn a reading into study notes",
        when: "Use this when the reading is long, the time is short, and the notes need to be yours to study from.",
        prompt: `You are turning course reading into study notes I will revise from, grounded in the text I give you.

The reading:
[paste the chapter, paper, or article, in parts if it is long]

The course and what the teacher emphasises: [one line, or "unknown"]

Do this:
1. Extract the main claims and concepts as short notes, each tagged with where it sits in the text so I can find the full passage.
2. Keep definitions exact: quote the text's own wording for anything I might need to reproduce, marked as quotes.
3. Turn the text's examples into one line memory hooks tied to their concept.
4. Build a likely exam questions list: five questions this text sets up, judging from what it stresses and repeats.
5. Flag what the text assumes I already know, so I can patch gaps before they cost me.

Rules:
- Only what is in the text. No outside additions unless I ask. If a passage is ambiguous, note the ambiguity instead of resolving it silently.
- Notes format: compact, headed sections, scannable in five minutes.

End with the notes, the five questions, and the assumed knowledge list.`,
        tip: "Rewrite the five questions in your own words and try them in three days. Notes you never test are just a prettier version of the reading."
      },
      {
        id: "essay-outline",
        title: "Outline my essay, not write it",
        when: "Use this when the essay is due, the ideas are foggy, and you need structure while keeping the writing yours.",
        prompt: `You are my essay planning partner. You help me structure and sharpen my argument. You do not write the essay, because submitting your words as mine is a problem I do not want.

The assignment, exactly as given:
[paste the prompt or question]

My material so far:
[your thesis attempt, your points, sources or quotes you plan to use, even messy]

Do this:
1. Stress test my thesis: is it arguable, specific, and answering the actual assignment? If it is weak, show me two sharper versions built from my own material.
2. Arrange my points into an outline with a logical spine: each section's job in one line, and which of my sources or quotes belongs where.
3. Name the strongest counterargument to my thesis and where in the outline to face it.
4. List what is missing: claims I make with no support yet, so I know what to find before writing.

Rules:
- Use only my material and the assignment. Do not add arguments, sources, or quotes of your own.
- Everything stays in outline form. No flowing paragraphs I could paste.

End with the outline, the counterargument, and the missing support list.`,
        tip: "The counterargument section is where grades hide. Facing the best objection honestly reads as thinking, and teachers can tell."
      },
      {
        id: "flashcards",
        title: "Make flashcards from my notes",
        when: "Use this when the exam rewards recall and your notes need to become cards you can drill.",
        prompt: `You are turning my study notes into flashcards built for recall, ready for Anki or any card app.

My notes:
[paste your notes, messy is fine]

The exam format, if I know it: [multiple choice, written answers, oral, problem solving]

Do this:
1. Write cards as question on the front, answer on the back. One fact or idea per card, never two.
2. Phrase the fronts as real questions or fill in the blank lines, not as headings. "What limits X?" beats "X, limits of".
3. Keep answers short enough to check in two seconds: a term, a number, one sentence.
4. For each concept, add one application card: a tiny scenario asking which concept applies. Exams test use, and recognition alone will not carry me.
5. Skip what does not belong on cards: long derivations, essay themes, anything needing a full page. List those separately as "study differently".

Rules:
- My notes are the only source. Ambiguities in my notes become cards marked [verify], not confident answers.

Output format: front and back separated by a semicolon, one card per line, so I can import it. Then the "study differently" list.`,
        tip: `Cut any card you answer with "oh yeah, that one" instead of the actual answer. Familiarity is the enemy dressed as progress.`
      },
      {
        id: "exam-plan",
        title: "Plan my revision backwards",
        when: "Use this when the exam date is fixed and the honest question is what to do with the days that remain.",
        prompt: `You are building my revision plan backwards from exam day. Realistic beats heroic: a plan I follow at 80 percent beats a perfect one I abandon by Wednesday.

The exam: [subject, format, date]
Days left and real available hours per day: [be honest, after work, sport, life]
The material: [list the topics or paste the syllabus]
My current state per topic: [solid, shaky, untouched, best guess is fine]

Do this:
1. Rank the topics by expected exam weight combined with my weakness. Shaky and heavy tops the list, solid and light goes last.
2. Build the day by day plan: which topic, which method (recall practice, problems, rereading only where unavoidable), and how long.
3. Schedule spaced returns: every topic reappears for short recall at least twice before the exam.
4. Reserve the last day for light review and rest, and say why cramming that day costs more than it pays.
5. Include one contingency: what to cut first if I lose a day, so losing a day does not collapse the plan.

Rules:
- Do not schedule more hours than I declared. If the material does not fit, say what to sacrifice instead of inflating the days.

End with the plan as a table: day, topic, method, minutes.`,
        tip: "Recall practice feels worse and works better than rereading. If revision feels smooth and pleasant, you are probably just recognising things."
      },
      {
        id: "stuck-on-problem",
        title: "Walk me through, do not solve",
        when: "Use this when you are stuck on a problem and want to be taught through it, since a pasted solution teaches you nothing.",
        prompt: `You are my tutor for a problem I am stuck on. Guide me to solve it myself. Do not give me the solution, even if I ask when frustrated.

The problem, exactly as given:
[paste the problem or question]

Where I am stuck:
[show your work so far and say where it stops making sense, or write "cannot even start"]

Run it like this:
1. First, ask me what the problem is actually asking, in my own words. If I have that wrong, fix it before anything else. Half of stuck is misreading.
2. Give hints in levels: first a nudge about what to consider, then a sharper pointer, then the specific step. Each level comes only after I try the previous one.
3. When I make an error, point at where it is, not what it is, and let me find it.
4. When I get it, make me state the general method in one sentence, so this transfers past this one problem.

Rules:
- Never complete a calculation or step I have not attempted.
- If my foundations are missing, say which ones, teach the smallest missing piece, then return to the problem.

End every one of your turns with a question back to me, so the pencil stays in my hand.`,
        tip: "The urge to see the solution peaks right before the insight would have arrived. Sit with the first hint level longer than feels comfortable."
      }
    ]
  }
];

export const TOP10 = [
  "sort-my-day",
  "interview-me-first",
  "stress-test-answer",
  "sound-like-me",
  "remove-ai-flavor",
  "idea-to-spec",
  "brief-translator",
  "review-triage",
  "notes-to-email",
  "video-to-posts"
];
