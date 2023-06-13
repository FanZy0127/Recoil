import {atom, useRecoilState, useRecoilValue} from "recoil";


const darkModeAtom = atom({
    // Global State: {darkMode: true/false}
    key: 'darkMode',
    default: false,
})


function DarkModeSwitch() {
    const [darkMode, setDarkMode] = useRecoilState(darkModeAtom)

    console.log('DarkMode : ', darkMode)

    return (
        <input
            type="checkbox"
            checked={darkMode}
            onChange={event => {
                setDarkMode(event.currentTarget.checked)
            }}
        />
    )
}


function Button() {
    const darkMode = useRecoilValue(darkModeAtom)

    return (
        <button style={{backgroundColor: darkMode ? 'black' : 'white', color: darkMode ? 'white' : "black"}}>
            My wonderful UI button
        </button>
    )
}


export function AtomsExample() {
    return (
        <div>
            <div>
                <DarkModeSwitch />
            </div>
            <div>
                <Button />
            </div>
        </div>
    )
}