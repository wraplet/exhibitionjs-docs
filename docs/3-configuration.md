---
id: configuration
title: Configuration
slug: /configuration
sidebar_position: 3
---

# Configuration

`exhibitionjs` can be configured using both data attributes on HTML elements and options passed during initialization.

## Exhibition Options

These options apply to the `Exhibition` instance and can be set via the `data-js-options` attribute on the main exhibition element.

| Option             | Type | Default | Description                                                              |
|--------------------| --- | --- |--------------------------------------------------------------------------|
| `updaterSelector` | `string` | `[data-js-exhibition-updater]` | Selector for the element(s) that triggers a preview update when clicked. |

**Example:**
```html
<div data-js-exhibition data-js-options='{"updaterSelector": ".my-custom-button"}'>
    <!-- ... -->
</div>
```

## Editor Options (`ExhibitionMonacoEditor`)

These options apply to each code editor and can be set via the `data-js-options` attribute.

| Option                | Type | Default | Description                                                                |
|-----------------------| --- | --- |----------------------------------------------------------------------------|
| `monaco`              | `MonacoInstance` | - | **Required**. The Monaco Editor module instance.                           |
| `monacoEditorCreator` | `EditorCreator` | - | A function that creates the actual Monaco Editor instance.                 |
| `monacoEditorOptions` | `object` | `{}` | Standard Monaco Editor construction options.                               |
| `location`            | `"head" \| "body"` | `body` | Where the code should be injected in the preview.                          |
| `priority`            | `number` | `0` | Execution order of the snippet. Higher values run first.                   |
| `trimDefaultValue`    | `boolean` | `true` | Whether to trim leading/trailing whitespace from the initial editor value. |
| `tagAttributes`       | `Record<string, string>` | `{}` | Attributes to add to the generated `<script>` or `<style>` tags.           |

**Example:**
```html
<div data-js-exhibition-editor
     data-js-options='{
       "monacoEditorOptions": {"language": "typescript"},
       "priority": 10,
       "tagAttributes": {"type": "module"}
     }'>
</div>
```

## Init Options

When using `Exhibition.create` or `Exhibition.createMultiple`, you can pass an `ExhibitionInitOptions` object.

These options regulate how objects are initialized after being instantiated (instantiation is regulated by the dependency map).

| Option | Type | Default | Description                                                        |
| --- | --- | --- |--------------------------------------------------------------------|
| `init` | `boolean` | `true` | Whether to automatically initialize everything.                    |
| `updatePreview` | `boolean` | `false` | Whether to trigger an initial preview update after initialization. |


## Priority of options

When options can be set through an attribute, the attribute's values override the values provided
to the object in JavaScript.