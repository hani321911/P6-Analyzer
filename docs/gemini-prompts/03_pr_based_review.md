# 🔄 Gemini Code Assist — PR-Based Continuous Review

> **For**: Gemini Code Assist GitHub App (auto-reviews PRs)
> **Setup**: Already activated in repo

---

## 📋 Available Commands in PRs

Once Gemini Code Assist is activated, you can use these in PR comments:

### `/gemini review`
Triggers a fresh code review of the PR.

**Use when**: You want a manual re-review after pushing changes.

### `/gemini summary`
Generates a summary of the PR changes.

**Use when**: You need a quick overview of what changed.

### `/gemini help`
Shows all available commands.

### `@gemini-code-assist [your question]`
Asks Gemini a specific question with PR context.

**Examples**:
- `@gemini-code-assist Is this aria-label appropriate for Arabic context?`
- `@gemini-code-assist Does this comply with WCAG 2.1?`
- `@gemini-code-assist Should I use useMemo here?`

---

## 🎯 PR Workflow Examples

### Example 1: Reviewing v29.0.11.1 (Latest)

Since v29.0.11.1 is already merged to main, create a "review PR" to trigger Gemini:

```bash
# Create branch from latest main
git checkout main
git pull origin main
git checkout -b review/gemini-v29.0.11.1

# Make a tiny meaningful change (e.g., add review timestamp)
echo "
## 📋 Latest Release
- **v29.0.11.1** (2026-05-06): Round 7 Hotfix
- 104/104 functional tests passing
- See [CHANGELOG.md](CHANGELOG.md) for details" >> README.md

git add README.md
git commit -m "docs: trigger Gemini review for v29.0.11.1"
git push -u origin review/gemini-v29.0.11.1
```

Then create PR:
- Title: `[REVIEW] Comprehensive review of v29.0.11.1`
- Body:
```markdown
## Purpose

Trigger Gemini Code Assist review of the entire v29.0.11.1 codebase.

## Review Scope

While this PR only changes README.md, please review the entire repository at this commit.

## Required reading
- .gemini/config.yaml
- .gemini/styleguide.md
- CLAUDE.md
- docs/architecture/NG_SA_CONTEXT.md
- docs/implementation/LESSONS_LEARNED.md

## Specific focus

1. NG SA compliance (6 certificates)
2. PMI EVM standards
3. Saudi Hijri calendar
4. Accessibility (current state: 0%)
5. Performance optimizations

/gemini review
```

The trailing `/gemini review` will trigger immediate review.

---

### Example 2: Reviewing UI/UX Proposal

```bash
git checkout main
git checkout -b review/uiux-proposal

# Add a comment to the proposal asking for review
echo "
> **Status**: Awaiting Gemini review (Round 8)
> **Date requested**: $(date -u +%Y-%m-%d)" >> docs/design-proposals/UI_UX_REVIEW_v29.0.11.1.md

git add docs/design-proposals/UI_UX_REVIEW_v29.0.11.1.md
git commit -m "docs: request Gemini review of UI/UX proposal"
git push -u origin review/uiux-proposal
```

PR description:
```markdown
## Purpose

Request Gemini's review of the UI/UX improvement proposal.

## Review focus

Please review: docs/design-proposals/UI_UX_REVIEW_v29.0.11.1.md

Verify:
1. Are the claims accurate? (315 colors, 0% a11y, 2 useMemo)
2. Are the recommendations correct?
3. What's missing?
4. What are the risks?

/gemini review
```

---

### Example 3: Reviewing Phase A1 Implementation (Future)

When you implement Phase A1 (accessibility):

```bash
git checkout -b feature/phase-a1-accessibility

# Make accessibility changes
# ... edit p6-analyzer.html to add aria-labels ...

git add p6-analyzer.html
git commit -m "feat(a11y): Phase A1 — add aria-labels to interactive elements"
git push -u origin feature/phase-a1-accessibility
```

PR with `/gemini review` in body → Gemini auto-reviews accessibility.

---

## 🔄 Continuous Review Workflow

For best results, use this pattern:

```
Branch creation → Code change → Push → PR → Gemini auto-reviews
                                          ↓
                                  Claude.ai reads
                                          ↓
                                  Implements feedback
                                          ↓
                                  Push to same branch
                                          ↓
                                  /gemini review (manual re-review)
                                          ↓
                                       Merge
```

---

## 🎁 Pro Tips

### Tip 1: Use Specific Questions
```
@gemini-code-assist Looking at line 7268, is the getActualPctRatio fallback chain order correct for NG SA projects?
```

### Tip 2: Reference Other Reviews
```
@gemini-code-assist ChatGPT in Round 7 found bug R1. Did I fix it correctly in this PR?
```

### Tip 3: Ask for Alternatives
```
@gemini-code-assist Are there alternative approaches to my useMemo refactoring in this PR?
```

### Tip 4: Verify Claims
```
@gemini-code-assist The PR description claims 28 new tests. Can you verify they actually test new functionality and not just re-test old code?
```

---

## 🚨 What Gemini Cannot Do

- ❌ Modify code directly (read-only access)
- ❌ Merge PRs (you control merging)
- ❌ Access private dependencies
- ❌ Run tests (suggests, doesn't execute)
- ❌ Review code outside the PR diff (use Web App for that)

---

## 📚 References

- Gemini Code Assist docs: https://developers.google.com/gemini-code-assist
- Available commands: https://github.com/marketplace/gemini-code-assist
- Configuration: `.gemini/config.yaml`
- Style guide: `.gemini/styleguide.md`
