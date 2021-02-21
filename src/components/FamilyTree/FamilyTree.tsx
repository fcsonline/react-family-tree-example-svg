import React from 'react';
import calcTree from 'relatives-tree';
import { Node, ExtNode } from 'relatives-tree/lib/types';
import Connector from '../FamilyConnector/FamilyConnector';

interface Props {
  nodes: ReadonlyArray<Node>;
  rootId: string;
  width: number;
  height: number;
  placeholders?: boolean;
  className?: string;
  renderNode: (node: ExtNode) => React.ReactNode;
}

export default React.memo<Props>(function ReactFamilyTree(props) {
  const data = calcTree(props.nodes, {
    rootId: props.rootId,
    placeholders: props.placeholders,
  });

  const width = Math.round(props.width / 2);
  const height = Math.round(props.height / 2);

  const cWidth = data.canvas.width * width
  const cHeight = data.canvas.height * height

  return (
     <svg
       xmlns="http://www.w3.org/2000/svg"
       xmlnsXlink="http://www.w3.org/1999/xlink"
       className={props.className}
       height={cHeight}
       width={cWidth}
       viewBox={`0 0 ${cWidth} ${cHeight}`}
     >
      {data.connectors.map((connector, idx) => (
        <Connector
          key={idx}
          connector={connector}
          width={width}
          height={height}
        />
      ))}
      {data.nodes.map(props.renderNode)}
    </svg>
  );
});
