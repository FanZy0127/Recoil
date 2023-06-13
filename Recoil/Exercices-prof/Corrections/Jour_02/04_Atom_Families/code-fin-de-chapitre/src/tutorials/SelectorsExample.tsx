import {
    Box,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Icon,
    NumberInput,
    NumberInputField,
    Switch,
} from '@chakra-ui/react'
import {ArrowRight} from 'react-feather'
import {atom, selector, useRecoilState} from 'recoil'

const exchangeRate = 0.95

const usdAtom = atom({
    key: 'usd',
    default: 1,
})

// ------------------------------  DÉBUT DE LA CORRECTION DE L'EXERCICE  ------------------------------
const eurSelector = selector<number>({
    key: 'eur',
    get: ({get}) => {
        // on change notre const en let afin de pouvoir modifier la valeur de notre variable
        let usd = get(usdAtom)

        // on crée la condition nous permettant de vérifier que le component gérant la commission est actif
        // en récupèrant le state nous permettant de vérifier que la commission est active via le getter de son atom
        const commissionEnabled = get(commissionEnabledAtom)

        // ici, vous voyez que l'on peut fetch de manière conditionnelle la valeur d'un atom
        // si commissionEnabled est à false, le code s'exécutera sans passer par cette condition
        // ce qui signifie que l'on n'appellera jamais les getter à l'intérieur de cette condition
        // le selector ne sera donc pas rerun de manière inutile
        if (commissionEnabled) {
            // on récupère la commission via le getter de l'atom
            const commission = get(commissionAtom)
            // on réassigne la valeur grâce au petit utilitaire qui avait été créé pour l'occasion (en-bas du fichier)
            usd = removeCommission(usd, commission)
        }

        // Conversion de la valeur avec un arrondi, afin d'éviter les bugs sur certaines valeurs telles que 1 ou 2
        return parseFloat((usd * exchangeRate).toPrecision(5))
    },
    // on ajoute get pour l'avoir dans le scope de notre setter, sinon on ne pourra jamais utiliser le getter
    // nous permettant de récupérer la valeur de la commission
    set: ({set, get}, newEurValue) => {
        // comme nous avons changé usd en let, on change newUsdValue en let afin de pouvoir réassigner sa valeur
        // @ts-ignore
        let newUsdValue = newEurValue / exchangeRate

        const commissionEnabled = get(commissionEnabledAtom)

        if (commissionEnabled) {
            const commission = get(commissionAtom)
            // on réassigne la nouvelle valeur de notre dollar
            newUsdValue = addCommission(newUsdValue, commission)
        }

        // Conversion de la valeur avec un arrondi, afin d'éviter les bugs sur certaines valeurs telles que 1 ou 2
        set(usdAtom, parseFloat(newUsdValue.toPrecision(5)))
    }
})
// ------------------------------  FIN DE LA CORRECTION DE L'EXERCICE  ------------------------------


export function SelectorsExample() {
    const [usd, setUSD] = useRecoilState(usdAtom)
    const [eur, setEUR] = useRecoilState(eurSelector)

    return (
        <div style={{padding: 20}}>
            <Heading size="lg" mb={2}>
                Currency converter
            </Heading>
            <InputStack>
                <CurrencyInput label="usd" amount={usd} onChange={(usd) => setUSD(usd)} />
                <CurrencyInput label="eur" amount={eur} onChange={(eur) => setEUR(eur)} />
            </InputStack>
            <Commission />
        </div>
    )
}

// You can ignore everything below this line.
// It's just a bunch of UI components that we're using in this example.

const InputStack: React.FC = ({children}) => {
    return (
        <HStack
            width="300px"
            mb={4}
            spacing={4}
            divider={
                <Box border="0 !important" height="40px" alignItems="center" display="flex">
                    <Icon as={ArrowRight} />
                </Box>
            }
            align="flex-end"
        >
            {children}
        </HStack>
    )
}

function CurrencyInput({
                           amount,
                           onChange,
                           label,
                       }: {
    label: string
    amount: number
    onChange?: (amount: number) => void
}) {
    let symbol = label === 'usd' ? '$' : '€'

    return (
        <FormControl id={label.toUpperCase()}>
            <FormLabel>{label.toUpperCase()}</FormLabel>
            <NumberInput
                value={`${symbol} ${amount}`}
                onChange={(value) => {
                    const withoutSymbol = value.split(' ')[0]
                    onChange?.(parseFloat(withoutSymbol || '0'))
                }}
            >
                <NumberInputField />
            </NumberInput>
        </FormControl>
    )
}

const commissionEnabledAtom = atom({
    key: 'commissionEnabled',
    default: false,
})

const commissionAtom = atom({
    key: 'commission',
    default: 5,
})

function Commission() {
    const [enabled, setEnabled] = useRecoilState(commissionEnabledAtom)
    const [commission, setCommission] = useRecoilState(commissionAtom)

    return (
        <Box width="300px">
            <FormControl display="flex" alignItems="center" mb={2}>
                <FormLabel htmlFor="includeCommission" mb="0">
                    Include forex commission?
                </FormLabel>
                <Switch
                    id="includeCommission"
                    isChecked={enabled}
                    onChange={(event) => setEnabled(event.currentTarget.checked)}
                />
            </FormControl>
            <NumberInput
                isDisabled={!enabled}
                value={commission}
                onChange={(value) => setCommission(parseFloat(value || '0'))}
            >
                <NumberInputField />
            </NumberInput>
        </Box>
    )
}

function addCommission(amount: number, commission: number) {
    return amount / (1 - commission / 100)
}

function removeCommission(amount: number, commission: number) {
    return amount * (1 - commission / 100)
}