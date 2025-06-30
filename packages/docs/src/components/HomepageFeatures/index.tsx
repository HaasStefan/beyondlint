import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  imageSrc: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Made for Enterprise Monorepos',
    imageSrc: require('@site/static/img/enterprise.png').default,
    description: (
      <>
        BeyondLint is highly configurable and designed to work seamlessly
        with large-scale TypeScript monorepos. It supports rules out of the box
        that are tailored for enterprise needs, ensuring your codebase remains
        clean and maintainable.
      </>
    ),
  },
  {
    title: 'Integrates with CI Pipelines',
    imageSrc: require('@site/static/img/ci.png').default,
    description: (
      <>
        BeyondLint integrates smoothly with your CI pipeline, allowing
        you to enforce coding standards and rules automatically.
        You can trigger actions based on code changes, making it a powerful tool
        for continuous integration.
      </>
    ),
  },
  {
    title: 'Extendable by Design',
    imageSrc: require('@site/static/img/extendable.png').default,
    description: (
      <>
        Extend BeyondLint with your own rules and actions. The plugin system allows
        you to create custom rules that fit your specific needs. Whether you want to
        enforce coding standards, or automate tasks based on code changes, BeyondLint provides the flexibility to do so.
      </>
    ),
  },
];

function Feature({title, imageSrc, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img className={styles.featureSvg} src={imageSrc} alt={title} role="img" />
      </div>
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