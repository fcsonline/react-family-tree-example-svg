import CryptoJS from 'crypto-js';
import { Gender, RelType, Relation } from 'relatives-tree/lib/types';
import { Member } from './types'
import Papa from 'papaparse'
import _ from 'lodash'

const NAME='Nom'
const FATHER='Pare'
const MOTHER='Mare'
const GENDER='Gènere'
const FROM='Lloc de naixament'
const BIRTHDAY='Data de naixament'
const DEFUNCT='Data de defunció'
const SPOUSE='Cònjuge'
const IMAGE='Foto'
const AGE='Edat'

const MALE='Home'
const FEMALE='Dona'

interface IHash<T> {
  [index: string]: T;
}

type Rows = Array<IHash<string>>

interface DataMember {
  id: string,
  name: string,
  father: string,
  mother: string,
  spouse: string,
  gender: string,
  from: string,
  image: string,
  birthday: string,
  deathday: string,
  age: string
}

type DataMembers = Array<DataMember>

 // Auxiliary functions
 const computeRelation = (member: DataMember, type: RelType): Relation => {
   return {
     id: member.id,
     type
   }
 }
 const computeParents = (members: DataMembers, member: DataMember): Array<Relation> => {
   return _.map(
     _.filter(members, (item) => {
       return member.father === item.name || member.mother === item.name
     }),
     (member: DataMember) => computeRelation(member, 'blood' as RelType)
   )
 }

 const computeSiblings = (members: DataMembers, member: DataMember): Array<Relation> => {
   return _.map(
     _.filter(members, (item) => {
       return (
         member.father === item.father &&
         member.mother === item.mother &&
         member.name !== item.name
       )
     }),
     (member: DataMember) => computeRelation(member, 'blood' as RelType)
   )
 }

 const computeSpouses = (members: DataMembers, member: DataMember): Array<Relation> => {
   const spouses = _.filter(members, (item) => item.name === member.spouse)

   return _.map(
     spouses,
     (member: DataMember) => computeRelation(member, 'married' as RelType)
   )
 }

 const computeChildren = (members: DataMembers, member: DataMember): Array<Relation> => {
   return _.map(
     _.filter(members, (item) => {
       return (
         member.name === item.father ||
         member.name === item.mother
       )
     }),
     (member: DataMember) => computeRelation(member, 'blood' as RelType)
   )
 }

 const computeGenre = (members: DataMembers, member: DataMember): Gender => {
   if (member.gender === MALE) {
     return 'male' as Gender
   } else if (member.gender === FEMALE) {
     return 'female' as Gender
   } else {
     return 'male' as Gender // TODO: Unknown
   }
 }

const computeMember = (members: DataMembers, member: DataMember) => {
   const gender = computeGenre(members, member)
   const parents = computeParents(members, member)
   const siblings = computeSiblings(members, member)
   const spouses = computeSpouses(members, member)
   const children = computeChildren(members, member)

   return {
     id: member.id,
     name: member.name,
     from: member.from,
     birthday: member.birthday,
     deathday: member.deathday,
     age: member.age,
     image: member.image,

     gender,
     parents,
     siblings,
     spouses,
     children
   }
 }

 const mapMembers = (rows: Rows) => {
   return rows.map((row) => {
     const name = row[NAME] as string
     const from = row[FROM] as string
     const birthday = row[BIRTHDAY] as string
     const deathday = row[DEFUNCT] as string
     const gender = row[GENDER] as string
     const father = row[FATHER] as string
     const mother = row[MOTHER] as string
     const spouse = row[SPOUSE] as string
     const image = row[IMAGE] as string
     const age = row[AGE] as string

     if (!name) return null

     // NOTE: Ensure unique. Names are not unique sometimes...
     const id = CryptoJS.SHA1(name).toString()

     return {
       id,
       name,
       father,
       mother,
       spouse,
       from,
       birthday,
       deathday,
       image,
       gender,
       age
     }
   })
}

export const computeMembers = async (text: string): Promise<Array<Member>> => {
  const { data } = Papa.parse<IHash<string>>(text, { header: true });

  const members: DataMembers = _.compact(mapMembers(data))

  return members.map((member: DataMember) => computeMember(members, member))
}

export const anonymizeMembers = (members: Array<Member>) => {
  const anonymous = members.map((member, index) => _.pickBy({
    ...member,
    // name: `Member #${index}`,
    from: null,
    birthday: null,
    deathday: null,
    image: null
  }, _.identity))

  return anonymous
}

export const decrypt = (ciphertext: string, passphrase: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    return originalText;
  } catch (e) {
    return '';
  }
}

export const encrypt = (text: string, passphrase: string) => {
  return CryptoJS.AES.encrypt(text, passphrase).toString()
}
