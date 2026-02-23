import React, {createRef, RefObject} from "react";
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import * as monaco from 'monaco-editor';
import {ExhibitionMonacoEditor, ExhibitionMonacoEditorOptions} from "exhibitionjs";
import { MonacoEditorRegistryContext } from "./RegistryContext";

interface Props {
  contentUrl: string,
  language: "html" | "javascript" | "typescript" | "css",
  options?: Partial<ExhibitionMonacoEditorOptions>,
}

export default class MonacoEditor extends React.Component<Props> {
  public EXHIBITIONJS_VERSION = "1.0.0-beta.1";
  private MONACO_VS_URL = "https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs";
  private MONACO_LOADER_BASE_URL = "https://cdn.jsdelivr.net/npm/@monaco-editor/loader@1.7.0/";
  private MONACO_LOADER_URL = `${this.MONACO_LOADER_BASE_URL}+esm`;
  private DECLARATIONS_WRAPLET_VERSION = "1.0.0-beta.1";

  private myRef: RefObject<HTMLDivElement | null> = createRef();
  private editor?: ExhibitionMonacoEditor;
  static contextType = MonacoEditorRegistryContext;
  context: React.ContextType<typeof MonacoEditorRegistryContext> | null = null;

  async componentDidMount() {
    if (!ExecutionEnvironment.canUseDOM) {
      return;
    }
    const ctx = this.context;
    if (!ctx) return;


    const element = this.myRef.current;

    monaco.typescript.typescriptDefaults.setCompilerOptions({
      module: monaco.typescript.ModuleKind.ESNext,
      target: monaco.typescript.ScriptTarget.ES2017,
      moduleResolution: monaco.typescript.ModuleResolutionKind.NodeJs,
    });
    await this.loadDeclarations(monaco);

    const response = await fetch(this.props.contentUrl);
    const content = await response.text();

    const defaultMonacoOptions: ExhibitionMonacoEditorOptions["monacoEditorOptions"] = {
      minimap: {
        enabled: false,
      },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      value: content,
      language: this.props.language,
    };

    const options: ExhibitionMonacoEditorOptions = {
      monaco: monaco,
      monacoEditorOptions: { ...defaultMonacoOptions, ...this.props.options },
    };


    if (["javascript", "typescript"].includes(options["monacoEditorOptions"]["language"])) {
      if (!options["tagAttributes"]) options["tagAttributes"] = {};
      options["tagAttributes"]["type"] = "module";
      options.monacoEditorOptions.value = this.processValue(options.monacoEditorOptions.value);
    }


    const editor = ExhibitionMonacoEditor.create(
      element,
      options,
    );

    await editor.initialize();
    await ctx.registerEditor(editor);

    this.editor = editor;
  }

  private processValue(value: string) {
    value = value.replace(/\{\{EXHIBITIONJS_URL_ESM\}\}/g, this.getExhibitionJSLibURL(true));
    value = value.replace(/\{\{MONACO_VS_URL\}\}/g, this.MONACO_VS_URL);
    value = value.replace(/\{\{MONACO_LOADER_URL\}\}/g, this.MONACO_LOADER_URL);

    return value;
  }

  private getExhibitionJSLibURL(esm = false): string {
    const exhibitionJSVersion = this.EXHIBITIONJS_VERSION;
    let exhibitionWrapletLib = "https://cdn.jsdelivr.net/npm/exhibitionjs@" + exhibitionJSVersion + "/dist/";
    if (esm) {
      exhibitionWrapletLib += "+esm";
    }

    return exhibitionWrapletLib;
  }

  componentWillUnmount() {
    this.editor?.destroy();
  }

  render() {
    return (
      <div
        ref={this.myRef}
        data-js-exhibition-editor
        className="bordered margin-bottom--lg"
        style={{height: "500px", resize: "vertical", overflow: "auto"}}
      ></div>
    );
  }

  private async loadDeclarations(monacoModule: typeof monaco) {
    async function loadTypeDeclarations(declarationString: string, filename: string) {
      monacoModule.typescript.javascriptDefaults.addExtraLib(declarationString, filename);
      if (!monacoModule.editor.getModel(monaco.Uri.parse(filename))) {
        monacoModule.editor.createModel(declarationString, "typescript", monaco.Uri.parse(filename));
      }
    }

    async function loadTypeDeclarationsFromFiles(prefix: string, files: string[], filename: string) {
      let libSources = `declare module "${prefix}+esm" {\n`;
      for (const file of files) {
        const path = prefix + file;
        const libResource = await fetch(path);
        const libSource = await libResource.text();
        libSources += libSource + '\n';
      }
      libSources += '}';
      await loadTypeDeclarations(libSources, filename);
    }

    // "require" is a method coming from the monaco loader.
    await loadTypeDeclarations("declare const require : any", "ts:monaco.required.d.ts")
    await loadTypeDeclarations("declare const monaco : any", "ts:monaco.monaco.d.ts")

    const files = [
      "types/DocumentAlterer.d.ts",
      "types/DocumentAltererProvider.d.ts",
      "types/DocumentAltererProviderWraplet.d.ts",
      "types/PreviewValue.d.ts",
      "Exhibition.d.ts",
      "ExhibitionPreview.d.ts",
      "ExhibitionMonacoEditor.d.ts",
      "selectors.d.ts",
      "TypeMap.d.ts",
    ];

    // Load Exhibition's type declarations.
    await loadTypeDeclarationsFromFiles(this.getExhibitionJSLibURLDir(), files, "ts:exhibition.d.ts");

    const wrapletFiles = [
      "AbstractWraplet.d.ts",
      "Wraplet/types/Wraplet.d.ts",
    ];

    // Load wraplet's type declarations.'
    await loadTypeDeclarationsFromFiles(this.getWrapletLibUrl(), wrapletFiles, "ts:wraplet.d.ts");

    // Load @monaco-editor/loader type declarations.
    await loadTypeDeclarationsFromFiles(`${this.MONACO_LOADER_BASE_URL}`, ["lib/types.d.ts"], "ts:monaco-editor-loader.d.ts");

  }

  private getExhibitionJSLibURLDir() {
    const url = this.getExhibitionJSLibURL();
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    urlObj.pathname = path.substring(0, path.lastIndexOf('/') + 1);
    return urlObj.toString();
  }

  private getWrapletLibUrl() {
    return `https://cdn.jsdelivr.net/npm/wraplet@${this.DECLARATIONS_WRAPLET_VERSION}/dist/`;
  }

}
