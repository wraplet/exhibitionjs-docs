import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>> | null;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    Svg: null, //require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Set up your exhibitions with minimal code.
      </>
    ),
  },
  {
    title: 'No external dependencies',
    Svg: null, //require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        You can self-host everything to be sure your code will run forever.
        Forget about quirks of external services hosting your examples.
      </>
    ),
  },
  {
    title: 'Powered by Wraplet',
    Svg: null, // require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        You can customize any compontent of the library individually.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      {Svg && (
        <div className="text--center">
          <Svg className={styles.featureSvg} role="img" />
        </div>
      )}
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
