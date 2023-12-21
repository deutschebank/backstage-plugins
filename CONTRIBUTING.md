# Contributing to Deutshce Bank Backstage Plugins

Contributions are welcome, and they are greatly appreciated! Every little bit helps.

Backstage Plugins are released under the Apache 2.0 License, and original creations contributed to this repo are accepted under the same license.

## Code of Conduct

This project adheres to the [CNCF Code of Conduct][code-of-conduct]. By participating, you are expected to honor this code.

[code-of-conduct]: https://github.com/cncf/foundation/blob/main/code-of-conduct.md

## Contribution Process

Before making a contribution, please take the following steps:

1. Check whether there's already an open issue related to your proposed contribution. If there is, join the discussion and propose your contribution there.
2. If there isn't already a relevant issue, create one, describing your contribution and the problem you're trying to solve.
3. Respond to any questions or suggestions raised in the issue by other developers.
4. Fork the project repository and prepare your proposed contribution.
5. Submit a pull request.

## Contributing

1. Fork it (<https://github.com/deutschebank/backstage-plugins/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Read our [Community Code of Conduct](https://github.com/cncf/foundation/blob/main/code-of-conduct.md)
4. Commit your changes (`git commit -am 'Add some fooBar'`)
5. Push to the branch (`git push origin feature/fooBar`)
6. Create a new Pull Request

## Coding Guidelines

All code is formatted with `prettier` using the configuration in the repo. If possible we recommend configuring your editor to format automatically, but you can also use the `yarn prettier --write <file>` command to format files.

A consistent coding style is included via [EditorConfig](https://editorconfig.org/) with the file [`.editorconfig`](.editorconfig) at the root of the repo. Depending on your editor of choice, it will either support it out of the box or you can [download a plugin](https://editorconfig.org/#download) for the config to be applied.

If you're contributing to the backend or CLI tooling, be mindful of cross-platform support. [This](https://shapeshed.com/writing-cross-platform-node/) blog post is a good guide of what to keep in mind when writing cross-platform NodeJS.

Also be sure to skim through our [ADRs](https://backstage.io/docs/architecture-decisions/) to see if they cover what you're working on. In particular [ADR006: Avoid React.FC and React.SFC](https://backstage.io/docs/architecture-decisions/adrs-adr006) is one to look out for.

If there are any updates in `markdown` file please make sure to run `yarn run lint:docs`. Though it is checked on `lint-staged`. It is required to install [vale](https://vale.sh/docs/vale-cli/installation/) separately and make sure it is accessed by global command.

## Developer Certificate of Origin

As with other CNCF projects, Backstage has adopted a [Developers Certificate of Origin (DCO)](https://developercertificate.org/). A DCO is a lightweight way for a developer to certify that they wrote or otherwise have the right to submit code or documentation to a project.

To certify the code you submit to the repository you'll need to add a `Signed-off-by` line to your commits.

`$ git commit -s -m 'Awesome commit message'`

Which will look something like the following in the repo;

```
Awesome commit message

Signed-off-by: Jane Smith <jane.smith@example.com>
```

> Note: this assumes you have setup your git name and email, if you have not you can use these commands to set that up:
>
> ```shell
> git config --global user.name "Your Name"
> git config --global user.email "youremail@example.com"
> ```

- In case you forgot to add it to the most recent commit, use `git commit --amend --signoff`
- In case you forgot to add it to the last N commits in your branch, use `git rebase --signoff HEAD~N` and replace N with the number of new commits you created in your branch.
- If you have a very deep branch with a lot of commits, run `git rebase -i --signoff $(git merge-base -a master HEAD)`, double check to make sense of the commits (keep all lines as `pick`) and save and close the editor. This should bulk sign all the commits in your PR. Do be careful though. If you have a complex flow with a lot of branching and re-merging of work branches and stuff, merge-base may not be the right solution for you.

Note: If you have already pushed your branch to a remote, you might have to force push: `git push -f` after the rebase.

### Using GitHub Desktop?

If you are using the GitHub Desktop client, you need to manually add the `Signed-off-by` line to the Description field on the Changes tab before committing:

```text
Awesome description (commit message)

Signed-off-by: Jane Smith <jane.smith@example.com>
```

In case you forgot to add the line to your most recent commit, you can amend the commit message from the History tab before pushing your branch (GitHub Desktop 2.9 or later).

### Using VS Code?

If you are using VS Code you can enable always signing your commits by setting the following in your `settings.json` file:

```json
"git.alwaysSignOff": true,
```

Or from the Settings UI look for the "Git: Always Sign Off" setting and check the "Controls the signoff flag for all commits" box.

## Review Process

Once you've submitted a Pull Request (PR) it's just a matter of being patient as the reviewers have time they will begin to review your PR. When the review begins there may be a few layers to this but the general rule is that you need approval from one of the core maintainers and one from the specific area impacted by your PR. You may also have someone from the community review your changes, this can really help speed things up as they may catch some early items making the review for the maintainers simpler. Once you have the two (2) approvals it's ready to be merged, this task is also done by the maintainers.

## Governance

### Roles

The project community consists of Contributors and Maintainers:
* A **Contributor** is anyone who submits a contribution to the project. (Contributions may include code, issues, comments, documentation, media, or any combination of the above.)
* A **Maintainer** is a Contributor who, by virtue of their contribution history, has been given write access to project repositories and may merge approved contributions.