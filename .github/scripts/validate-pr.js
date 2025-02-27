const { Anthropic } = require("@anthropic-ai/sdk");
const { getOctokit } = require("@actions/github");
const path = require("path");
const fs = require("fs");

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const octokit = getOctokit(process.env.GITHUB_TOKEN);

async function validatePR() {
  try {
    console.log("Loading event file from:", process.env.GITHUB_EVENT_PATH);
    const eventPath = path.resolve(process.env.GITHUB_EVENT_PATH);
    const event = require(eventPath);
    console.log("Event loaded:", JSON.stringify(event, null, 2));

    // Load validation config
    const configPath = path.resolve(".github/pr-validator-config.json");
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    console.log("Loaded validation config");

    const prNumber = event.number;
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

    console.log(`Validating PR #${prNumber} in ${owner}/${repo}`);

    // Get PR details
    const { data: pr } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
    });

    // Get PR diff
    const { data: files } = await octokit.rest.pulls.listFiles({
      owner,
      repo,
      pull_number: prNumber,
    });

    console.log("Files changed:", files.map((f) => f.filename).join(", "));

    const prompt = `
      Please review this PR with the following criteria:

      Code Organization Rules:
      ${config.codeOrganization.rules.map((rule) => `- ${rule}`).join("\n")}
      Valid component paths: ${config.codeOrganization.componentPaths.join(
        ", "
      )}

      Documentation Requirements:
      ${config.documentation.rules.map((rule) => `- ${rule}`).join("\n")}
      Required files: ${config.documentation.requiredFiles.join(", ")}

      Testing Requirements:
      ${config.testing.rules.map((rule) => `- ${rule}`).join("\n")}

      Commit Message Format:
      ${config.commitMessage.format}
      Valid types: ${config.commitMessage.types.join(", ")}

      PR Title: ${pr.title}
      PR Description: ${pr.body || "No description provided"}

      Changed files:
      ${files.map((file) => `${file.filename}:\n${file.patch}`).join("\n\n")}

      Please provide a detailed review focusing on these criteria. For each issue found, 
      explain why it's an issue and how to fix it. Format your response with clear sections 
      for each category of issues found.
    `.trim();

    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 4096,
      messages: [
        {
          role: "system",
          content:
            "You are a strict code reviewer that validates PRs based on specific criteria. Provide clear, actionable feedback and always check all criteria.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const review = message.content[0].text;

    // Comment the review on the PR
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: review,
    });
  } catch (error) {
    console.error("Error details:", error);
    throw error;
  }
}

validatePR().catch((error) => {
  console.error("Error validating PR:", error);
  process.exit(1);
});
