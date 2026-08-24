// biome-ignore-all lint/suspicious/noTemplateCurlyInString: semantic-release/exec expands these command templates.
export default {
	branches: ["main", { name: "next", prerelease: true }],
	plugins: [
		["@semantic-release/commit-analyzer", { preset: "conventionalcommits" }],
		[
			"@semantic-release/release-notes-generator",
			{ preset: "conventionalcommits" },
		],
		"@semantic-release/changelog",
		[
			"@semantic-release/exec",
			{
				prepareCmd:
					"pnpm version ${nextRelease.version} --no-git-tag-version --no-git-checks",
				publishCmd:
					"pnpm publish --tag ${nextRelease.channel || 'latest'} --no-git-checks",
				addChannelCmd:
					"pnpm dist-tag add $(pnpm pkg get name --json | tr -d '\"')@${nextRelease.version} ${nextRelease.channel}",
			},
		],
		"@semantic-release/github",
		["@semantic-release/git", { assets: ["CHANGELOG.md", "package.json"] }],
	],
};
