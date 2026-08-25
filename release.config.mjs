// biome-ignore-all lint/suspicious/noTemplateCurlyInString: semantic-release/exec expands these command templates.
export default {
	branches: ["main", { name: "next", prerelease: true }],
	plugins: [
		["@semantic-release/commit-analyzer", { preset: "conventionalcommits" }],
		[
			"@semantic-release/release-notes-generator",
			{ preset: "conventionalcommits" },
		],
		["@semantic-release/changelog", { changelogFile: "CHANGELOG.md" }],
		[
			"@semantic-release/exec",
			{
				prepareCmd:
					"pnpm --dir lib version ${nextRelease.version} --no-git-tag-version --no-git-checks",
				publishCmd:
					"pnpm --dir lib publish --provenance --tag ${nextRelease.channel || 'latest'} --no-git-checks",
				addChannelCmd:
					"pnpm dist-tag add $(pnpm --dir lib pkg get name --json | tr -d '\"')@${nextRelease.version} ${nextRelease.channel}",
			},
		],
		"@semantic-release/github",
		["@semantic-release/git", { assets: ["CHANGELOG.md", "lib/package.json"] }],
	],
};
