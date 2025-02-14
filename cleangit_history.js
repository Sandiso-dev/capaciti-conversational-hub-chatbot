import simpleGit from 'simple-git';

const git = simpleGit();

// Path to the file containing secrets (e.g., .env)
const secretFile = '.env';

async function cleanGitHistory() {
  try {
    // 1. Check the current status of the repository
    console.log('Checking git status...');
    await git.status();

    // 2. Start interactive rebase to clean up sensitive data from commit history
    console.log('Starting interactive rebase...');
    await git.rebase(['--interactive', 'HEAD~5']); // Adjust to the number of commits to go back

    // 3. You can modify your commits here, remove sensitive data, or rewrite history.
    // Use `git filter-repo` or similar tool for complex tasks if needed.

    console.log('Rebase successful! Now cleaning sensitive files...');
    await git.add(secretFile);
    await git.commit('Remove sensitive API key from the .env file');
    
    // 4. Push changes after cleanup
    console.log('Pushing cleaned commits...');
    await git.push('origin', 'main', { '--force': null });

    console.log('History cleaned and pushed!');
  } catch (error) {
    console.error('Error during git history cleanup:', error);
  }
}

// Run the cleaning function
cleanGitHistory();
