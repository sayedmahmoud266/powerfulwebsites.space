#!/bin/zsh

# Exit on error
set -e

# 1. Ensure no uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
  echo "Error: You have uncommitted changes. Please commit or stash them first."
  exit 1
fi

# 2. Ensure current branch is main
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$current_branch" != "main" ]]; then
  echo "Error: You are not on the main branch. Current branch: $current_branch"
  exit 1
fi

# 3. Read current version from package.json
current_version=$(jq -r .version package.json)
echo "Current version: $current_version"

# 4. Bump version (default: patch)
release_type=${1:-patch}
echo "Bumping $release_type version..."
npm version $release_type --no-git-tag-version
new_version=$(jq -r .version package.json)
echo "New version: $new_version"

# 5. Commit all updated files
if [[ -n $(git status --porcelain) ]]; then
  git add -u
  git commit -m "chore: bump version to $new_version"
fi

# 6. Create tag
version_tag="v$new_version"
git tag $version_tag

echo "Created tag: $version_tag"

# 7. Push everything to remote (including tags)
git push origin main
git push origin $version_tag

echo "Release complete!"
