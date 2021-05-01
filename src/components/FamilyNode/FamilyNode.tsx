import React from 'react'
import { ExtMember } from '../../types'

interface Props {
  node: ExtMember;
  isRoot: boolean;
  left: number;
  top: number;
  onClick: (id: string) => void;
}

export default React.memo<Props>(
  function FamilyNode({ node, onClick, left, top }) {
    const dates = [node.birthday, node.deathday].filter(Boolean).join(' - ')

    return (
      <g
        transform={`translate(${left} ${top})`}
        width="220"
        height="190"
        style={ { cursor: 'pointer'}}
        onClick={() => { onClick(node.id) }}
      >
        <defs>
          {node.image && (
            <pattern id={node.id} x="0%" y="0%" height="100%" width="100%" viewBox="0 0 70 70">
              <image x="0%" y="0%" width="70" height="70" xlinkHref={`${process.env.PUBLIC_URL}/images/${node.image}`}></image>
            </pattern>
          )}
          {!node.image && (
            <pattern id={node.id} x="0%" y="0%" height="100%" width="100%" viewBox="0 0 20 20">
              <rect width="20" height="20" fill="white" />
              <path fill="#999" fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </pattern>
          )}
        </defs>

        <circle className="medium" cx="110" cy="40" r="38" fill="gray" stroke="lightgray" strokeWidth="2" />
        <circle className="medium" cx="110" cy="40" r="35" fill={ `url(#${node.id})` } stroke="white" strokeWidth="3" />

        <text x="110" y="95" textAnchor="middle" fill="#333" style={{ fontWeight: 'bold', fontFamily: 'Arial' }}>{node.name || '-'}</text>
        <text x="110" y="120" textAnchor="middle" fill="#666" style={{ fontFamily: 'Arial' }}>{node.from || '-'}</text>
        <text x="110" y="145" textAnchor="middle" fill="#888" style={{ fontFamily: 'Arial' }}>
          {dates}
        </text>
      </g>
    )
  }
);
