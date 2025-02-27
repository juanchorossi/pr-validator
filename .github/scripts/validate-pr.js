import { OpenAI } from "openai";
import { getOctokit } from "@actions/github";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const octokit = getOctokit(process.env.GITHUB_TOKEN);

async function validatePR() {
  const context = JSON.parse(process.env.GITHUB_CONTEXT);
  const prNumber = context.event.pull_request.number;
  const repo = context.repository;

  // Get PR details
  const { data: pr } = await octokit.rest.pulls.get({
    owner: repo.owner.login,
    repo: repo.name,
    pull_number: prNumber,
  });

  // Get PR diff
  const { data: files } = await octokit.rest.pulls.listFiles({
    owner: repo.owner.login,
    repo: repo.name,
    pull_number: prNumber,
  });

  const prompt = `
    Please review this PR with the following criteria:
    
    1. Code organization:
       - Components should be in /package/ui/src/atoms or /package/ui/src
       - No hardcoded hex values in Tailwind
       - Fonts centralized in tailwind.config.js
    
    2. Documentation:
       - CHANGELOG.md should be updated
       - Environment variables should be documented
    
    3. Testing:
       - New changes should have corresponding tests
    
    PR Title: ${pr.title}
    PR Description: ${pr.body}
    
    Changed files:
    ${files.map((file) => `${file.filename}: ${file.patch}`).join("\n")}
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are a code reviewer that validates PRs based on specific criteria.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const review = completion.choices[0].message.content;

  // Comment the review on the PR
  await octokit.rest.issues.createComment({
    owner: repo.owner.login,
    repo: repo.name,
    issue_number: prNumber,
    body: review,
  });
}

validatePR().catch(console.error);
