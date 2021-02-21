import { Gender, Relation, Node, ExtNode } from 'relatives-tree/lib/types';

export type Member = Node & {
  id: string,
  name: string,
  from: string,
  image: string,
  birthday: string,
  deathday: string,
  age: string,
  gender: Gender,
  parents: Array<Relation>,
  siblings: Array<Relation>,
  spouses: Array<Relation>,
  children: Array<Relation>
}

export type ExtMember = ExtNode & Member
