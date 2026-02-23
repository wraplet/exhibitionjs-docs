import React from "react";
import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import BrowserOnly from '@docusaurus/BrowserOnly';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Introduction️
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="`exhibitionjs` is a library for showcasing your JS/TS/HTML/CSS code snippets with live previews. It leverages Monaco Editor for code editing and provides a seamless way to integrate interactive code examples into your web pages.">
      <HomepageHeader />
        <main>
          <HomepageFeatures />
          <div className={clsx('container', 'homepage-demo')}>
              <h2>Live demo</h2>
              <div className={styles.funFact}><strong>Fun fact</strong>: all live demos on this website, are made with the ExhibitionJS itself!</div>
              <BrowserOnly fallback={<div>Loading...</div>}>
                  {() => {
                      const ExhibitionExample = require("@site/src/components/ExhibitionExample").default;
                      const MonacoEditor = require("@site/src/components/MonacoEditor").default;
                      return (
                          <ExhibitionExample>
                              <div className="help-text">
                                  <p>First we define the basic HTML structure. We use Bootstrap for nice looks.</p>
                              </div>
                              <h4>HTML</h4>
                              <MonacoEditor contentUrl="/examples/basics/html.htm" language="html" />
                              <div className="help-text">
                                  <p>Then we initialize an Exhibition. Note that you can actually use TypeScript here!
                                     Monaco Editor transpiles it into a pure JavaScript before applying it to the preview.</p>
                              </div>
                              <h4>TypeScript</h4>
                              <MonacoEditor contentUrl="/examples/basics/typescript.txt" language="typescript" />
                              <div className="help-text">
                                  <p>After clicking the button below, the preview will be updated with the content from the
                                     editors above, and displayed in a modal.</p>
                              </div>
                          </ExhibitionExample>
                      );
                  }}
              </BrowserOnly>

              <div className={styles.buttons}>
                  <Link
                      className="button button--secondary button--lg"
                      to="/docs/category/examples">
                      More live examples
                  </Link>
              </div>
          </div>
        </main>
    </Layout>
  );
}
