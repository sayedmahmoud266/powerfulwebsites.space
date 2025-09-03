# Contributing to powerfulwebsites.space

First off, thank you for considering contributing to powerfulwebsites.space! 🎉

The following is a set of guidelines for contributing to this project. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Coding Guidelines](#coding-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and inclusive environment. By participating, you are expected to uphold this standard.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+ or yarn 1.22+
- Git
- Basic knowledge of Angular, TypeScript, and modern web development

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/powerfulwebsites.space.git
   cd powerfulwebsites.space
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp src/environments/environment.ts src/environments/environment.local.ts
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Verify setup**
   Open `http://localhost:4200` and ensure the application loads correctly.

## 🛠️ How to Contribute

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug fixes**
- ✨ **New features**
- 📚 **Documentation improvements**
- 🎨 **UI/UX enhancements**
- ♿ **Accessibility improvements**
- 🔧 **Performance optimizations**
- ✅ **Test additions**

### Before You Start

1. **Check existing issues** to see if your contribution is already being worked on
2. **Open an issue** to discuss major changes before implementing
3. **Search for existing pull requests** to avoid duplicate work

## 🔄 Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**
   - Follow our coding guidelines
   - Write/update tests as needed
   - Update documentation if required

3. **Test your changes**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**

## 📝 Coding Guidelines

### Angular/TypeScript Guidelines

- **Use standalone components** instead of NgModules
- **Use Angular Signals** for state management
- **Follow Angular v20+ best practices**
- **Use `input()` and `output()` functions** instead of decorators
- **Implement OnPush change detection** for performance
- **Use the `inject()` function** instead of constructor injection

### Code Style

- **TypeScript**: Use strict typing, avoid `any`
- **Components**: Keep them small and focused
- **Services**: Design around single responsibility
- **Templates**: Use modern control flow (`@if`, `@for`, `@switch`)
- **Styling**: Use Tailwind CSS classes, avoid custom CSS when possible

### File Organization

```
src/app/
├── core/
│   └── services/          # Core business logic
├── features/
│   ├── feature-name/      # Feature modules
│   │   ├── components/    # Feature-specific components
│   │   └── services/      # Feature-specific services
├── shared/
│   ├── components/        # Reusable components
│   ├── models/           # TypeScript interfaces
│   └── utils/            # Utility functions
```

### Naming Conventions

- **Files**: `kebab-case.component.ts`
- **Classes**: `PascalCase`
- **Variables/Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Components**: `ComponentName` (without "Component" suffix in class name)

## 📜 Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```bash
feat: add website search functionality
fix: resolve mobile navigation menu issue
docs: update installation instructions
style: improve button hover states
refactor: simplify website card component
test: add unit tests for search service
chore: update dependencies
```

## 🔄 Pull Request Process

1. **Ensure your PR has a clear title and description**
2. **Reference any related issues** using `Fixes #123` or `Closes #123`
3. **Include screenshots** for UI changes
4. **Ensure all tests pass**
5. **Update documentation** if needed
6. **Request review** from maintainers

### PR Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] Accessibility tested

## Screenshots (if applicable)
[Add screenshots here]

## Related Issues
Fixes #123
```

## 🐛 Bug Reports

When filing a bug report, please include:

1. **Clear title** and description
2. **Steps to reproduce** the issue
3. **Expected vs actual behavior**
4. **Environment details** (OS, browser, versions)
5. **Screenshots or videos** if applicable
6. **Error messages** or console logs

### Bug Report Template

```markdown
**Describe the bug**
A clear description of the bug

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Environment:**
- OS: [e.g. Windows 10, macOS 12]
- Browser: [e.g. Chrome 95, Firefox 93]
- Version: [e.g. v1.0.0]

**Additional context**
Any other relevant information
```

## 💡 Feature Requests

For feature requests, please:

1. **Check existing feature requests** first
2. **Provide clear use case** and motivation
3. **Describe the proposed solution**
4. **Consider alternative solutions**
5. **Discuss implementation complexity**

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem

**Describe the solution you'd like**
Clear description of the desired feature

**Describe alternatives you've considered**
Alternative solutions or features

**Additional context**
Any other relevant information
```

## 🧪 Testing Guidelines

### Unit Tests
- Write tests for new features and bug fixes
- Aim for meaningful test coverage
- Use descriptive test names
- Mock external dependencies

### E2E Tests
- Add E2E tests for critical user flows
- Test responsive behavior
- Verify accessibility features

### Manual Testing
- Test across different browsers
- Verify mobile responsiveness
- Check accessibility with screen readers
- Test with keyboard navigation

## 📋 Review Process

1. **All PRs require review** from at least one maintainer
2. **Address review feedback** promptly
3. **Keep PRs focused** and reasonably sized
4. **Rebase and squash commits** if requested

## 🆘 Getting Help

If you need help:

1. **Check the documentation** first
2. **Search existing issues** for similar problems
3. **Join our discussions** in GitHub Discussions
4. **Ask questions** in issues with the `question` label

## 📞 Contact

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Email**: [contact information if applicable]

---

Thank you for contributing to powerfulwebsites.space! 🚀✨
