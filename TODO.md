# TODO

- [x] Plugin Registry (register plugins (collection of rules and actions), rules, actions, ..., Action Hashmap, Rules Hashmap)
- [x] Parse Project Config and merge with Base config
- [x] Traverse Workspace and get all config files based on .gitignore for folders to ignore.
- [ ] Get all git diff files, then group by project config file paths (needed before run)
- [ ] Better pruneExternalDeps matching (secondary entrypoints, e.g.: @angular/core/...)