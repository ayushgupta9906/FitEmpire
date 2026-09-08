# Contributing to FitEmpire

Thank you for your interest in contributing to FitEmpire! Follow these guidelines to ensure smooth collaboration.

## Development Workflow
1. **Branch Naming**:
   - Features: `feat/<feature-name>`
   - Bug Fixes: `fix/<issue-id>-<description>`
   - Documentation: `docs/<topic>`
2. **Commit Conventions**:
   Follow Conventional Commits format:
   ```
   feat(module): brief description
   fix(security): resolve CVE or issue (fixes #123)
   ```
3. **Local Testing**:
   - Backend: `mvn clean test-compile`
   - Partner Portal: `npm run build`
   - Mobile: `npx expo start`

## Code Review Process
All pull requests require at least one code review and automated CI checks passing prior to merging.
