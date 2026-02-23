import React, {createRef, ReactNode, RefObject} from "react";
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import {Exhibition, ExhibitionMonacoEditor} from 'exhibitionjs';
import ExampleModal from "@site/src/components/ExampleModal";
import MonacoEditor from "@site/src/components/MonacoEditor";
import {
  MonacoEditorRegistryContext,
  RegistryContext
} from "@site/src/components/RegistryContext";

interface Props {
  title?: string;
  children?: ReactNode;
}

interface State {}

export default class ExhibitionExample extends React.Component<Props, State> {
  private myRef: RefObject<HTMLDivElement | null> = createRef();
  private exhibition?: Exhibition;
  private editors: ExhibitionMonacoEditor[] = [];
  private editorsCount: number = 0;

  constructor(props: Props) {
    super(props);

    this.registerEditor = this.registerEditor.bind(this);
  }

  // Equivalent to the 'register' function created by React.useCallback
  async registerEditor(editor: ExhibitionMonacoEditor): Promise<void> {
    this.editors.push(editor);

    if (this.editorsCount === this.editors.length) {
      await this.initExhibition();
    }
  }

  async initExhibition() {
    if (!ExecutionEnvironment.canUseDOM) {
      return;
    }
    const element = this.myRef.current;

    const map = Exhibition.getMap({ deferEditors: true });
    const exhibition = await Exhibition.create(element, map, {}, {init: false});

    for (const editor of this.editors.reverse()) {
      exhibition.getPreview().addDocumentAlterer(editor.getDocumentAlterer(), 0);
    }

    await exhibition.initialize();
    await exhibition.updatePreview();

    this.exhibition = exhibition;
  }

  async componentWillUnmount() {
    await this.exhibition?.wraplet.destroy();
  }

  render(): ReactNode {
    const { title, children } = this.props;

    const contextValue: RegistryContext = {
      registerEditor: this.registerEditor,
    };

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === MonacoEditor) {
        this.editorsCount++;
      }
    });

    return (
      <div ref={this.myRef} data-js-exhibition="">
        <MonacoEditorRegistryContext.Provider value={contextValue}>
          {children}
        </MonacoEditorRegistryContext.Provider>
        <ExampleModal title={title} onClick={() => this.exhibition?.updatePreview()}>
          <iframe
            data-js-exhibition-preview
            className="w-100 rounded"
            style={{display: "block", minHeight: "200px", height: "calc(100% - 40px)"}}
          ></iframe>
        </ExampleModal>
      </div>
    );
  }
}
