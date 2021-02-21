import React from 'react';
import { Connector } from 'relatives-tree/lib/types';

interface Props {
  connector: Connector;
  width: number;
  height: number;
}

export default React.memo<Props>(function Connector({ connector, width, height }) {
  const [x1, y1, x2, y2] = connector;

  return (
    <line x1={x1 * width} y1={y1 * height} x2={x2 * width} y2={y2 * height} stroke="#999" strokeWidth="1" />
  );
});
