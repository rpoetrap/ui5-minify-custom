import minifier from "@ui5/builder/processors/minifier";
import fsInterface from "@ui5/fs/fsInterface";

export default async function ({
    workspace,
    taskUtil,
    options,
}) {
    const {
        omitSourceMapResources = true,
        useInputSourceMaps = false,
        omitDebugResources = true,
    } = options.configuration || {};

    const pattern = '**/*.js';
    const resources = await workspace.byGlob(pattern);
    const processedResources = await minifier({
        resources,
        fs: fsInterface(workspace),
        taskUtil,
        options: {
            addSourceMappingUrl: !omitSourceMapResources,
            readSourceMappingUrl: !!useInputSourceMaps,
            useWorkers: !!taskUtil,
        }
    });

    return Promise.all(processedResources.map(async ({
        resource, dbgResource, sourceMapResource, dbgSourceMapResource
    }) => {
        if (taskUtil) {
            // Carry over OmitFromBuildResult from input resource to all derived resources
            if (taskUtil.getTag(resource, taskUtil.STANDARD_TAGS.OmitFromBuildResult)) {
                taskUtil.setTag(dbgResource, taskUtil.STANDARD_TAGS.OmitFromBuildResult, true);
                taskUtil.setTag(sourceMapResource, taskUtil.STANDARD_TAGS.OmitFromBuildResult, true);
            }
            taskUtil.setTag(resource, taskUtil.STANDARD_TAGS.HasDebugVariant, !omitDebugResources);
            taskUtil.setTag(dbgResource, taskUtil.STANDARD_TAGS.IsDebugVariant, true);
            taskUtil.setTag(sourceMapResource, taskUtil.STANDARD_TAGS.HasDebugVariant, !omitDebugResources);
            if (omitDebugResources) {
                taskUtil.setTag(dbgResource, taskUtil.STANDARD_TAGS.OmitFromBuildResult, true);
            }
            if (omitSourceMapResources) {
                taskUtil.setTag(sourceMapResource, taskUtil.STANDARD_TAGS.OmitFromBuildResult, true);
            }
            if (dbgSourceMapResource) {
                taskUtil.setTag(dbgSourceMapResource, taskUtil.STANDARD_TAGS.IsDebugVariant, true);
                if (omitSourceMapResources || omitDebugResources) {
                    taskUtil.setTag(dbgSourceMapResource, taskUtil.STANDARD_TAGS.OmitFromBuildResult, true);
                }
            }
        }
        return Promise.all([
            workspace.write(resource),
			!omitDebugResources && workspace.write(dbgResource),
			!omitSourceMapResources && workspace.write(sourceMapResource),
			dbgSourceMapResource && !omitDebugResources && workspace.write(dbgSourceMapResource)
        ]);
    }));
}