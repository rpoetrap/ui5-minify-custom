### Install
```bash
npm install -D https://github.com/rpoetrap/ui5-minify-custom
```

### Configuration Options (in `$yourapp/ui5.yaml`)
- **omitSourceMapResources**: `boolean`
  enable this to exclude source maps from build result

- **useInputSourceMaps**: `boolean`
  enable this to add any existing source maps as a reference to be minifed

- **omitDebugResources**: `boolean`
  enable this to exclude debug variant from build result


## Usage
1. Install the dependency inside devDependencies:
    ```bash
    npm install -D https://github.com/rpoetrap/ui5-minify-custom
    ```

2. Register the task in your `$yourapp/ui5.yaml`:
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

3. Exclude the standard minify task from the build script in `$yourapp/package.json` by adding `--exclude-task minify` parameter to the ui5 command:
    ```json
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