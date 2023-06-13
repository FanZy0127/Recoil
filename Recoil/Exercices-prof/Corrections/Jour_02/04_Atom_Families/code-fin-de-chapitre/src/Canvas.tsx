import {Rectangle} from './components/Rectangle/Rectangle'
import {PageContainer} from './PageContainer'
import {Toolbar} from './Toolbar'
import {atom, useRecoilValue, useSetRecoilState} from 'recoil'

export const selectedElementAtom = atom<number | null>({
    key: 'selectedElement',
    default: null
})

export const elementsAtom = atom<number[]>({
    key: 'elements',
    default: []
})

function Canvas() {
    const setSelectedElement = useSetRecoilState(selectedElementAtom)
    const elements = useRecoilValue(elementsAtom)

    return (
        <PageContainer
            onClick={() => {
                setSelectedElement(null)
            }}
        >
            <Toolbar />
            {elements.map((id) => (
                <Rectangle key={id} id={id} />
            ))}
        </PageContainer>
    )
}

export default Canvas