# Contributing to NuroApp

## Git Workflow

We use a **trunk-based development** approach with short-lived feature branches.

### Branch naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feat/<slug>` | `feat/streaming-cards` |
| Bug fix | `fix/<slug>` | `fix/pdf-parse-crash` |
| AI / prompt work | `ai/<slug>` | `ai/card-prompt-v2` |
| Chore / tooling | `chore/<slug>` | `chore/update-deps` |
| Claude agent | `claude/<id>` | `claude/fix-file-opening-4XNgf` |

### Commit messages (Conventional Commits)

```
<type>(<scope>): <short summary>

[optional body — wrap at 72 chars]
[optional footer: BREAKING CHANGE / closes #123]
```

**Types**: `feat` · `fix` · `docs` · `style` · `refactor` · `perf` · `test` · `chore`

Examples:
```
feat(ai): wire Claude card generation with mock fallback
fix(pipeline): handle empty source list without crash
chore(deps): upgrade to @anthropic-ai/sdk 0.52
```

### Day-to-day flow

```bash
# 1. Start from an up-to-date main
git checkout main && git pull origin main

# 2. Create your branch
git checkout -b feat/my-feature

# 3. Make atomic, focused commits
git add src/services/ai/claudeClient.js
git commit -m "feat(ai): add streaming text helper"

# 4. Push early and often
git push -u origin feat/my-feature

# 5. Open a pull request → CI must be green before merge
# 6. Squash-merge into main; delete the branch
```

### Pull request checklist

- [ ] `npm run lint` passes locally
- [ ] `npm run build` succeeds with `VITE_USE_REAL_AI=false`
- [ ] New AI prompts include a `prompts.js` entry (no inline strings)
- [ ] Env vars are documented in `.env.example`
- [ ] No secrets, API keys, or `.env` files committed

## Environment setup

```bash
cp .env.example .env
# Fill in VITE_ANTHROPIC_API_KEY to enable real AI
npm install
npm run dev
```

Set `VITE_USE_REAL_AI=false` (default) to run the app in demo/mock mode without an API key.

## Project structure

```
src/
├── components/
│   ├── common/      # Shared utilities (ErrorBoundary)
│   ├── layout/      # PageShell, Sidebar, TopBar
│   ├── ui/          # Base design-system components
│   ├── cards/       # Study card components
│   ├── analysis/    # Pipeline result panels
│   ├── import/      # File upload components
│   └── study/       # Study mode components
├── constants/       # Enums and magic-string-free constants
├── context/         # AppContext, reducer, action types
├── hooks/           # Custom React hooks
├── services/
│   ├── ai/          # claudeClient + prompt templates
│   └── pipeline/    # 8-step analysis pipeline
├── views/           # Route-level page components
└── data/            # Mock data (demo mode)
```

## AI development guide

All LLM calls must go through `src/services/ai/claudeClient.js`.
All prompt strings must live in `src/services/ai/prompts.js`.

To add a new AI feature:
1. Add a `build<Feature>SystemPrompt()` and `build<Feature>UserPrompt()` to `prompts.js`.
2. Call `generateJSON()` or `generateText()` from `claudeClient.js` in the relevant service.
3. Always provide a mock fallback so the feature works with `VITE_USE_REAL_AI=false`.
