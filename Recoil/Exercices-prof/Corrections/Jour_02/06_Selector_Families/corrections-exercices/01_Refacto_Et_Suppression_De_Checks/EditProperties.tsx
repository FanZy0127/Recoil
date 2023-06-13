import {InputGroup, InputRightElement, NumberInput, NumberInputField, Text, VStack} from '@chakra-ui/react'
import {selectorFamily, useRecoilState, useRecoilValue} from 'recoil'
import {selectedElementAtom} from './Canvas'
import {elementState} from './components/Rectangle/Rectangle'
import { get as lodashGet, set as lodashSet } from 'lodash'
import produce from 'immer'

// ------------------------------  DÉBUT DE LA CORRECTION DE L'EXERCICE  ------------------------------

// Déstructuration du path en un objet contenant une clé path typée en string et une clé id typée en number.
// Du fait qu'on transmet l'id, plus besoin de passer le choix de paramètre null pour le premier paramètre (type de
// l'argument retourné par le Selector.
const editPropertyState = selectorFamily<number, {path: string, id: number}>({
    key: 'editProperty',
    get: ({path, id}) => ({get}) => {
        // Suppression de nos checks, et passage de l'id à notre Atom Family.
        const element = get(elementState(id))
        return lodashGet(element, path)
    },
    set: ({path, id}) => ({get, set}, newValue) => {
        // Suppression de nos checks, et passage de l'id à notre Atom Family.
        const element = get(elementState(id))
        const newElement = produce(element, (draft) => {
            lodashSet(draft, path, newValue)
        })

        // Passage de l'id à noter Atom Family ici également.
        set(elementState(id), newElement)
    }
})

export function EditProperties() {
    const selectedElement = useRecoilValue(selectedElementAtom)
    // Évidemment, on conserve ce check car c'est celui qui permet de savoir si on doit afficher la sidebar ou non.
    if (selectedElement == null) return null

    return (
        <Card>
            {/* Passage du paramètre id à toutes nos Property, et l'id sera la valeur de notre selectedElement (donc
                un id de type number). */}
            <Section heading="Position">
                <Property label="Top" path="style.position.top" id={selectedElement} />
                <Property label="Left" path="style.position.left" id={selectedElement} />
            </Section>
            <Section heading="Size">
                <Property label="Width" path="style.size.width" id={selectedElement} />
                <Property label="Height" path="style.size.height" id={selectedElement} />
            </Section>
        </Card>
    )
}

const Section: React.FC<{heading: string}> = ({heading, children}) => {
    return (
        <VStack spacing={2} align="flex-start">
            <Text fontWeight="500">{heading}</Text>
            {children}
        </VStack>
    )
}

// Passage de l'id aux définitions des props, avec son typage number.
function Property({label, path, id}: {label: string, path: string, id: number}) {
    // Passage du path et de l'id afin de pouvoir se passer du check.
    const [value, setValue] = useRecoilState(editPropertyState({path, id}))

    return (
        <div>
            <Text fontSize="14px" fontWeight="500" mb="2px">
                {label}
            </Text>
            <InputGroup size="sm" variant="filled">
                <NumberInput value={value} onChange={(_, value) => setValue(value)}>
                    <NumberInputField borderRadius="md" />
                    <InputRightElement pointerEvents="none" children="px" lineHeight="1" fontSize="12px" />
                </NumberInput>
            </InputGroup>
        </div>
    )
}

// ------------------------------  FIN DE LA CORRECTION DE L'EXERCICE  ------------------------------

const Card: React.FC = ({children}) => (
    <VStack
        position="absolute"
        top="20px"
        right="20px"
        backgroundColor="white"
        padding={2}
        boxShadow="md"
        borderRadius="md"
        spacing={3}
        align="flex-start"
        onClick={(e) => e.stopPropagation()}
    >
        {children}
    </VStack>
)