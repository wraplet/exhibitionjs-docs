---
id: core-concepts
title: Core concepts
slug: /core-concepts
sidebar_position: 2
---

## Diagram

```mermaid
classDiagram
    Exhibition "1" --> "0..*" ExhibitionMonacoEditor: editors
    Exhibition "1" --> "1" ExhibitionPreview: preview
    class Exhibition {
        +__static__ createMultiple(...): ...
        +__static__ create(...): ...
        +__static__ getMap(...): ...
        +__static__ getCustomizedMap(...): ...

        +initialize(): ...
        +addEditor(...): ...
        +removeEditor(...): ...
        +hasEditor(...): ...
        +getPreview(): ...
        +updatePreview(): ...
    }
    
    class ExhibitionMonacoEditor {
        +__static__ createMonacoEditor(...): ...
        +__static__ createMonacoModel(...): ...
        +__static__ create(...): ...
        +__static__ trimDefaultValue(...): ...       
        +initialize(): ...
        +getPriority(): ...
        +getDocumentAlterer(): ...
        +destroy(): ...
    }
    class ExhibitionPreview {
        +addDocumentAlterer(...): ...
        +hasDocumentAlterer(...): ...
        +removeDocumentAlterer(...): ...
        +update(): ...
        +updateHeight(): ...
    }
```

## Exhibition

```mermaid
classDiagram
    class Exhibition {
        +__static__ createMultiple(node, map, options?, initOptions?, attribute?): Promise~Exhibition[]~
        +__static__ create(element, map, options?, initOptions?): Promise~Exhibition~
        +__static__ getMap(getMapArgs): Map
        +__static__ getCustomizedMap(mapConfiguration): Map

        +initialize(): Promise~void~
        +addEditor(editor): void
        +removeEditor(editor): void
        +hasEditor(editor): boolean
        +getPreview(): PreviewWraplet
        +updatePreview(): Promise~void~
    }
```

An `Exhibition` class coordinates a group of editors and a single preview. It automatically
finds properly configured elements among its children and wires them up. It's not strictly
necessary, you can instantiate a preview, a bunch of editors and wire them up yourself. However,
`Exhibition` class makes setting everything up a bit easier.

### Map

Exhibtion's `create` methods require a dependency map. Based on this map Exhibition class decides
what and how to instantiate among its children.

`getMap` method provides a default map with the options structure suitable for most use cases.

If that's not enough, you can provide your own map, where you can completely customize everything.
You can even provide your custom classes that will be instantiated as Editors and Preview. A good
starting point to that is to use the `getCustomizedMap` method that is equipped with useful types.

## Editors

```mermaid
classDiagram
    class ExhibitionMonacoEditor {
        +__static__ createMonacoEditor(...): Editor
        +__static__ createMonacoModel(...): Model
        +__static__ create(...): ExhibitionMonacoEditor
        +__static__ trimDefaultValue(...): string        
        +initialize(): Promise~void~
        +getPriority(): number
        +getDocumentAlterer(): DocumentAlterer
        +destroy(): Promise~void~
    }
```

Editors are instances that provide a `DocumentAlterer` (see below) function. The provided
`ExhibitionMonacoEditor` class wraps a Monaco Editor instance and uses its value as a return value
of provided `DocumentAlterer`.

## Preview

```mermaid
classDiagram
    class ExhibitionPreview {
        +addDocumentAlterer(alterer, priority?): void
        +hasDocumentAlterer(alterer): boolean
        +removeDocumentAlterer(alterer): void
        +update(): Promise~void~
        +updateHeight(): void
    }
```

The Preview is an iframe controlled by the `ExhibitionPreview` class. When updated, it creates a
fresh HTML document, sorts all alterers by priority (descending), executes them, and loads their
output into the iframe. The preview automatically resizes to fit its content (this behavior can be
disabled).

## DocumentAlterer

A `DocumentAlterer` is an async function that receives the target `Document` and mutates it
(e.g., appends HTML, scripts, styles). You can create your own alterers to inject anything you need.

```ts
import type { DocumentAlterer } from "exhibitionjs";

const addMeta: DocumentAlterer = async (doc) => {
  const meta = doc.createElement("meta");
  meta.name = "viewport";
  meta.content = "width=device-width, initial-scale=1";
  doc.head.appendChild(meta);
};

exhibition.addPreviewAlterer(addMeta, 10); // higher number runs earlier
```

## Priorities

Alterers have a numeric priority. Higher numbers run first. This lets you control ordering (e.g., ensure polyfills load before your demo script).
