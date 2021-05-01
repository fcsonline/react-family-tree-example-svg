import React, { useState } from 'react';
import PinchZoomPan from '../PinchZoomPan/PinchZoomPan';
import FamilyTree from '../FamilyTree/FamilyTree';
import FamilyNode from '../FamilyNode/FamilyNode';
import { Node, ExtNode } from 'relatives-tree/lib/types';
import { ExtMember } from '../../types'
import nodes from '../../nodes.json'

import styles from './App.module.css';

const WIDTH = 190;
const HEIGHT = 220;

export default React.memo<{}>(
  function App() {
    const [rootId, setRootId] = useState<string>(nodes[0].id);
    const onResetClick = () => setRootId(nodes[0].id);

    return (
      <div className={styles.root}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            FamilyTree SVG demo
          </h1>
          <a href="https://github.com/SanichKotikov/react-family-tree-example">GitHub</a>
        </header>
        {nodes && rootId && (
          <PinchZoomPan
            min={0.5}
            max={2.5}
            captureWheel
            className={styles.wrapper}
          >
            <FamilyTree
              nodes={nodes as Node[]}
              rootId={rootId}
              width={WIDTH}
              height={HEIGHT}
              className={styles.tree}
              renderNode={(node: ExtNode) => (
                <FamilyNode
                  key={node.id}
                  node={node as ExtMember}
                  isRoot={node.id === rootId}
                  onClick={setRootId}
                  left={node.left * (WIDTH / 2) - 15}
                  top={node.top * (HEIGHT / 2) + 65}
                />
              )}
            />
          </PinchZoomPan>
        )}
        {rootId !== nodes[0].id && (
          <div className={styles.reset} onClick={onResetClick}>
            Reset
          </div>
        )}
      </div>
    );
  }
);
