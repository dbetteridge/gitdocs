## Required

- Allow user to create account
- Allow user to login
- Allow user to name their space
- namespace pages /space/type/org/repo or /space/type/org/project/repo

- Allow user to add source service (github/azure)
- Allow user to add source org
- Allow user to add source project (azure)
- Allow user to add source repo

- ~~[Read md from github](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/)~~
- Read md from github (Use OAuth and repo scope, NOT IDEAL!)
- [Need to handle token refresh](https://stackoverflow.com/questions/28685033/how-to-handle-refresh-tokens-in-golang-oauth2-client-lib)
- Read md from azure (Doable with OAuth and vso.code scope as this is read only)
- Read md from gitlab?
- Convert to HTML
- Store markdown + html

## Nice to have 6mths

- auto refresh of repos
- OT driven shared editing of markdown files
- ability to commit updated markdown back to git

## Nice to have 12mths