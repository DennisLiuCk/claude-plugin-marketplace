# CLAUDE.md - AI Assistant Guide for Claude Plugin Marketplace (繁體中文)

## Repository Overview

This repository is the **Claude Code Traditional Chinese Plugin Marketplace** (claude-plugin-marketplace), a community-maintained collection of Claude Code plugins translated into Traditional Chinese. It is based on Anthropic's official [claude-code](https://github.com/anthropics/claude-code) repository, providing localized versions of gold-standard plugins to help Traditional Chinese speakers learn and use Claude Code more effectively.

**Key Information:**
- **Purpose**: Provide Traditional Chinese versions of Claude Code plugins
- **Owner**: Dennis Liu
- **Base**: Anthropic official plugins (translated)
- **Language**: Traditional Chinese (繁體中文)
- **Version**: 1.0.0
- **Total Plugins**: 12 plugins across 4 categories

## Repository Structure

```
claude-plugin-marketplace/
├── .claude-plugin/
│   └── marketplace.json          # Marketplace configuration file
├── plugins/                       # Main plugins directory
│   ├── README.md                 # Plugins overview
│   │
│   ├── [plugin-name]/            # Each plugin follows this structure:
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json       # Plugin metadata
│   │   ├── README.md             # Plugin documentation (Traditional Chinese)
│   │   ├── commands/             # Slash commands (optional)
│   │   │   └── *.md             # Command definitions
│   │   ├── agents/               # Agent definitions (optional)
│   │   │   └── *.md             # Agent prompts and configurations
│   │   ├── hooks/                # Hooks system (optional)
│   │   │   ├── hooks.json       # Hook configuration
│   │   │   └── *.py or *.sh     # Hook handlers
│   │   ├── skills/               # Skills (optional)
│   │   │   └── [skill-name]/
│   │   │       └── SKILL.md     # Skill definition
│   │   ├── core/                 # Core logic (for complex plugins)
│   │   ├── utils/                # Utilities
│   │   └── examples/             # Usage examples
│   │
│   ├── agent-sdk-dev/            # Development: Agent SDK toolkit
│   ├── code-review/              # Productivity: Code review automation
│   ├── commit-commands/          # Productivity: Git workflow commands
│   ├── explanatory-output-style/ # Learning: Educational insights
│   ├── feature-dev/              # Development: Feature development workflow
│   ├── frontend-design/          # Development: Frontend design guidance
│   ├── hookify/                  # Productivity: Custom hook creator
│   ├── learning-output-style/    # Learning: Interactive learning mode
│   ├── plugin-dev/               # Development: Plugin development toolkit
│   ├── pr-review-toolkit/        # Productivity: PR review agents
│   ├── ralph-wiggum/             # Development: Iterative development loop
│   └── security-guidance/        # Security: Security warnings hook
│
├── README.md                      # Main repository documentation
└── CLAUDE.md                      # This file - AI assistant guide
```

## Plugin Categories and Inventory

### Development Tools (5 plugins)
1. **agent-sdk-dev**: Claude Agent SDK development toolkit for Python and TypeScript
2. **feature-dev**: Seven-stage feature development workflow with specialized agents
3. **frontend-design**: Production-grade frontend interface design guidance
4. **ralph-wiggum**: Interactive self-referential AI loop for iterative development
5. **plugin-dev**: Comprehensive Claude Code plugin development toolkit

### Productivity Tools (4 plugins)
1. **pr-review-toolkit**: Comprehensive PR review agents for code quality
2. **commit-commands**: Simplified Git workflow commands
3. **code-review**: Automated code review with confidence-based scoring
4. **hookify**: Custom hook creator for preventing unwanted behaviors

### Security Tools (1 plugin)
1. **security-guidance**: Security reminder hook for file edits

### Learning Tools (2 plugins)
1. **explanatory-output-style**: Educational insights about implementation choices
2. **learning-output-style**: Interactive learning mode with code contributions

## Plugin Component Types

### 1. Commands (`commands/*.md`)

Commands are slash commands that users can invoke in Claude Code.

**Structure:**
```markdown
---
description: Command description in Traditional Chinese
allowedTools:
  - 'Bash(git add:*)'
  - 'Glob(*.js:*)'
---

# Command prompt content in Traditional Chinese
```

**Key Points:**
- Files are markdown with YAML frontmatter
- `description`: User-facing description
- `allowedTools`: Restricts which tools the command can use
- Can use template variables: `${GIT_STATUS}`, `${GIT_BRANCH}`, etc.

**Example**: `plugins/commit-commands/commands/commit.md`

### 2. Agents (`agents/*.md`)

Agents are specialized AI assistants with specific capabilities and tools.

**Structure:**
```markdown
---
name: agent-name
description: |
  Agent description in Traditional Chinese

  Usage examples:
  - "Example use case 1"
  - "Example use case 2"
model: sonnet|opus|haiku
color: yellow|blue|purple|green|red
tools:
  - Glob
  - Grep
  - Read
  - Bash
  - TodoWrite
---

# Agent system prompt in Traditional Chinese
```

**Key Points:**
- `name`: Agent identifier (lowercase with hyphens)
- `description`: Detailed description including usage examples
- `model`: Model to use (sonnet, opus, haiku)
- `color`: Visual identifier for agent output
- `tools`: List of allowed tools for the agent
- Prompt should define agent's expertise and methodology

**Example**: `plugins/feature-dev/agents/code-explorer.md`

### 3. Hooks (`hooks/hooks.json` + handlers)

Hooks intercept Claude Code events to enforce rules or provide guidance.

**hooks.json Structure:**
```json
{
  "description": "Hook description",
  "preToolUse": {
    "matcher": "Edit|Write|MultiEdit",
    "command": "python3 ${CLAUDE_PLUGIN_ROOT}/hooks/script.py"
  },
  "postToolUse": { ... },
  "sessionStart": { ... },
  "userPromptSubmit": { ... }
}
```

**Hook Types:**
- `preToolUse`: Before tool execution
- `postToolUse`: After tool execution
- `sessionStart`: At session start
- `userPromptSubmit`: When user submits prompt
- `stop`: Block actions entirely

**Key Points:**
- Handlers can be Python scripts, shell scripts, or any executable
- Use `${CLAUDE_PLUGIN_ROOT}` to reference plugin directory
- Matchers filter which tools trigger the hook
- Handlers receive context via stdin (JSON)

**Example**: `plugins/security-guidance/hooks/`

### 4. Skills (`skills/[skill-name]/SKILL.md`)

Skills are specialized capabilities that can be invoked by name.

**Structure:**
```markdown
---
name: skill-name
description: Skill description in Traditional Chinese
---

# Skill prompt and instructions in Traditional Chinese
```

**Example**: `plugins/frontend-design/skills/frontend-design/SKILL.md`

### 5. Plugin Metadata (`.claude-plugin/plugin.json`)

Every plugin has metadata defining its identity.

**Structure:**
```json
{
  "name": "plugin-name",
  "description": "Plugin description in Traditional Chinese",
  "version": "1.0.0",
  "author": {
    "name": "Author Name (繁體中文版)",
    "email": "email@example.com"
  }
}
```

## Translation Standards and Conventions

When working with this repository, maintain these translation standards:

### 1. Language Usage
- **Primary Language**: Traditional Chinese (繁體中文)
- **Code & Technical Terms**: Keep English technical terms where appropriate
- **URLs & Paths**: Never translate
- **Command Names**: Keep original English names

### 2. Translation Guidelines

**DO:**
- Use natural Traditional Chinese expressions
- Maintain technical accuracy
- Preserve all markdown formatting
- Keep code blocks unchanged
- Preserve file paths, URLs, and technical identifiers
- Use consistent terminology across all plugins

**DON'T:**
- Use emojis (unless explicitly in original)
- Over-translate technical terms that are commonly used in English
- Change command names or file structure
- Modify code examples
- Alter YAML frontmatter keys (only translate values)

### 3. Common Term Translations

| English | 繁體中文 |
|---------|---------|
| Plugin | 插件 |
| Command | 命令 |
| Agent | 代理 |
| Hook | 鉤子 |
| Skill | 技能 |
| Workflow | 工作流程 |
| Code Review | 程式碼審查 |
| Pull Request | Pull Request (不翻譯) |
| Commit | 提交 |
| Branch | 分支 |
| Repository | 儲存庫 |
| Codebase | 程式碼庫 |

## Development Workflow

### Working with Plugins

#### 1. Reading Plugin Structure
When asked to analyze or work with a plugin:
```bash
# View plugin structure
ls -la /home/user/claude-plugin-marketplace/plugins/[plugin-name]/

# Read plugin metadata
cat /home/user/claude-plugin-marketplace/plugins/[plugin-name]/.claude-plugin/plugin.json

# Read main documentation
cat /home/user/claude-plugin-marketplace/plugins/[plugin-name]/README.md
```

#### 2. Creating New Plugin
Follow this checklist:
1. Create plugin directory: `plugins/[new-plugin-name]/`
2. Create `.claude-plugin/plugin.json` with metadata
3. Create `README.md` with full documentation
4. Add plugin components (commands, agents, hooks, skills)
5. Update marketplace.json with plugin entry
6. Update main README.md with plugin description

#### 3. Modifying Existing Plugin
1. Read current implementation first
2. Understand the plugin's purpose and structure
3. Make changes while preserving:
   - File structure
   - Naming conventions
   - Translation quality
4. Update version in plugin.json if significant
5. Update README.md if functionality changes

#### 4. Testing Plugins
While direct testing may not be available:
1. Verify JSON syntax in all `.json` files
2. Check markdown formatting in `.md` files
3. Ensure YAML frontmatter is valid
4. Verify file paths in hook commands
5. Check that all referenced files exist

### Git Workflow

#### Branch Naming
- Development branches MUST start with `claude/`
- Development branches MUST end with session ID
- Format: `claude/description-sessionid`
- Example: `claude/claude-md-mi9363yvo0j36s23-01TuzL7w6yZyCGTX1xdYTTM8`

#### Commit Messages
- Write in Traditional Chinese or English
- Follow conventional commits format when possible
- Be descriptive and specific
- Example: "新增 CLAUDE.md 檔案，包含完整的 AI 助手指南"
- Example: "更新 feature-dev 插件文件"

#### Push Operations
```bash
# Always use -u flag for first push
git push -u origin claude/branch-name

# If push fails due to network, retry with exponential backoff
# Retry sequence: 2s, 4s, 8s, 16s (up to 4 retries)
```

## Common Tasks for AI Assistants

### Task 1: Analyze Repository Structure
```bash
# Get overview
ls -la /home/user/claude-plugin-marketplace/

# List all plugins
ls -la /home/user/claude-plugin-marketplace/plugins/

# View marketplace configuration
cat /home/user/claude-plugin-marketplace/.claude-plugin/marketplace.json
```

### Task 2: Examine a Specific Plugin
```bash
# View plugin structure
ls -la /home/user/claude-plugin-marketplace/plugins/feature-dev/

# Read plugin documentation
cat /home/user/claude-plugin-marketplace/plugins/feature-dev/README.md

# Check for commands
ls /home/user/claude-plugin-marketplace/plugins/feature-dev/commands/

# Check for agents
ls /home/user/claude-plugin-marketplace/plugins/feature-dev/agents/
```

### Task 3: Find Specific Content
```bash
# Find all command files
find /home/user/claude-plugin-marketplace/plugins -name "*.md" -path "*/commands/*"

# Find all agent files
find /home/user/claude-plugin-marketplace/plugins -name "*.md" -path "*/agents/*"

# Find all hook configurations
find /home/user/claude-plugin-marketplace/plugins -name "hooks.json"

# Search for specific term
grep -r "程式碼審查" /home/user/claude-plugin-marketplace/plugins/
```

### Task 4: Validate Plugin Structure
For a plugin at `plugins/[name]/`:
1. Check required files exist:
   - `.claude-plugin/plugin.json`
   - `README.md`
2. Verify plugin.json has required fields:
   - `name`, `description`, `version`, `author`
3. Check marketplace.json includes the plugin
4. Verify all referenced files exist

### Task 5: Update Documentation
When updating README files:
1. Read existing content first
2. Preserve structure and formatting
3. Maintain Traditional Chinese language
4. Keep technical terms consistent
5. Update version/date if applicable

## Best Practices for AI Assistants

### 1. Always Read Before Writing
- Use Read tool before Edit or Write
- Understand existing structure and conventions
- Preserve formatting and style

### 2. Maintain Consistency
- Follow existing patterns in the repository
- Use consistent terminology across files
- Match the tone and style of existing documentation

### 3. Respect File Structure
- Don't create unnecessary files
- Follow established directory patterns
- Keep plugins self-contained

### 4. Validate Your Work
- Check JSON syntax
- Verify YAML frontmatter
- Ensure file paths are correct
- Test markdown rendering mentally

### 5. Use Tools Efficiently
- Use Glob to find files by pattern
- Use Grep to search content
- Use Read for file examination
- Use Bash only for necessary system operations

### 6. Track Complex Work
- Use TodoWrite for multi-step tasks
- Break down complex operations
- Mark todos as completed promptly

### 7. Provide Context
- Include file paths when referencing code
- Use format: `file/path.ext:line_number`
- Example: "定義在 plugins/feature-dev/agents/code-explorer.md:45"

## Plugin Development Guidelines

### Creating Commands
1. Define clear, specific descriptions
2. Limit allowedTools to necessary tools only
3. Use template variables when available
4. Write concise, actionable prompts
5. Include usage examples in comments

### Creating Agents
1. Choose appropriate model (sonnet for most cases)
2. Define specific expertise and methodology
3. Provide clear usage examples in description
4. List only necessary tools
5. Include structured output format in prompt

### Creating Hooks
1. Choose the right hook type for the use case
2. Write efficient matchers (specific tool names)
3. Handle stdin/stdout correctly
4. Return appropriate status codes
5. Provide helpful user messages

### Creating Skills
1. Define narrow, specific capabilities
2. Write clear activation criteria
3. Provide structured approach
4. Include examples in the prompt

## Troubleshooting Common Issues

### Plugin Not Loading
- Check plugin.json syntax
- Verify plugin is listed in marketplace.json
- Ensure all required fields are present

### Command Not Working
- Verify YAML frontmatter syntax
- Check allowedTools list
- Ensure command file is in commands/ directory
- Validate markdown formatting

### Agent Not Triggering
- Check description includes usage examples
- Verify agent file is in agents/ directory
- Ensure frontmatter is valid
- Check tools list includes necessary tools

### Hook Not Executing
- Verify hooks.json syntax
- Check matcher pattern
- Ensure handler file is executable
- Validate file paths with ${CLAUDE_PLUGIN_ROOT}

## Technical Considerations

### File Encoding
- All files MUST be UTF-8 encoded
- Traditional Chinese characters require UTF-8

### Line Endings
- Use LF (Unix-style) line endings
- Not CRLF (Windows-style)

### JSON Formatting
- Use 2-space indentation
- No trailing commas
- Validate with JSON parser

### Markdown Formatting
- Use GitHub-flavored markdown
- Code blocks with language hints
- Consistent heading hierarchy

## Resources and References

### Official Documentation
- [Claude Code Docs](https://docs.claude.com/en/docs/claude-code)
- [Claude Code Plugins](https://docs.claude.com/en/docs/claude-code/plugins)
- [Claude Agent SDK](https://docs.claude.com/en/api/agent-sdk/overview)

### Repository References
- [Original Anthropic Repository](https://github.com/anthropics/claude-code)
- [This Repository](https://github.com/DennisLiuCk/claude-plugin-marketplace)

### Related Projects
- Claude Code CLI tool
- Claude Agent SDK
- MCP (Model Context Protocol)

## Summary for AI Assistants

When working with this repository:

1. **This is a translation project** - Maintain Traditional Chinese quality
2. **Follow existing patterns** - Consistency is critical
3. **Read before modifying** - Understand context first
4. **Validate your work** - Check syntax and structure
5. **Use appropriate tools** - Glob, Grep, Read, Edit, Write
6. **Track complex tasks** - Use TodoWrite for multi-step work
7. **Provide clear references** - Include file paths and line numbers
8. **Respect the structure** - Don't create unnecessary files
9. **Test mentally** - Verify JSON, YAML, and markdown
10. **Ask when uncertain** - Clarify requirements before proceeding

This repository serves the Traditional Chinese Claude Code community. Quality, accuracy, and consistency are paramount.
