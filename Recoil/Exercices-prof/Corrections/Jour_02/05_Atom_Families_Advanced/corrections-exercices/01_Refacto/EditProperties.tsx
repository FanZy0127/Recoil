import {InputGroup, InputRightElement, NumberInput, NumberInputField, Text, VStack} from '@chakra-ui/react'
import {selector, useRecoilState} from 'recoil'
import {selectedElementAtom} from './Canvas'
import {Element, elementState} from './components/Rectangle/Rectangle'

const selectedElementProperties = selector<Element | undefined>({
    key: 'selectedElementProperties',
    get: ({get}) => {
        const selectedElementId = get(selectedElementAtom)

        if (selectedElementId == null) return

        return get(elementState(selectedElementId))
    },
    set: ({get, set}, newElement) => {
        const selectedElementId = get(selectedElementAtom)

        if (selectedElementId == null) return
        if (!newElement) return

        return set(elementState(selectedElementId), newElement)
    }
})

// ------------------------------  DÉBUT DE LA CORRECTION DE L'EXERCICE  ------------------------------
export function EditProperties() {
    const [element, setElement] = useRecoilState(selectedElementProperties)

    if (!element) return null

    // Mise en place d'un helper prenant en argument une property qui peut être "top" ou "left"
    // ainsi qu'une value qui sera un number
    const setPosition = (property: 'top' | 'left', value: number) => {
        setElement({
            ...element,
            style: {
                ...element.style,
                position: {
                    ...element.style.position,
                    // nom de property dynamique et value correspond à la valeur désirée
                    [property] : value,
                }
            }
        })
    }

    return (
        <Card>
            <Section heading="Position">
                <Property
                    label="Top"
                    value={element.style.position.top}
                    // Appel du helper sur l'événement onChange pour faire le setting du top
                    onChange={(top) => {setPosition('top', top)}
                } />
                <Property
                    label="Left"
                    value={element.style.position.left}
                    // Appel du helper sur l'événement onChange pour faire le setting du left
                    onChange={(left) => {setPosition('left', left)
                }} />
            </Section>
        </Card>
    )
}
// ------------------------------  FIN DE LA CORRECTION DE L'EXERCICE  ------------------------------

const Section: React.FC<{heading: string}> = ({heading, children}) => {
    return (
        <VStack spacing={2} align="flex-start">
            <Text fontWeight="500">{heading}</Text>
            {children}
        </VStack>
    )
}

function Property({label, value, onChange}: {label: string; value: number; onChange: (value: number) => void}) {
    return (
        <div>
            <Text fontSize="14px" fontWeight="500" mb="2px">
                {label}
            </Text>
            <InputGroup size="sm" variant="filled">
                <NumberInput value={value} onChange={(_, value) => onChange(value)}>
                    <NumberInputField borderRadius="md" />
                    <InputRightElement pointerEvents="none" children="px" lineHeight="1" fontSize="12px" />
                </NumberInput>
            </InputGroup>
        </div>
    )
}

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