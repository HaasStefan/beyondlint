# TODO

- [x] Plugin Registry (register plugins (collection of rules and actions), rules, actions, ..., Action Hashmap, Rules Hashmap)
- [x] Parse Project Config and merge with Base config
- [x] Traverse Workspace and get all config files based on .gitignore for folders to ignore.
- [ ] Get all git diff files, then group by project config file paths (needed before run)
- [x] If file is .gitignore while traversing, create new ig and add .gitignore for getting config files
- [ ] Better pruneExternalDeps matching (secondary entrypoints, e.g.: @angular/core/...)
- [ ] Explore Plugins from node_modules by package name, config file json for rules and actions and entry points, `npm link`
- [ ] Plugin API, Rules validation, Actions validation, maybe use Zod for runtime type validation?