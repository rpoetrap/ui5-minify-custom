# ui5-minify-custom

Custom minification task for SAP UI5 build tooling. Replaces the standard `minify` task with configurable control over source maps and debug resource output.

### Install
Add the GitHub Packages registry for the `@rpoetrap` scope to your `.npmrc`:
```
@rpoetrap:registry=https://npm.pkg.github.com
```

Then install:
```bash
npm install -D @rpoetrap/ui5-minify-custom
```

### Configuration Options (in `$yourapp/ui5.yaml`)
- **omitSourceMapResources**: `boolean` (default: `true`)
  Exclude source maps from build result.

- **useInputSourceMaps**: `boolean` (default: `false`)
  Use existing source maps as references during minification.

- **omitDebugResources**: `boolean` (default: `true`)
  Exclude debug variants (unminified copies) from build result.


## Usage
1. Add the GitHub Packages registry for the `@rpoetrap` scope to your `$yourapp/.npmrc`:
    ```
    @rpoetrap:registry=https://npm.pkg.github.com
    ```

2. Install the dependency inside devDependencies:
    ```bash
    npm install -D @rpoetrap/ui5-minify-custom
    ```

3. Register the task in your `$yourapp/ui5.yaml`:
    ```yaml
    [...]
    builder:
    customTasks:
      - name: ui5-minify-custom
        afterTask: minify
    [...]
    ```

    If you are using the `ui5-tooling-transpile-task` task and don't want the `.ts` file being generated, you can add some configuration to the task:
    ```yaml
    [...]
    builder:
    customTasks:
      - name: ui5-tooling-transpile-task
        afterTask: replaceVersion
        configuration:
          debug: true
          omitTSFromBuildResult: true
          omitSourceMaps: true
          transformModulesToUI5:
            overridesToOverride: true
    [...]
    ```

4. Exclude the standard minify task from the build script in `$yourapp/package.json` by adding `--exclude-task minify` parameter to the ui5 command:
    ```jsonc
    {
      // ...

      "scripts": {
        // ...
        "build": "ui5 build --config=ui5.yaml --clean-dest --dest dist --exclude-task minify",
        // ...
      },

      // ...
    }
    ```